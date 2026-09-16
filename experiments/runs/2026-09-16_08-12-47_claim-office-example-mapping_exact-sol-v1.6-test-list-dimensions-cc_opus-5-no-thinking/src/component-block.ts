import { basePremiumOf } from "./price-list.js";

/** A building block of 3 alike components is offered at a special base premium. */
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM_IN_G = 60;

export function componentGroupBasePremiumInG(alikeComponentCount: number, itemType: string): number {
  if (alikeComponentCount === BLOCK_SIZE) return BLOCK_BASE_PREMIUM_IN_G;
  return alikeComponentCount * basePremiumOf(itemType);
}
