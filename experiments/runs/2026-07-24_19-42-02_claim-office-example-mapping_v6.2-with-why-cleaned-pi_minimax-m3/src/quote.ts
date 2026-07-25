// quote.ts — computes premium, insurance sum, and cap for a list of items.
import type { Item } from "./types.js";

// Flat fee charged on every quote, regardless of items insured.
const PROCESSING_FEE = 5;

// Cap is always twice the insurance sum.
const CAP_MULTIPLIER = 2;

// First-insurance surcharge is always 10% of the policy base premium.
const FIRST_INSURANCE_RATE = 0.1;

// Building block: how many alike components trigger the flat block rate.
const BLOCK_SIZE = 3;

// Flat base premium for a building block of exactly BLOCK_SIZE alike components.
const BLOCK_PREMIUM = 60;

// Cursed items add 50% of the item's individual base premium as a risk surcharge.
const CURSE_SURCHARGE_RATE = 0.5;

// Items with enchantment ≥ this threshold add a 30% risk surcharge.
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

// Long-standing customers (≥ this many years with MHPCO) receive a 20% loyalty discount
// on the policy base premium.
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

// Follow-up contracts (a customer's 2nd+ contract) receive a 15% discount on the
// policy base premium.
const FOLLOWUP_DISCOUNT_RATE = 0.15;

export interface QuoteResult {
  items: Item[];
  premium: number;
  insuranceSum: number;
  cap: number;
  // Remaining cap starts equal to cap and is decremented as claims pay out.
  capRemaining: number;
}

interface ItemSpec {
  basePremium: number;
  insuranceValue: number;
}

// Totals produced by combining all items in a quote (before policy-wide
// modifiers like first-insurance, loyalty, and follow-up discount apply).
interface PricingAggregate {
  basePremium: number;
  insuranceValue: number;
  // Sum of per-item modifiers (curse, high-enchantment) computed against the
  // item's individual base premium, never against the block-adjusted base.
  itemModifiers: number;
}

// Rune and moonstone share the same base pricing (25 G premium / 250 G value).
// If a future item-specific modifier differentiates them, give each its own spec.
const RUNE_SPEC: ItemSpec = { basePremium: 25, insuranceValue: 250 };

// Per-type pricing data. Add a row here when introducing a new item type.
const ITEM_SPECS: Record<string, ItemSpec> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: RUNE_SPEC,
  moonstone: RUNE_SPEC,
};

function isComponent(type: string): boolean {
  return type === "rune" || type === "moonstone";
}

// A group of items qualifies for the building-block rate only when it holds
// exactly BLOCK_SIZE alike components.
function qualifiesForBlock(type: string, count: number): boolean {
  return isComponent(type) && count === BLOCK_SIZE;
}

function getItemSpec(type: string): ItemSpec {
  const spec = ITEM_SPECS[type];
  if (spec === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return spec;
}

// Per-item modifiers scale with the item's own base premium, never with the
// block-adjusted base.
function itemModifierSurcharge(item: Item): number {
  const spec = getItemSpec(item.type);
  let surcharge = 0;
  if (item.cursed) {
    surcharge += spec.basePremium * CURSE_SURCHARGE_RATE;
  }
  if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += spec.basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

// Sums base premium and insurance value across all items, applying the
// building-block rate to eligible groups of alike components.
function aggregateItemPricing(items: Item[]): PricingAggregate {
  let basePremium = 0;
  let insuranceValue = 0;
  let itemModifiers = 0;
  const groupCounts = new Map<string, number>();
  // One pass per item: tally the group it belongs to and sum its modifiers.
  for (const item of items) {
    groupCounts.set(item.type, (groupCounts.get(item.type) ?? 0) + 1);
    itemModifiers += itemModifierSurcharge(item);
  }
  for (const [type, count] of groupCounts) {
    const spec = getItemSpec(type);
    insuranceValue += spec.insuranceValue * count;
    basePremium += qualifiesForBlock(type, count)
      ? BLOCK_PREMIUM
      : spec.basePremium * count;
  }
  return { basePremium, insuranceValue, itemModifiers };
}

// Policy-wide modifiers (first-insurance surcharge, loyalty discount, …) apply
// to the policy base premium — never to per-item modifiers. Keeping them here
// in one place makes new policy-wide rules easy to add.
function adjustedPolicyBasePremium(
  basePremium: number,
  yearsWithMHPCO: number,
  isFollowupContract: boolean,
): number {
  const firstInsurance = basePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? basePremium * LOYALTY_DISCOUNT_RATE
      : 0;
  const followupDiscount = isFollowupContract
    ? basePremium * FOLLOWUP_DISCOUNT_RATE
    : 0;
  return basePremium + firstInsurance - loyaltyDiscount - followupDiscount;
}

export function quote(
  items: Item[],
  yearsWithMHPCO: number,
  isFollowupContract: boolean,
): QuoteResult {
  // Empty list flows naturally through aggregateItemPricing (all loops skip),
  // yielding basePremium=0 → premium=PROCESSING_FEE.
  const { basePremium, insuranceValue: insuranceSum, itemModifiers } =
    aggregateItemPricing(items);
  const policyBase = adjustedPolicyBasePremium(basePremium, yearsWithMHPCO, isFollowupContract);
  const premium = Math.ceil(policyBase + itemModifiers + PROCESSING_FEE);
  // Remaining cap starts equal to the full cap and shrinks as claims pay out.
  const cap = insuranceSum * CAP_MULTIPLIER;
  return {
    items,
    premium,
    insuranceSum,
    cap,
    capRemaining: cap,
  };
}
