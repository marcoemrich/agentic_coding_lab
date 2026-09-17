/**
 * MHPCO's building-block rule for components.
 *
 * This module owns one underwriting policy: when a number of components
 * qualifies as a building block, and what the office charges for it instead of
 * the per-component rate. Two rulings live here, and they are the office's to
 * revise: what counts as "alike" (MHPCO reads it as "of the same type", so two
 * runes and a moonstone are not three alike components, and 3 runes with 3
 * moonstones earn two separate blocks), and how large a block is and what it
 * costs.
 *
 * It is kept apart from the price list because the two change for different
 * reasons: the price of a rune is a catalogue revision, while the size, rate or
 * the very meaning of a building block is a bundling decision the office makes
 * on its own.
 */

import { type Item } from "./item.js";

/** MHPCO offers a building block of exactly this many alike components. */
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM_G = 60;

/**
 * MHPCO reads "alike" as "of the same type". Grouping components by type is
 * therefore the office's ruling on what counts as alike, and the sizes of these
 * groups are what the block rule is applied to.
 */
function alikeComponentGroupSizes(components: readonly Item[]): number[] {
  const sizeByType = new Map<string, number>();
  for (const component of components) {
    sizeByType.set(component.type, (sizeByType.get(component.type) ?? 0) + 1);
  }
  return [...sizeByType.values()];
}

/**
 * The base premium for a group of alike components: the block rate when the
 * group is exactly a building block, the per-component rate otherwise.
 */
function alikeComponentsBasePremium(count: number, perComponentRateG: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM_G : count * perComponentRateG;
}

/**
 * The base premium MHPCO charges for a policy's components, at the given
 * per-component rate. Components are priced per group of alike components, not
 * per item: the office gathers the alike ones together first so that a building
 * block can be recognised, then prices each group on its own.
 */
export function componentsBasePremium(
  components: readonly Item[],
  perComponentRateG: number,
): number {
  return alikeComponentGroupSizes(components).reduce(
    (total, groupSize) => total + alikeComponentsBasePremium(groupSize, perComponentRateG),
    0,
  );
}
