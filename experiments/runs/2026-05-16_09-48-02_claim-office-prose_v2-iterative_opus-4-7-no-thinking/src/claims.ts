import type { Item, Incident, Policy } from "./types.js";

const DEDUCTIBLE = 100;

function reimbursementFraction(item: Item | undefined): number {
  if (!item) return 1;
  if (item.material === "dragon") return 1;
  if ((item.enchantment ?? 0) >= 8) return 0.5;
  return 1;
}

function findItem(policy: Policy, itemType: string): Item | undefined {
  return policy.items.find((i) => i.type === itemType);
}

export interface ClaimOutcome {
  payout: number;
  remainingCap: number;
}

export function processClaim(policy: Policy, incident: Incident): ClaimOutcome {
  let reimbursable = 0;
  for (const damage of incident.damages) {
    const item = findItem(policy, damage.itemType);
    const frac = reimbursementFraction(item);
    reimbursable += damage.amount * frac;
  }

  let payout = reimbursable - DEDUCTIBLE;
  if (payout < 0) payout = 0;

  const remainingCapBefore = policy.cap - policy.paidOut;
  if (payout > remainingCapBefore) payout = Math.max(0, remainingCapBefore);

  // Round down payout (in favor of MHPCO)
  payout = Math.floor(payout);

  policy.paidOut += payout;
  const remainingCap = policy.cap - policy.paidOut;

  return { payout, remainingCap };
}
