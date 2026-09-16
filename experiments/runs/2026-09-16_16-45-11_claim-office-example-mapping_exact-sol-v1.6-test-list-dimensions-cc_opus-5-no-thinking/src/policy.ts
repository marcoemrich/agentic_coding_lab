import { insuranceValueOf, type Item } from "./price-list.js";

export interface Damage {
  itemType: string;
  amount: number;
}

const PAYOUT_CAP_MULTIPLIER = 2;

export function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + insuranceValueOf(item), 0);
}

export function payoutCap(items: Item[]): number {
  return insuranceSum(items) * PAYOUT_CAP_MULTIPLIER;
}

/**
 * The insured item each damage entry refers to. Each entry is a separate damage
 * to a separate insured item, so a claim naming more items of a type than the
 * policy covers is rejected in full.
 */
export function coveredItemsFor(damages: Damage[], items: Item[]): Item[] {
  const available = [...items];
  return damages.map((damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(
        `The policy does not cover a further item of type "${damage.itemType}"`,
      );
    }
    return available.splice(index, 1)[0];
  });
}
