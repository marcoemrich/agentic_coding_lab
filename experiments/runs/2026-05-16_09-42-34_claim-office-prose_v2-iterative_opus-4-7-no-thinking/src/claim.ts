import type { Damage, Incident, Item, Policy } from "./types.js";

const DEDUCTIBLE = 100;

function findItem(items: Item[], itemType: string): Item | undefined {
  return items.find((i) => i.type === itemType);
}

function reimbursementRate(item: Item | undefined): number {
  if (!item) return 1;
  if (item.material === "dragon") return 1;
  if ((item.enchantment ?? 0) >= 8) return 0.5;
  return 1;
}

/**
 * Compute the reimbursable amount for an incident's damages, before deductible
 * and policy cap.
 */
function rawReimbursement(items: Item[], damages: Damage[]): number {
  let total = 0;
  for (const d of damages) {
    const item = findItem(items, d.itemType);
    total += d.amount * reimbursementRate(item);
  }
  return total;
}

/**
 * Process a claim against the given policy. Mutates `policy.remainingCap` to
 * reflect the payout, and returns the payout for this claim along with the
 * resulting remainingCap.
 */
export function processClaim(
  policy: Policy,
  incident: Incident,
): { payout: number; remainingCap: number } {
  const raw = rawReimbursement(policy.items, incident.damages);
  // Deductible per damage event (incident).
  const afterDeductible = Math.max(0, raw - DEDUCTIBLE);
  // Round in MHPCO's favor — for payouts, "MHPCO's favor" is rounding DOWN.
  const beforeCap = Math.floor(afterDeductible);
  const payout = Math.min(beforeCap, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
