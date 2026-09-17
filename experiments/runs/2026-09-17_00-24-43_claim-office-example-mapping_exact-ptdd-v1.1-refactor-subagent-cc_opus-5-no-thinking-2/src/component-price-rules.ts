import type { Item } from "./policy.js";

/**
 * The price rules governing components such as runes and moonstones: what
 * each is insured for, and what insuring them costs -- including the
 * building block, the one concession that makes components cheaper than
 * their number alone would suggest.
 */

/** Components such as runes and moonstones share one base premium. */
const COMPONENT_BASE_PREMIUM = 25;

const COMPONENT_TYPES: readonly string[] = ["rune", "moonstone"];

/**
 * Each component is insured for its own value. The building block is a
 * premium concession only: it never reduces what a component is insured for.
 */
export const COMPONENT_INSURANCE_VALUE = 250;

/** A building block of alike components is offered at a special premium. */
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

/** Components count as "alike" -- and so may form a block -- per item type. */
function alikeGroupSizes(components: readonly Item[]): readonly number[] {
  const sizes = new Map<string, number>();
  for (const component of components) {
    sizes.set(component.type, (sizes.get(component.type) ?? 0) + 1);
  }
  return [...sizes.values()];
}

/**
 * A block requires *exactly* the block size: 4 or 7 alike components are
 * priced per component, not as blocks plus a remainder.
 */
function alikeGroupBasePremium(groupSize: number): number {
  if (groupSize === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_BASE_PREMIUM;
  }
  return groupSize * COMPONENT_BASE_PREMIUM;
}

export function componentsBasePremium(components: readonly Item[]): number {
  return alikeGroupSizes(components).reduce(
    (sum, groupSize) => sum + alikeGroupBasePremium(groupSize),
    0,
  );
}
