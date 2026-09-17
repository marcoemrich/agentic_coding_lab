import type { Item } from "./policy.js";
import { enchantmentLevelOf } from "./policy.js";

/** A cursed item adds a risk surcharge on its own base premium. */
const CURSE_SURCHARGE_RATE = 0.5;

/** Highly enchanted items add a risk surcharge on their own base premium. */
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function carriesHighEnchantmentSurcharge(item: Item): boolean {
  return enchantmentLevelOf(item) >= HIGH_ENCHANTMENT_LEVEL;
}

function riskSurchargeRateOf(item: Item): number {
  const curseRate = isCursed(item) ? CURSE_SURCHARGE_RATE : 0;
  const enchantmentRate = carriesHighEnchantmentSurcharge(item)
    ? HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curseRate + enchantmentRate;
}

/**
 * Item-specific risk surcharges apply to the base premium of the affected
 * item, not to the policy base premium.
 */
export function riskSurchargeOf(item: Item, itemBasePremium: number): number {
  return itemBasePremium * riskSurchargeRateOf(item);
}
