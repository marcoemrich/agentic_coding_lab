import type { Incident, Item, Policy } from "./types.js";

export const DEDUCTIBLE = 100;

/**
 * Process an incident against a policy. Mutates the policy's
 * remainingCap to reflect the payout.
 * Returns the payout and the remaining cap after the claim.
 */
export function processClaim(
  policy: Policy,
  incident: Incident,
): { payout: number; remainingCap: number } {
  // Sum reimbursable damage across damages in this incident
  let reimbursable = 0;
  for (const damage of incident.damages) {
    const item = findItemForDamage(policy.items, damage.itemType);
    reimbursable += reimbursableAmount(damage.amount, item);
  }

  // Apply deductible per damage event (i.e., per incident)
  let payout = Math.max(0, reimbursable - DEDUCTIBLE);

  // Round in MHPCO's favor: payout rounded DOWN (favor = pay less)
  payout = Math.floor(payout);

  // Cap by remainingCap
  if (payout > policy.remainingCap) {
    payout = policy.remainingCap;
  }

  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function findItemForDamage(items: Item[], itemType: string): Item | undefined {
  return items.find((it) => it.type === itemType);
}

function reimbursableAmount(amount: number, item: Item | undefined): number {
  if (!item) return amount;
  const isDragon = (item.material ?? "").toLowerCase() === "dragon";
  const highEnchant = (item.enchantment ?? 0) >= 8;

  if (isDragon) {
    // Dragon material: fully reimbursed (overrides high-enchantment 50% rule)
    return amount;
  }
  if (highEnchant) {
    return amount * 0.5;
  }
  return amount;
}
