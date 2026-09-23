import { basePremium, isComponent, type Item } from "./priceList.js";

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const PERCENT = 100;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

function alikeItemsBasePremium(type: string, count: number): number {
  if (isComponent(type) && count === BLOCK_SIZE) return BLOCK_BASE_PREMIUM;
  return count * basePremium(type);
}

function policyBasePremium(items: Item[]): number {
  let sum = 0;
  for (const [type, count] of countByType(items)) sum += alikeItemsBasePremium(type, count);
  return sum;
}

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemSurchargePercent(item: Item): number {
  let percent = 0;
  if (item.cursed) percent += CURSE_SURCHARGE_PERCENT;
  if (isHighlyEnchanted(item)) percent += HIGH_ENCHANTMENT_SURCHARGE_PERCENT;
  return percent;
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + (basePremium(item.type) * itemSurchargePercent(item)) / PERCENT, 0);
}

export interface Customer {
  yearsWithMHPCO: number;
}

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function policyModifierPercent(customer: Customer, isFollowUpContract: boolean): number {
  let percent = FIRST_INSURANCE_SURCHARGE_PERCENT;
  if (isLongStandingCustomer(customer)) percent -= LOYALTY_DISCOUNT_PERCENT;
  if (isFollowUpContract) percent -= FOLLOW_UP_DISCOUNT_PERCENT;
  return percent;
}

export function quotePremium(items: Item[], customer: Customer, isFollowUpContract: boolean): number {
  const policyBase = policyBasePremium(items);
  const modifierPercent = policyModifierPercent(customer, isFollowUpContract);
  const policyPremium = (policyBase * (PERCENT + modifierPercent)) / PERCENT + itemSurcharges(items);
  return Math.ceil(policyPremium + PROCESSING_FEE);
}
