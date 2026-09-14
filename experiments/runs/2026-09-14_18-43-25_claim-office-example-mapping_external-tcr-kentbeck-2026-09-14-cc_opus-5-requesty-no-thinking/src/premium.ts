import { BLOCK_PREMIUM, BLOCK_SIZE, isComponent, lookup } from './pricelist';

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export function itemBasePremium(item: Item): number {
  return lookup(item.type).basePremium;
}

export function policyBasePremium(items: Item[]): number {
  let total = 0;
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    const spec = lookup(item.type);
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += spec.basePremium;
    }
  }
  for (const [type, count] of componentCounts) {
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * lookup(type).basePremium;
  }
  return total;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + lookup(item.type).insuranceValue, 0);
}

export const CURSE_SURCHARGE = 0.5;
export const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
export const HIGH_ENCHANTMENT_LEVEL = 5;
export const LOYALTY_DISCOUNT = 0.2;
export const LOYALTY_YEARS = 2;
export const FIRST_INSURANCE_SURCHARGE = 0.1;
export const FOLLOW_UP_DISCOUNT = 0.15;
export const PROCESSING_FEE = 5;

export interface Customer {
  yearsWithMHPCO: number;
}

function itemSurcharges(item: Item): number {
  const base = itemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

export function quotePremium(
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  const base = policyBasePremium(items);
  let total = base;
  for (const item of items) total += itemSurcharges(item);
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) total -= base * LOYALTY_DISCOUNT;
  total += base * FIRST_INSURANCE_SURCHARGE;
  if (isFollowUpContract) total -= base * FOLLOW_UP_DISCOUNT;
  return Math.ceil(total + PROCESSING_FEE);
}
