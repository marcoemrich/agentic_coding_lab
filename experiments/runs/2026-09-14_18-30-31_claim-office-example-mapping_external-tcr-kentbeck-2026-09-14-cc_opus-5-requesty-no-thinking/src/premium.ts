import { isComponent, lookupItem } from './catalog.js';

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export class UnknownItemError extends Error {
  constructor(type: string) {
    super(`Unknown item type: ${type}`);
  }
}

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

export function componentGroupPremium(count: number, unitPremium: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * unitPremium;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

function itemModifiers(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    const base = lookupItem(item.type)!.basePremium;
    if (item.cursed) {
      total += base * CURSED_SURCHARGE;
    }
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
  }
  return total;
}

export function quotePremium(items: Item[], customer: Customer, isFollowUp: boolean): number {
  const base = policyBasePremium(items);
  let total = base + itemModifiers(items);
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    total -= base * LOYALTY_DISCOUNT;
  }
  total += base * FIRST_INSURANCE_SURCHARGE;
  if (isFollowUp) {
    total -= base * FOLLOW_UP_DISCOUNT;
  }
  return Math.ceil(total + PROCESSING_FEE);
}

export function policyBasePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let total = 0;
  for (const item of items) {
    const spec = lookupItem(item.type);
    if (!spec) {
      throw new UnknownItemError(item.type);
    }
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += spec.basePremium;
    }
  }
  for (const [type, count] of componentCounts) {
    total += componentGroupPremium(count, lookupItem(type)!.basePremium);
  }
  return total;
}
