import { COMPONENT_TYPES, lookUp, type Item } from './catalogue';

export type { Item } from './catalogue';

export type Customer = {
  yearsWithMHPCO: number;
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;

function blockDiscount(items: Item[]): number {
  let discount = 0;
  for (const type of COMPONENT_TYPES) {
    const count = items.filter((item) => item.type === type).length;
    if (count === COMPONENT_BLOCK_SIZE) {
      discount += count * lookUp(type).basePremium - COMPONENT_BLOCK_PREMIUM;
    }
  }
  return discount;
}

function itemSurcharge(item: Item, basePremium: number): number {
  let surcharge = 0;
  if (item.cursed) {
    surcharge += basePremium * CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    surcharge += basePremium * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

export function quote(
  items: Item[],
  customer: Customer = { yearsWithMHPCO: 0 },
  previousContracts = 0,
): number {
  let base = 0;
  let surcharges = 0;
  for (const item of items) {
    const { basePremium } = lookUp(item.type);
    base += basePremium;
    surcharges += itemSurcharge(item, basePremium);
  }
  base -= blockDiscount(items);

  let policyModifiers = base * FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    policyModifiers -= base * LOYALTY_DISCOUNT;
  }
  if (previousContracts >= 1) {
    policyModifiers -= base * FOLLOW_UP_DISCOUNT;
  }

  return Math.ceil(base + surcharges + policyModifiers + PROCESSING_FEE);
}
