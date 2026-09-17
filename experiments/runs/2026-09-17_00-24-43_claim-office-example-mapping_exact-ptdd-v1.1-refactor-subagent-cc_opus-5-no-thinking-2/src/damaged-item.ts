import type { Item } from "./policy.js";

/**
 * Matching an incident's damage entries to the insured items they hit.
 *
 * This is its own decision, separate from what a damage settles at: it
 * answers "which covered item was this?", not "what does the MHPCO pay?".
 * Each entry consumes a distinct insured item, so an incident naming a type
 * more often than the policy covers it is refused rather than settled -- an
 * entry with no insured item left to consume has nothing to claim against.
 *
 * Which of several alike items an entry consumes is a decision in its own
 * right, and the MHPCO settles it by order: an entry takes the first item of
 * its type the policy still has unconsumed. An incident names a type, never
 * a particular sword, so the MHPCO has no other ground to choose on. The
 * choice is unobservable only while alike items settle alike; two swords at
 * different enchantment levels would make it visible, and it is stated here
 * by name so that revising it means revising this rule rather than
 * discovering it in what the matching happens to do.
 */
export function damagedItems(
  items: readonly Item[],
  itemTypes: readonly string[],
): readonly Item[] {
  const unconsumed = [...items];
  return itemTypes.map((itemType) => {
    const hit = unconsumed.findIndex((item) => item.type === itemType);
    if (hit === -1) {
      throw new Error(
        `This policy does not cover an item of type "${itemType}"`,
      );
    }
    return unconsumed.splice(hit, 1)[0];
  });
}
