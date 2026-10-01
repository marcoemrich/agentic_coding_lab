export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = ['rune', 'moonstone'];
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

/** Premiums are rounded up — the MHPCO's favour. */
export function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

/** Base premium of a single item, ignoring any building-block discount. */
export function itemBasePremium(item: Item): number {
  if (isComponent(item.type)) return COMPONENT_BASE_PREMIUM;
  const base = MAIN_ITEM_BASE_PREMIUMS[item.type];
  if (base === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return base;
}

/**
 * Sum of all item base premiums, with the building-block discount applied:
 * exactly 3 alike components ("alike" = same type) cost 60 G instead of 75 G.
 */
export function policyBasePremium(items: Item[]): number {
  let total = 0;
  const componentCounts = new Map<string, number>();

  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += itemBasePremium(item);
    }
  }

  for (const count of componentCounts.values()) {
    total += count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
  }

  return total;
}

/** Surcharges that attach to a single item's own base premium. */
function itemSurcharges(item: Item): number {
  const base = itemBasePremium(item);
  let surcharges = 0;
  if (item.cursed) surcharges += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharges += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharges;
}

export interface PremiumOptions {
  /** Whether the 10 % initial assessment surcharge applies to this quote. */
  firstInsurance?: boolean;
}

/**
 * Premium as an exact fraction, before the processing fee is added.
 * Item-specific modifiers apply to the affected item's base premium;
 * policy-wide modifiers apply to the policy base premium.
 */
export function premiumBeforeFee(
  customer: Customer,
  items: Item[],
  previousContracts: number,
  options: PremiumOptions = {},
): number {
  const { firstInsurance = true } = options;
  const base = policyBasePremium(items);

  let total = base;
  for (const item of items) total += itemSurcharges(item);

  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) total -= base * LOYALTY_DISCOUNT;
  if (firstInsurance) total += base * FIRST_INSURANCE_SURCHARGE;
  if (previousContracts > 0) total -= base * FOLLOW_UP_CONTRACT_DISCOUNT;

  return total;
}

export function quotePremium(
  customer: Customer,
  items: Item[],
  previousContracts: number,
): number {
  return roundPremium(premiumBeforeFee(customer, items, previousContracts) + PROCESSING_FEE);
}
