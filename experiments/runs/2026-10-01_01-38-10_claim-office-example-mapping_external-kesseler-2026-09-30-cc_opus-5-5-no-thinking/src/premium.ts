import { Item, kindOf } from './catalog';

export interface Customer {
  yearsWithMHPCO: number;
}

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const PERCENT = 100;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const HIGH_ENCHANTMENT = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

function groupPremium(type: string, count: number): number {
  const kind = kindOf(type);
  if (kind.component && count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * kind.basePremium;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  items.forEach((item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1));
  return counts;
}

export function basePremium(items: Item[]): number {
  return [...countByType(items)].reduce((sum, [type, count]) => sum + groupPremium(type, count), 0);
}

function surchargePercent(item: Item): number {
  let percent = 0;
  if (item.cursed) {
    percent += CURSE_SURCHARGE_PERCENT;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT) {
    percent += HIGH_ENCHANTMENT_SURCHARGE_PERCENT;
  }
  return percent;
}

function itemSurchargesInPercent(items: Item[]): number {
  const counts = countByType(items);
  return items.reduce((sum, item) => {
    const count = counts.get(item.type) ?? 0;
    return sum + (groupPremium(item.type, count) / count) * surchargePercent(item);
  }, 0);
}

function policyPercent(customer: Customer, isFollowUp: boolean): number {
  let percent = FIRST_INSURANCE_SURCHARGE_PERCENT;
  if (isFollowUp) {
    percent -= FOLLOW_UP_DISCOUNT_PERCENT;
  }
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    percent -= LOYALTY_DISCOUNT_PERCENT;
  }
  return percent;
}

export function quotePremium(items: Item[], customer: Customer, isFollowUp: boolean): number {
  const base = basePremium(items);
  const policyModifierInPercent = base * policyPercent(customer, isFollowUp);
  return Math.ceil((itemSurchargesInPercent(items) + policyModifierInPercent) / PERCENT) + base + PROCESSING_FEE;
}
