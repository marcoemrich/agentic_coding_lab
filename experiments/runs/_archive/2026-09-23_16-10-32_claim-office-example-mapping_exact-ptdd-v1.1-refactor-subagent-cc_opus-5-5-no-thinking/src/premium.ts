import type { InsuredItem } from "./insured-item";
import { isComponent, unitBasePremium } from "./price-list";

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const PERCENT = 100;
// Amounts are kept in hundredths of a G so percentages stay exact until the final rounding.
const HUNDREDTHS_PER_G = 100;

function countAlikeItems(items: InsuredItem[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

function isBuildingBlock(type: string, count: number): boolean {
  return isComponent(type) && count === BLOCK_SIZE;
}

function basePremiumForAlikeItems(type: string, count: number): number {
  return isBuildingBlock(type, count) ? BLOCK_BASE_PREMIUM : count * unitBasePremium(type);
}

function policyBasePremium(items: InsuredItem[]): number {
  let sum = 0;
  for (const [type, count] of countAlikeItems(items)) sum += basePremiumForAlikeItems(type, count);
  return sum;
}

function inHundredths(amountInG: number): number {
  return amountInG * HUNDREDTHS_PER_G;
}

function roundPremiumInMhpcoFavor(amountInHundredths: number): number {
  return Math.ceil(amountInHundredths / HUNDREDTHS_PER_G);
}

function percentOf(amount: number, percent: number): number {
  return (amount * percent) / PERCENT;
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function loyaltyDiscountInHundredths(policyBaseInHundredths: number, customer: Customer): number {
  return isLongStandingCustomer(customer) ? percentOf(policyBaseInHundredths, LOYALTY_DISCOUNT_PERCENT) : 0;
}

// Customers receive the follow-up discount on each contract after their first quote in the scenario.
export function isAfterFirstQuote(quoteIndex: number): boolean {
  return quoteIndex > 0;
}

function followUpDiscountInHundredths(policyBaseInHundredths: number, isFollowUpContract: boolean): number {
  return isFollowUpContract ? percentOf(policyBaseInHundredths, FOLLOW_UP_DISCOUNT_PERCENT) : 0;
}

// Policy-wide modifiers apply to the policy base premium (the sum of all item base premiums).
function policyModifiersInHundredths(
  policyBaseInHundredths: number,
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  return (
    percentOf(policyBaseInHundredths, FIRST_INSURANCE_SURCHARGE_PERCENT) -
    loyaltyDiscountInHundredths(policyBaseInHundredths, customer) -
    followUpDiscountInHundredths(policyBaseInHundredths, isFollowUpContract)
  );
}

function isCursed(item: InsuredItem): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: InsuredItem): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

// Item-specific modifiers apply to the base premium of the affected item only.
const ITEM_RISK_SURCHARGES = [
  { appliesTo: isCursed, percent: CURSE_SURCHARGE_PERCENT },
  { appliesTo: isHighlyEnchanted, percent: HIGH_ENCHANTMENT_SURCHARGE_PERCENT },
];

function itemRiskSurchargesInHundredths(item: InsuredItem): number {
  const itemBaseInHundredths = inHundredths(unitBasePremium(item.type));
  return ITEM_RISK_SURCHARGES.filter((surcharge) => surcharge.appliesTo(item)).reduce(
    (sum, surcharge) => sum + percentOf(itemBaseInHundredths, surcharge.percent),
    0,
  );
}

function itemSurchargesInHundredths(items: InsuredItem[]): number {
  return items.reduce((sum, item) => sum + itemRiskSurchargesInHundredths(item), 0);
}

export function quotePremium(items: InsuredItem[], customer: Customer, isFollowUpContract: boolean): number {
  const policyBaseInHundredths = inHundredths(policyBasePremium(items));
  const premiumInHundredths =
    policyBaseInHundredths +
    policyModifiersInHundredths(policyBaseInHundredths, customer, isFollowUpContract) +
    itemSurchargesInHundredths(items);
  return roundPremiumInMhpcoFavor(premiumInHundredths) + PROCESSING_FEE;
}
