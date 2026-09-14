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
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;
const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export function insuranceValueOf(item: Item): number {
  const value = INSURANCE_VALUES[item.type];
  if (value === undefined) {
    throw new Error(`unknown item type: ${item.type}`);
  }
  return value;
}

export function quotePremium(
  items: Item[],
  customer: Customer,
  contractIndex: number,
): number {
  const policyBase = policyBasePremium(items);
  const itemSurcharges = items.reduce((sum, item) => sum + itemSurchargeOf(item), 0);
  let policyRate = FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    policyRate -= LOYALTY_DISCOUNT;
  }
  if (contractIndex > 0) {
    policyRate -= FOLLOW_UP_CONTRACT_DISCOUNT;
  }
  return Math.ceil(policyBase + itemSurcharges + policyBase * policyRate + PROCESSING_FEE);
}

function policyBasePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let total = 0;
  for (const item of items) {
    const base = basePremiumOf(item);
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
    total += base;
  }
  for (const [type, count] of componentCounts) {
    if (count === BLOCK_SIZE) {
      total -= BASE_PREMIUMS[type] * BLOCK_SIZE - BLOCK_PREMIUM;
    }
  }
  return total;
}

function itemSurchargeOf(item: Item): number {
  const base = basePremiumOf(item);
  let rate = 0;
  if (item.cursed) {
    rate += CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    rate += HIGH_ENCHANTMENT_SURCHARGE;
  }
  return base * rate;
}

function basePremiumOf(item: Item): number {
  const base = BASE_PREMIUMS[item.type];
  if (base === undefined) {
    throw new Error(`unknown item type: ${item.type}`);
  }
  return base;
}
