export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

export function quote(items: Item[], customer: Customer, contractIndex: number): number {
  const base = policyBasePremium(items);
  const surcharges = items.reduce((total, item) => total + itemSurcharges(item), 0);
  return Math.ceil(base + surcharges + policyAdjustments(base, customer, contractIndex) + PROCESSING_FEE);
}

function basePremiumOf(item: Item): number {
  const premium = BASE_PREMIUM[item.type];
  if (premium === undefined) {
    throw new Error(`unknown item type: ${item.type}`);
  }
  return premium;
}

/** The sum of all item base premiums, less the building block rebate. */
function policyBasePremium(items: Item[]): number {
  const listed = items.reduce((total, item) => total + basePremiumOf(item), 0);
  return listed - blockDiscount(items);
}

/** Item-specific modifiers, applied to the affected item's own base premium. */
function itemSurcharges(item: Item): number {
  const itemBase = basePremiumOf(item);
  let surcharges = 0;
  if (item.cursed === true) {
    surcharges += itemBase * CURSE_SURCHARGE;
  }
  if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_LEVEL) {
    surcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharges;
}

/** Policy-wide modifiers, applied to the policy base premium. */
function policyAdjustments(base: number, customer: Customer, contractIndex: number): number {
  let adjustments = base * FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    adjustments -= base * LOYALTY_DISCOUNT;
  }
  if (contractIndex > 0) {
    adjustments -= base * FOLLOW_UP_DISCOUNT;
  }
  return adjustments;
}

/** A block of exactly BLOCK_SIZE alike components is offered at BLOCK_PREMIUM. */
function blockDiscount(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  let discount = 0;
  for (const [type, count] of counts) {
    if (count === BLOCK_SIZE) {
      discount += BASE_PREMIUM[type] * BLOCK_SIZE - BLOCK_PREMIUM;
    }
  }
  return discount;
}
