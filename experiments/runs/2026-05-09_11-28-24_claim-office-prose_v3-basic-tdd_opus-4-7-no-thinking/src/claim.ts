import type { ClaimResult, Damage, Incident, Item, Policy } from './types.js';
import { DEDUCTIBLE_PER_INCIDENT } from './types.js';

function findItemByType(items: Item[], type: string): Item | undefined {
  return items.find((i) => i.type === type);
}

function reimbursementForDamage(damage: Damage, item: Item | undefined): number {
  if (!item) return 0;
  if (item.material === 'dragon') return damage.amount;
  if (item.enchantment >= 8) return damage.amount * 0.5;
  return 0;
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  let total = 0;
  for (const damage of incident.damages) {
    const item = findItemByType(policy.items, damage.itemType);
    total += reimbursementForDamage(damage, item);
  }

  // Subtract deductible per incident
  let payout = total - DEDUCTIBLE_PER_INCIDENT;
  if (payout < 0) payout = 0;

  // Round up in MHPCO favor (less to customer = floor)
  // Actually, payouts to customer should be rounded down in MHPCO's favor
  payout = Math.floor(payout + 1e-9);

  // Cap at remaining
  if (payout > policy.remainingCap) {
    payout = policy.remainingCap;
  }

  policy.remainingCap -= payout;

  return {
    payout,
    remainingCap: policy.remainingCap,
  };
}
