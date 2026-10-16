import { percentOf, roundPremiumInMhpcoFavor } from "./amounts.js";
import { BLOCK_BASE_PREMIUM, BLOCK_SIZE, COMPONENT, isComponent, MAIN_ITEMS, mainItem } from "./priceList.js";

export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Customer = { yearsWithMHPCO: number };
export type QuoteResult = { premium: number };

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

// A building block of exactly 3 alike components has a special base premium.
function basePremiumOfComponents(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT.basePremium;
}

function basePremiumOfAlikeItems(type: string, count: number): number {
  if (isComponent(type)) return basePremiumOfComponents(count);
  return count * mainItem(type).basePremium;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

// The sum of all item base premiums, with building blocks applied.
function policyBasePremium(items: Item[]): number {
  let sum = 0;
  for (const [type, count] of countByType(items)) sum += basePremiumOfAlikeItems(type, count);
  return sum;
}

// Item-specific modifiers apply to the base premium of the affected item.
const isHighlyEnchantedForPremium = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

function surchargePercentOf(item: Item): number {
  let percent = 0;
  if (item.cursed) percent += CURSE_SURCHARGE_PERCENT;
  if (isHighlyEnchantedForPremium(item)) percent += HIGH_ENCHANTMENT_SURCHARGE_PERCENT;
  return percent;
}

function itemSurcharges(items: Item[]): number {
  return items.reduce(
    (sum, item) => sum + percentOf(MAIN_ITEMS[item.type]?.basePremium ?? 0, surchargePercentOf(item)),
    0,
  );
}

// Policy-wide modifiers apply to the policy base premium.
const isLongStandingCustomer = (customer: Customer): boolean => customer.yearsWithMHPCO >= LOYALTY_YEARS;

// Every contract after the customer's first is a follow-up contract.
const isFollowUpContract = (earlierContracts: number): boolean => earlierContracts > 0;

function policyWideModifiers(basePremium: number, customer: Customer, earlierContracts: number): number {
  let percent = FIRST_INSURANCE_SURCHARGE_PERCENT;
  if (isLongStandingCustomer(customer)) percent -= LOYALTY_DISCOUNT_PERCENT;
  if (isFollowUpContract(earlierContracts)) percent -= FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT;
  return percentOf(basePremium, percent);
}

export function quote(items: Item[], customer: Customer, earlierContracts: number): QuoteResult {
  const basePremium = policyBasePremium(items);
  const premium =
    basePremium +
    itemSurcharges(items) +
    policyWideModifiers(basePremium, customer, earlierContracts) +
    PROCESSING_FEE;
  return { premium: roundPremiumInMhpcoFavor(premium) };
}
