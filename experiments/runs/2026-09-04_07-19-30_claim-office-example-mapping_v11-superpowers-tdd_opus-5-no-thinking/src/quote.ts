export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteResult {
  premium: number;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

export function isKnownItemType(type: string): boolean {
  return isComponent(type) || type in BASE_PREMIUMS;
}

function assertKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

/**
 * Base premium of a whole policy: main items at their list price, components
 * priced per type — exactly three alike components form a discounted block.
 */
export function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    if (!isComponent(item.type)) total += BASE_PREMIUMS[item.type];
  }
  for (const [type, count] of countByType(items)) {
    if (!isComponent(type)) continue;
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
  }
  return total;
}

/**
 * Item-specific surcharges apply to the base premium of the affected item.
 * Components carry neither a curse nor an enchantment level.
 */
function itemSurcharges(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    if (isComponent(item.type)) continue;
    const base = BASE_PREMIUMS[item.type];
    if (item.cursed) total += base * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
  }
  return total;
}

export function premiumBeforePolicyModifiers(items: Item[]): number {
  return policyBasePremium(items) + itemSurcharges(items);
}

/** Amounts are rounded in the MHPCO's favour: premiums up, payouts down. */
function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

/**
 * Policy-wide modifiers apply to the policy base premium (the sum of all item
 * base premiums); the processing fee is added at the very end.
 */
export function quote(
  customer: Customer,
  items: Item[],
  priorContracts: number,
): QuoteResult {
  assertKnownItemTypes(items);
  const base = policyBasePremium(items);
  let premium = premiumBeforePolicyModifiers(items);

  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    premium -= base * LOYALTY_DISCOUNT;
  }
  premium += base * FIRST_INSURANCE_SURCHARGE;
  if (priorContracts > 0) {
    premium -= base * FOLLOW_UP_DISCOUNT;
  }

  return { premium: roundPremium(premium + PROCESSING_FEE) };
}
