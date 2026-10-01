export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Quote {
  premium: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_TYPES = ['rune', 'moonstone'];
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

export class UnknownItemTypeError extends Error {
  constructor(type: string) {
    super(`unknown item type: ${type}`);
  }
}

function basePremium(item: Item): number {
  if (isComponent(item.type)) return COMPONENT_BASE_PREMIUM;
  const base = BASE_PREMIUMS[item.type];
  if (base === undefined) throw new UnknownItemTypeError(item.type);
  return base;
}

export function insuranceValue(item: Item): number {
  if (isComponent(item.type)) return COMPONENT_INSURANCE_VALUE;
  const value = INSURANCE_VALUES[item.type];
  if (value === undefined) throw new UnknownItemTypeError(item.type);
  return value;
}

/**
 * The insurance sum is unaffected by block discounts and premium modifiers,
 * which change the premium only.
 */
export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValue(item), 0);
}

/**
 * A block of exactly BLOCK_SIZE alike components (same type) is offered at a
 * special rate. "Alike" means the same component type, so each type is
 * counted separately; a count other than exactly BLOCK_SIZE gets no discount.
 */
export function policyBasePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let total = 0;

  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += basePremium(item);
    }
  }

  for (const count of componentCounts.values()) {
    total += count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
  }

  return total;
}

/**
 * Item-specific modifiers apply to the base premium of the affected item;
 * policy-wide modifiers apply to the policy base premium. Every item in a
 * quote counts as a first insurance, regardless of customer history.
 */
export function quote(customer: Customer, items: Item[], priorContracts: number): Quote {
  const policyBase = policyBasePremium(items);

  let total = policyBase;
  for (const item of items) {
    const itemBase = basePremium(item);
    if (item.cursed) total += itemBase * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += itemBase * HIGH_ENCHANTMENT_SURCHARGE;
    }
  }

  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) total -= policyBase * LOYALTY_DISCOUNT;
  total += policyBase * FIRST_INSURANCE_SURCHARGE;
  if (priorContracts > 0) total -= policyBase * FOLLOW_UP_CONTRACT_DISCOUNT;

  return { premium: Math.ceil(total + PROCESSING_FEE) };
}
