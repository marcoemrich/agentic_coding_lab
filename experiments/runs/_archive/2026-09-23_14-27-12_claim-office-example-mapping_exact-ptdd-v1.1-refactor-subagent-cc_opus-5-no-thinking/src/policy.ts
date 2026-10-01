import { type Item, insuranceValueOf } from "./price-list.js";

export type { Item };

/** The office never pays a policy more than twice what it carries for its items. */
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

/**
 * The cap a policy is measured against is built on what the MHPCO carries for the
 * items, not on the premium it charges for them: a block discount cuts the premium
 * and leaves the insurance sum untouched.
 */
export function insuranceSumOf(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}

/** The total the office will pay out over the life of a policy covering these items. */
export function capFor(items: Item[]): number {
  return insuranceSumOf(items) * CAP_MULTIPLE_OF_INSURANCE_SUM;
}
