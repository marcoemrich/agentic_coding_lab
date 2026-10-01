import { catalogEntry } from './catalog';
import { percentOf } from './percent';

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_PERCENT = 20;
const FOLLOW_UP_PERCENT = 15;
const CURSE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_PERCENT = 30;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

export function basePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  let sum = 0;
  for (const [type, count] of counts) {
    const entry = catalogEntry(type);
    sum += entry.component && count === BLOCK_SIZE ? BLOCK_PREMIUM : count * entry.basePremium;
  }
  return sum;
}

export function quotePremium(items: Item[], customer: Customer, followUp: boolean): number {
  const base = basePremium(items);
  const itemSurcharges = items.reduce(
    (sum, item) => sum + percentOf(catalogEntry(item.type).basePremium, itemSurchargePercent(item)),
    0,
  );
  const policyModifiers = percentOf(base, policyModifierPercent(customer, followUp));
  return Math.ceil(base + itemSurcharges + policyModifiers + PROCESSING_FEE);
}

function policyModifierPercent(customer: Customer, followUp: boolean): number {
  let percent = FIRST_INSURANCE_PERCENT;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    percent -= LOYALTY_PERCENT;
  }
  if (followUp) {
    percent -= FOLLOW_UP_PERCENT;
  }
  return percent;
}

function itemSurchargePercent(item: Item): number {
  let percent = 0;
  if (item.cursed) {
    percent += CURSE_PERCENT;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    percent += HIGH_ENCHANTMENT_PERCENT;
  }
  return percent;
}
