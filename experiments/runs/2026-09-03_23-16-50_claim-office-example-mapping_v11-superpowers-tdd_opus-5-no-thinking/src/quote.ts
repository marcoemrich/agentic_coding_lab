export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  items: Item[];
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteResult {
  premium: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

export const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = ['rune', 'moonstone'];
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

/**
 * The building-block rate applies only to a group of exactly 3 alike
 * components; any other count is priced per component (4 runes → 100 G,
 * 7 runes → 175 G).
 */
function componentsBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

/** Item-specific modifiers apply to that item's own base premium. */
function itemPremium(item: Item, base: number): number {
  let premium = base;
  if (item.cursed) premium += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    premium += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return premium;
}

interface PolicyPremium {
  /** Sum of the unmodified base premiums of every insured item. */
  base: number;
  /** Curse and high-enchantment surcharges, each scoped to one item. */
  itemSurcharges: number;
}

function policyPremium(items: Item[]): PolicyPremium {
  let base = 0;
  let itemSurcharges = 0;
  const componentCounts = new Map<string, number>();

  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
      continue;
    }
    const itemBase = BASE_PREMIUMS[item.type];
    if (itemBase === undefined) {
      throw new Error(`unknown item type: ${item.type}`);
    }
    base += itemBase;
    itemSurcharges += itemPremium(item, itemBase) - itemBase;
  }

  for (const count of componentCounts.values()) {
    base += componentsBasePremium(count);
  }

  return { base, itemSurcharges };
}

/**
 * Policy-wide modifiers are percentages of the policy base premium, so they
 * are unaffected by the item-specific surcharges.
 */
function policyModifiers(base: number, customer: Customer, previousContracts: number): number {
  let modifiers = base * FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    modifiers -= base * LOYALTY_DISCOUNT;
  }
  if (previousContracts > 0) {
    modifiers -= base * FOLLOW_UP_DISCOUNT;
  }
  return modifiers;
}

export function quote(
  step: QuoteStep,
  customer: Customer,
  previousContracts: number,
): QuoteResult {
  const { base, itemSurcharges } = policyPremium(step.items);
  const total =
    base + itemSurcharges + policyModifiers(base, customer, previousContracts) + PROCESSING_FEE;

  // Only the final premium is rounded, and always in the MHPCO's favour.
  return { premium: Math.ceil(total) };
}
