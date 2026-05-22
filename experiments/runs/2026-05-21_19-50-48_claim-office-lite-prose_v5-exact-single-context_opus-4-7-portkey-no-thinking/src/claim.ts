import type { Item } from "./quote.js";

export interface Policy {
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
}

const DEDUCTIBLE = 100;

export const claim = (policy: Policy, incident: Incident): ClaimResult => {
  let reimbursable = 0;
  for (const damage of incident.damages) {
    const item = policy.items.find((i) => i.type === damage.itemType);
    let amount = damage.amount;
    if (item?.material === "dragon") {
      amount = damage.amount;
    } else if ((item?.enchantment ?? 0) >= 8) {
      amount = damage.amount / 2;
    } else {
      amount = damage.amount;
    }
    reimbursable += amount;
  }
  const payout = Math.max(0, reimbursable - DEDUCTIBLE);
  return { payout: Math.floor(payout) };
};
