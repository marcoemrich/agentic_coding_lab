import type { Item } from "./claimOffice";
import { insuranceValue } from "./itemCatalogue";

const CAP_MULTIPLIER = 2;

export function payoutCap(items: Item[]): number {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValue(item), 0);
  return insuranceSum * CAP_MULTIPLIER;
}
