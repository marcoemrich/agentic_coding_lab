// Refactored: extracted isComponent (DRY: was repeated 3x) and
// componentBlockPremium (reveals intent of the 3-for-60 pricing rule).
// Unified MAIN_ITEM_BASE_PREMIUM and KNOWN_TYPES into a single ITEM_BASE_PREMIUM
// lookup: presence in the map now means "known type" and the value is its
// base premium, eliminating the duplicated check and the parallel set.
export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_BASE_PREMIUM = 60;
const BLOCK_SIZE = 3;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;

// Single source of truth for known item types and their base premiums.
// Presence in this map means the type is recognised; the value is its base
// premium. Components (rune, moonstone) share COMPONENT_BASE_PREMIUM.
const ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

export class UnknownItemTypeError extends Error {
  constructor(public readonly itemType: string) {
    super(`Unknown item type: ${itemType}`);
    this.name = "UnknownItemTypeError";
  }
}

const itemBasePremium = (item: Item): number => {
  const premium = ITEM_BASE_PREMIUM[item.type];
  if (premium === undefined) {
    throw new UnknownItemTypeError(item.type);
  }
  return premium;
};

// Block pricing: 3 of the same component type cost BLOCK_BASE_PREMIUM instead of 3 * COMPONENT_BASE_PREMIUM.
const componentBlockPremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;

// A "high enchantment" is an enchantment level that triggers the high-enchantment surcharge.
const hasHighEnchantment = (item: Item): boolean =>
  item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD;

// Sum of every rate-based surcharge that applies to a single item
// (cursed, high-enchantment, ...). Rates multiply the item's base premium.
const itemSurcharge = (item: Item, base: number): number =>
  (item.cursed ? base * CURSED_SURCHARGE_RATE : 0) +
  (hasHighEnchantment(item) ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

interface AccumulationResult {
  itemBaseTotal: number;
  policyBase: number;
  surcharges: number;
  componentCounts: Map<string, number>;
}

const accumulatePerItem = (items: Item[]): AccumulationResult => {
  const componentCounts = new Map<string, number>();
  let itemBaseTotal = 0;
  let policyBase = 0;
  let surcharges = 0;
  for (const item of items) {
    const base = itemBasePremium(item);
    itemBaseTotal += base;
    surcharges += itemSurcharge(item, base);
    if (isComponent(item)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      policyBase += base;
    }
  }
  return { itemBaseTotal, policyBase, surcharges, componentCounts };
};

// Premium calculation pipeline:
//   1. Per-item accumulation: base premium + rate-based surcharges (cursed, high enchantment)
//   2. Component block pricing: 3 of the same type → BLOCK_BASE_PREMIUM instead of 3 × COMPONENT_BASE_PREMIUM
//   3. Policy-level rates: first insurance on total item bases; loyalty discount on policy base
//   4. Flat processing fee, then round up to whole G
export const calculatePremium = (
  items: Item[],
  customer: Customer,
  isFirstContract: boolean,
): number => {
  if (items.length === 0) {
    return PROCESSING_FEE;
  }
  const { itemBaseTotal, policyBase, surcharges, componentCounts } = accumulatePerItem(items);
  let blockAdjustedPolicyBase = policyBase;
  for (const count of componentCounts.values()) {
    blockAdjustedPolicyBase += componentBlockPremium(count);
  }
  const firstInsurance = itemBaseTotal * FIRST_INSURANCE_RATE;
  const loyaltyRate =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? LOYALTY_DISCOUNT_RATE : 0;
  const followUpRate = isFirstContract ? 0 : FOLLOW_UP_DISCOUNT_RATE;
  return Math.ceil(
    blockAdjustedPolicyBase +
      surcharges +
      firstInsurance -
      blockAdjustedPolicyBase * loyaltyRate -
      blockAdjustedPolicyBase * followUpRate +
      PROCESSING_FEE,
  );
};
