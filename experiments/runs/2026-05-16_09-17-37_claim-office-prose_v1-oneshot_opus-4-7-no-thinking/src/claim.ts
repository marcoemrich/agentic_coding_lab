import type { Damage, Incident, Item, Policy } from "./types.js";

export const DEDUCTIBLE = 100;

/**
 * Given a damage and its corresponding item in the policy, compute the
 * reimbursable amount before deductible / cap are applied.
 *
 * Rules:
 *   - Damage to items made of dragon material is fully reimbursed.
 *   - Damage to items with enchantment >= 8 is reimbursed at 50%.
 *   - Otherwise full reimbursement.
 *
 * If both conditions apply, dragon material wins (full reimbursement).
 */
function reimbursementFraction(item: Item | undefined, damage: Damage): number {
  const material = item?.material ?? damage.material;
  const enchantment = item?.enchantment ?? damage.enchantment ?? 0;
  if (material === "dragon") return 1;
  if (enchantment >= 8) return 0.5;
  return 1;
}

function findItem(policy: Policy, damage: Damage): Item | undefined {
  return policy.items.find((it) => it.type === damage.itemType);
}

export function processClaim(
  policy: Policy,
  incident: Incident,
): { payout: number; remainingCap: number } {
  // Sum reimbursable damage across the incident.
  let gross = 0;
  for (const dmg of incident.damages) {
    const item = findItem(policy, dmg);
    gross += dmg.amount * reimbursementFraction(item, dmg);
  }

  // Apply deductible per damage event.
  let net = gross - DEDUCTIBLE;
  if (net < 0) net = 0;

  // Apply per-policy cap.
  const payout = Math.min(net, policy.capRemaining);
  policy.capRemaining -= payout;

  // Payouts are whole G. Round in MHPCO's favor (down for payouts).
  const roundedPayout = Math.floor(payout);
  // If we rounded the payout down, the remaining cap should account for
  // the actual deduction. We keep capRemaining as already reduced by the
  // pre-rounding payout to be consistent with "cap remaining after this
  // claim". To keep things integer and predictable, also floor the cap.
  const remainingCap = Math.floor(policy.capRemaining);
  policy.capRemaining = remainingCap;

  return { payout: roundedPayout, remainingCap };
}
