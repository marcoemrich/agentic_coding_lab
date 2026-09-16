import { policyWideAdjustment, type Customer } from "./customer-modifiers.js";
import { payoutCap } from "./policy.js";
import { basePremiumForAlike, type Item } from "./price-list.js";
import { riskSurchargeFor } from "./risk.js";
import { roundedPremium } from "./rounding.js";

const PROCESSING_FEE = 5;

export interface Quote {
  premium: number;
  cap: number;
}

export type { Customer, Item };

function countsByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countsByType(items)) {
    total += basePremiumForAlike(type, count);
  }
  return total;
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => total + riskSurchargeFor(item), 0);
}

export function quote(
  customer: Customer,
  items: Item[],
  previousContracts: number,
): Quote {
  const base = policyBasePremium(items);
  const premium =
    base + itemSurcharges(items) + policyWideAdjustment(customer, base, previousContracts) + PROCESSING_FEE;
  return {
    premium: roundedPremium(premium),
    cap: payoutCap(items),
  };
}
