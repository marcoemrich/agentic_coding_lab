import type { Item, ItemType } from "./types.js";

export const PROCESSING_FEE = 5;

const BASE_PREMIUM: Record<ItemType, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES: ReadonlySet<ItemType> = new Set(["rune", "moonstone"]);
const BLOCK_OF_3_PREMIUM = 60;

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;

function policyBasePremium(items: Item[]): number {
  const counts = new Map<ItemType, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }

  let policyBase = 0;
  for (const [type, count] of counts) {
    if (COMPONENT_TYPES.has(type) && count === 3) {
      policyBase += BLOCK_OF_3_PREMIUM;
    } else {
      policyBase += count * BASE_PREMIUM[type];
    }
  }
  return policyBase;
}

function itemSurcharge(item: Item): number {
  const base = BASE_PREMIUM[item.type];
  let surcharge = 0;
  if (item.cursed) surcharge += CURSE_SURCHARGE_RATE * base;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += HIGH_ENCHANTMENT_SURCHARGE_RATE * base;
  }
  return surcharge;
}

// Policy-wide modifiers applied to policy_base_premium
function policyWideAdjustment(
  policyBase: number,
  yearsWithMHPCO: number,
  isFirstContract: boolean,
): number {
  let adjustment = FIRST_INSURANCE_RATE * policyBase;
  if (yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    adjustment -= LOYALTY_DISCOUNT_RATE * policyBase;
  }
  if (!isFirstContract) {
    adjustment -= FOLLOW_UP_DISCOUNT_RATE * policyBase;
  }
  return adjustment;
}

export function computePremium(args: {
  items: Item[];
  yearsWithMHPCO: number;
  isFirstContract: boolean;
}): number {
  const policyBase = policyBasePremium(args.items);

  let itemSurchargesTotal = 0;
  for (const item of args.items) {
    itemSurchargesTotal += itemSurcharge(item);
  }

  const policyWide = policyWideAdjustment(
    policyBase,
    args.yearsWithMHPCO,
    args.isFirstContract,
  );

  return Math.ceil(policyBase + itemSurchargesTotal + policyWide + PROCESSING_FEE);
}
