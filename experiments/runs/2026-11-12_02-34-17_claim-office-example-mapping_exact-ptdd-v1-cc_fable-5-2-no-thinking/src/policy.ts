import type { Item } from "./item.js";
import { insuranceSum } from "./price-list.js";

export interface Policy {
  insuredItems: Item[];
  remainingCap: number;
}

const CAP_AS_MULTIPLE_OF_INSURANCE_SUM = 2;

function payoutCap(insuredItems: Item[]): number {
  return CAP_AS_MULTIPLE_OF_INSURANCE_SUM * insuranceSum(insuredItems.map((item) => item.type));
}

export function issuePolicy(insuredItems: Item[]): Policy {
  return { insuredItems, remainingCap: payoutCap(insuredItems) };
}
