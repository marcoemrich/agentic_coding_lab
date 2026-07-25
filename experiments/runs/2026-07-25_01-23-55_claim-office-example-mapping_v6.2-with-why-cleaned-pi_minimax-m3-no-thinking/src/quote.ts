import type { Customer, Item } from "./types.js";

export type QuoteResult = {
  premium: number;
  insuranceSum: number;
};

/** Flat processing fee charged on every quote, regardless of items covered. */
const PROCESSING_FEE = 5;

/** Base premium and insurance sum for a single main (non-component) item of each type. */
const MAIN_ITEM_BASES: Record<string, { premium: number; insurance: number }> = {
  sword: { premium: 100, insurance: 1000 },
  amulet: { premium: 60, insurance: 600 },
  staff: { premium: 80, insurance: 800 },
  potion: { premium: 40, insurance: 400 },
};

/** Per-item base premium and insurance sum for a component (e.g. rune, moonstone). */
const COMPONENT_PREMIUM = 25;
const COMPONENT_INSURANCE = 250;

/** Component block rule: when a single type has exactly this many items, charge BLOCK_PREMIUM instead of count * COMPONENT_PREMIUM. */
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

/** Set of all known component item types. Any type not in this set and not a main item is considered unknown. */
const KNOWN_COMPONENT_TYPES: ReadonlySet<string> = new Set(["rune", "moonstone"]);

/** Policy-wide modifier rates. They are summed additively into one net modifier applied to the policy base. */
const FIRST_INSURANCE_RATE = 0.10;
const LOYALTY_DISCOUNT_RATE = 0.20;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

/** Item-specific modifier rates (cursed, high enchantment) applied to a main item's base premium. */
const CURSED_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

type TypeBase = {
  /** Total base premium for all items of this type (counts the block discount for components). */
  premium: number;
  /** Total insurance sum for all items of this type. */
  insurance: number;
  /** Per-item base premium, used when applying per-item modifiers to main items. */
  perItemBase: number;
  /** True for main items (sword/amulet/staff/potion), false for components. */
  isMainItem: boolean;
};

/** Compute totals and per-item base for all items of a single type. Applies the component block rule. Throws on unknown item types. */
function computeTypeBase(type: string, count: number): TypeBase {
  const mainBase = MAIN_ITEM_BASES[type];
  if (mainBase) {
    return {
      premium: mainBase.premium * count,
      insurance: mainBase.insurance * count,
      perItemBase: mainBase.premium,
      isMainItem: true,
    };
  }
  if (!KNOWN_COMPONENT_TYPES.has(type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return {
    premium: count === BLOCK_SIZE ? BLOCK_PREMIUM : COMPONENT_PREMIUM * count,
    insurance: COMPONENT_INSURANCE * count,
    perItemBase: COMPONENT_PREMIUM,
    isMainItem: false,
  };
}

/** Apply item-specific modifiers (cursed, high enchantment) to a main item's base premium. Components are never passed here. */
function applyMainItemModifiers(item: Item, basePremium: number): number {
  const cursedBonus = item.cursed ? CURSED_RATE : 0;
  const highEnchantmentBonus =
    item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD
      ? HIGH_ENCHANTMENT_RATE
      : 0;
  return basePremium * (1 + cursedBonus + highEnchantmentBonus);
}

/** Sum the per-item-adjusted premium for all items of a main item type. Components have no per-item modifiers and never reach this helper. */
function sumMainItemAdjustedPremiums(perItemBase: number, items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    sum += applyMainItemModifiers(item, perItemBase);
  }
  return sum;
}

/** Sum the adjusted premium for all items of one type. Main items get per-item modifiers applied; components have no item-specific modifiers, so the type total (already block-adjusted) is used as-is. */
function computeTypeAdjustedPremium(typeBase: TypeBase, group: Item[]): number {
  return typeBase.isMainItem
    ? sumMainItemAdjustedPremiums(typeBase.perItemBase, group)
    : typeBase.premium;
}

/** Sum the additive policy-wide modifier rates that apply to this customer and quote index. */
function computePolicyModifier(customer: Customer, quoteIndex: number): number {
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = quoteIndex > 0 ? FOLLOW_UP_DISCOUNT_RATE : 0;
  return FIRST_INSURANCE_RATE - loyaltyDiscount - followUpDiscount;
}

/** Group items by their type, preserving first-appearance order. */
function groupByType(items: Item[]): Map<string, Item[]> {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const existing = groups.get(item.type);
    if (existing) {
      existing.push(item);
    } else {
      groups.set(item.type, [item]);
    }
  }
  return groups;
}

export function quote(
  items: Item[],
  customer: Customer,
  quoteIndex: number,
): QuoteResult {
  let policyBase = 0;
  let insuranceSum = 0;
  let adjustedSum = 0;

  for (const [type, group] of groupByType(items)) {
    const typeBase = computeTypeBase(type, group.length);
    policyBase += typeBase.premium;
    insuranceSum += typeBase.insurance;
    adjustedSum += computeTypeAdjustedPremium(typeBase, group);
  }

  const policyModifier = computePolicyModifier(customer, quoteIndex);
  const premium = adjustedSum + policyBase * policyModifier + PROCESSING_FEE;

  return { premium: Math.ceil(premium), insuranceSum };
}
