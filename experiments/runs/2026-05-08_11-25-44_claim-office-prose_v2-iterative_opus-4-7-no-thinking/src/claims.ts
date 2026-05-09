import type { Damage, Incident, Item, Policy } from './types.js';

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;

/**
 * Look up the policy item that matches the damage entry. We match by itemType.
 * If the damage record itself carries enchantment / material, prefer those
 * fields; otherwise fall back to the policy item's recorded fields.
 */
function findPolicyItem(itemType: string, items: Item[]): Item | undefined {
  return items.find((i) => i.type === itemType);
}

function effectiveEnchantment(damage: Damage, item: Item | undefined): number {
  if (typeof damage.enchantment === 'number') return damage.enchantment;
  return item?.enchantment ?? 0;
}

function effectiveMaterial(damage: Damage, item: Item | undefined): string | undefined {
  if (damage.material) return damage.material;
  return item?.material;
}

/**
 * Compute the reimbursement for a single damage entry, prior to deductible /
 * cap. Dragon material is fully reimbursed; high-enchantment (≥8) items get
 * 50%; everything else is fully reimbursed.
 */
function reimbursement(damage: Damage, items: Item[]): number {
  const item = findPolicyItem(damage.itemType, items);
  const material = effectiveMaterial(damage, item);
  if (material && material.toLowerCase() === 'dragon') {
    return damage.amount;
  }
  const ench = effectiveEnchantment(damage, item);
  if (ench >= HIGH_ENCHANTMENT_THRESHOLD) {
    return damage.amount * 0.5;
  }
  return damage.amount;
}

export interface ClaimOutcome {
  payout: number;
  remainingCap: number;
}

export function processClaim(policy: Policy, incident: Incident): ClaimOutcome {
  // Sum of reimbursements for the incident
  let gross = 0;
  for (const dmg of incident.damages) {
    gross += reimbursement(dmg, policy.items);
  }
  // Deductible per damage event (incident)
  const afterDeductible = Math.max(0, gross - DEDUCTIBLE);
  // Cap at remainingCap
  const payout = Math.min(afterDeductible, policy.remainingCap);
  // Round to whole G — payout is in MHPCO's favor (round down toward office)
  const payoutInt = Math.floor(payout + 1e-9);
  policy.remainingCap -= payoutInt;
  return { payout: payoutInt, remainingCap: policy.remainingCap };
}
