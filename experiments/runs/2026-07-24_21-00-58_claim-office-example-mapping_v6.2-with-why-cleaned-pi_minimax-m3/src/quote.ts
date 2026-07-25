import type { Customer, Item, ItemType } from "./types.js";

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.10;
const LOYALTY_DISCOUNT_RATE = 0.20;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CURSED_SURCHARGE_RATE = 0.50;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const ITEM_BASE_PREMIUM: Partial<Record<ItemType, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set<ItemType>(["rune", "moonstone"]);

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function itemBase(item: Item): number {
  return ITEM_BASE_PREMIUM[item.type] ?? 0;
}

// Per-item premium including item-specific modifiers (cursed, high enchantment).
// Each modifier contributes a named surcharge; the final premium is the sum.
function itemAdjustedPremium(item: Item): number {
  const base = itemBase(item);
  const cursedSurcharge = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return base + cursedSurcharge + enchantmentSurcharge;
}

// A complete block of COMPONENT_BLOCK_SIZE identical components prices at the
// flat block rate; partial blocks price per-unit at COMPONENT_BASE_PREMIUM.
function priceComponentType(count: number): number {
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_BASE_PREMIUM;
}

// Sum of per-item premiums (delegated to priceItem) plus block-priced component
// totals. Shared shape behind policyBasePremium and adjustedPolicyTotal; the
// only difference between the two callers is whether item modifiers apply.
function aggregatePolicyPremium(
  items: Item[],
  priceItem: (item: Item) => number,
): number {
  const counts: Partial<Record<ItemType, number>> = {};
  let total = 0;
  for (const item of items) {
    if (isComponent(item)) {
      counts[item.type] = (counts[item.type] ?? 0) + 1;
    } else {
      total += priceItem(item);
    }
  }
  for (const count of Object.values(counts)) {
    total += priceComponentType(count);
  }
  return total;
}

// Policy base premium: sum of item bases with block discount applied for
// components, but WITHOUT item-specific modifiers (curse, enchantment). This
// is the basis for policy-wide modifiers (first insurance, loyalty, follow-up).
function policyBasePremium(items: Item[]): number {
  return aggregatePolicyPremium(items, itemBase);
}

// Sum of item premiums AFTER item-specific modifiers (curse, enchantment) and
// AFTER component block discount. This is the "modified policy total" that
// sits at the heart of the final premium calculation.
function adjustedPolicyTotal(items: Item[]): number {
  return aggregatePolicyPremium(items, itemAdjustedPremium);
}

export function calculatePremium(items: Item[], customer: Customer): number {
  if (items.length === 0) return PROCESSING_FEE;
  const adjustedTotal = adjustedPolicyTotal(items);
  const base = policyBasePremium(items);
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_RATE * items.length;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? base * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount =
    customer.contractCount >= 1
      ? base * FOLLOW_UP_DISCOUNT_RATE
      : 0;
  const total =
    adjustedTotal +
    firstInsuranceSurcharge -
    loyaltyDiscount -
    followUpDiscount +
    PROCESSING_FEE;
  // Round UP to whole G in MHPCO's favor.
  return Math.ceil(total);
}
