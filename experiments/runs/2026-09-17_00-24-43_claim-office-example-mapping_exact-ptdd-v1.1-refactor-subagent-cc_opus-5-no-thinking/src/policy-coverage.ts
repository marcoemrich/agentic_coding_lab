/**
 * Which insured item a damage entry is claiming against.
 *
 * This module owns one ruling of the office's: how a damage report is matched
 * to the things a policy actually covers. Two decisions live here, and they are
 * the office's to revise independently of how a claim is settled — what makes
 * an insured item answer to a damage entry, and whether one insured item can be
 * claimed for more than once in a single report.
 *
 * It is kept apart from the claims rulings because those price a damage once
 * the damaged item is known; this one only decides *which* item that is. It is
 * kept apart from the price list because that says what MHPCO insures at all,
 * while this says how many of it *this* policy covers.
 */

import { type Damage } from "./claims.js";
import { type Item } from "./item.js";

/**
 * Whether an insured item is one a damage entry can be claiming against. MHPCO
 * identifies the damaged thing by its type alone: the report names what kind of
 * item was damaged, and any insured item of that kind answers to it.
 */
function answersTo(insured: Item, damage: Damage): boolean {
  return insured.type === damage.itemType;
}

/**
 * Matches the damage entries of one report to the items a policy covers.
 *
 * A damaged item is claimed for once: two entries of the same type need two
 * insured items of that type, so the matcher sets each item aside as it is
 * claimed. A report naming more of a type than the policy covers — or a type it
 * does not cover at all — is one the office refuses outright.
 */
export function coverageOf(insuredItems: readonly Item[]): (damage: Damage) => Item {
  const unclaimed = [...insuredItems];
  return (damage) => {
    const index = unclaimed.findIndex((insured) => answersTo(insured, damage));
    if (index === -1) {
      throw new Error(`the policy does not cover a further item of type "${damage.itemType}"`);
    }
    const [claimed] = unclaimed.splice(index, 1);
    return claimed;
  };
}
