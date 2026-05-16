import { Damage, Incident, Item, Policy } from "./types.js";

const DEDUCTIBLE = 100;

function isCovered(item: Item): boolean {
  if ((item.enchantment ?? 0) >= 8) return true;
  if ((item.material ?? "").toLowerCase() === "dragon") return true;
  return false;
}

function reimbursementFactor(item: Item): number {
  if ((item.material ?? "").toLowerCase() === "dragon") return 1.0;
  if ((item.enchantment ?? 0) >= 8) return 0.5;
  return 0;
}

function findItem(policy: Policy, itemType: string): Item | undefined {
  return policy.items.find((it) => it.type === itemType);
}

/**
 * Compute the reimbursable amount for a single damage entry,
 * before deductible.
 */
function reimbursableForDamage(policy: Policy, damage: Damage): number {
  const item = findItem(policy, damage.itemType);
  if (!item) return 0;
  if (!isCovered(item)) return 0;
  return damage.amount * reimbursementFactor(item);
}

export function processClaim(policy: Policy, incident: Incident): { payout: number; remainingCap: number } {
  // Sum reimbursable damages from this incident.
  let gross = 0;
  for (const d of incident.damages) {
    gross += reimbursableForDamage(policy, d);
  }

  // Deductible per damage event (incident).
  let net = gross - DEDUCTIBLE;
  if (net < 0) net = 0;

  // Cap to remaining policy cap.
  const payout = Math.min(net, policy.remainingCap);

  // Round down for payout to whole G (rules say amounts in G).
  const payoutInt = Math.floor(payout);

  policy.remainingCap -= payoutInt;
  return { payout: payoutInt, remainingCap: policy.remainingCap };
}
