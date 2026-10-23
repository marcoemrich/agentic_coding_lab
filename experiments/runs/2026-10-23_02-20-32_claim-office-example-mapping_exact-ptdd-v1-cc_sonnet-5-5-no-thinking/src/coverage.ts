import type { Item } from "./item.js";
import { COMPONENT_INSURANCE_VALUE, MAIN_ITEM_PRICES } from "./price-list.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce(
    (sum, item) => sum + (MAIN_ITEM_PRICES[item.type]?.insuranceValue ?? COMPONENT_INSURANCE_VALUE),
    0,
  );
}

export function matchInsuredItems(items: Item[], damages: Damage[]): Item[] {
  const unmatched = [...items];
  return damages.map((damage) => {
    const index = unmatched.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`No insured ${damage.itemType} left to claim for`);
    }
    return unmatched.splice(index, 1)[0];
  });
}
