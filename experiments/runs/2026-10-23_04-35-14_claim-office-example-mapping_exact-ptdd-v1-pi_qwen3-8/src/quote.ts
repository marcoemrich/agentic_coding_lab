import { RATE_UNIT, roundPremiumUp } from "./amounts.js";
import { isComponent, itemBasePremium, priceListEntry } from "./price-list.js";
import type { ItemInput } from "./scenario.js";

const PROCESSING_FEE_G = 5;
// All spec rates are multiples of 1/20, so amounts are kept as whole
// twentieths of a G (exact fractions) and rounded only at the end.
const FIRST_INSURANCE_RATE = 2; // 2/20 = 10 %
const CURSED_RATE = 10; // 10/20 = 50 % of the affected item's base premium
const HIGH_ENCHANTMENT_RATE = 6; // 6/20 = 30 % of the affected item's base premium
const HIGH_ENCHANTMENT_LEVEL = 5;
// Long-standing customers (>= 2 years) receive a 20 % loyalty discount.
const LOYALTY_RATE = -4; // -4/20 = -20 % of the policy base premium
const LOYALTY_YEARS = 2;
// Every contract after the customer's first receives a 15 % discount.
const FOLLOW_UP_RATE = -3; // -3/20 = -15 % of the policy base premium
// A building block of exactly 3 alike components is priced at 60 G.
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM_G = 60;

// The office only insures items from its price list.
function assertKnownItems(items: ItemInput[]): void {
  for (const item of items) {
    if (!priceListEntry(item.type)) {
      throw new Error(`the MHPCO does not insure items of type "${item.type}"`);
    }
  }
}

function groupBasePremium(type: string, count: number): number {
  if (isComponent(type) && count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM_G;
  }
  return count * itemBasePremium(type);
}

function policyBasePremium(items: ItemInput[]): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  let total = 0;
  for (const [type, count] of counts) {
    total += groupBasePremium(type, count);
  }
  return total;
}

// Item-specific risk surcharges apply to the affected item's base premium.
function itemSurchargeTwentieths(item: ItemInput): number {
  const base = itemBasePremium(item.type);
  let rate = 0;
  if (item.cursed === true) {
    rate += CURSED_RATE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    rate += HIGH_ENCHANTMENT_RATE;
  }
  return base * rate;
}

export function quotePremium(
  items: ItemInput[],
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): number {
  assertKnownItems(items);
  const policyBase = policyBasePremium(items);
  const surcharges = items.reduce((sum, item) => sum + itemSurchargeTwentieths(item), 0);
  // Policy-wide modifiers apply to the policy base premium (the sum of all
  // item base premiums); the first-insurance surcharge applies to every quote.
  let policyRate = FIRST_INSURANCE_RATE;
  if (yearsWithMHPCO >= LOYALTY_YEARS) {
    policyRate += LOYALTY_RATE;
  }
  if (isFollowUp) {
    policyRate += FOLLOW_UP_RATE;
  }
  const twentieths =
    policyBase * RATE_UNIT +
    surcharges +
    policyBase * policyRate +
    PROCESSING_FEE_G * RATE_UNIT;
  return roundPremiumUp(twentieths);
}
