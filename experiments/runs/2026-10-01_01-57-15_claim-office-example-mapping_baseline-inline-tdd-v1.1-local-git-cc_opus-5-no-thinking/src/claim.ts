import { payoutCap, type Item } from './quote.js';

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
  remainingCap: number;
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

export function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: payoutCap(items) };
}

/**
 * Matches each damage entry to a distinct covered item, so a policy covering
 * one sword cannot absorb two sword damages.
 */
function matchDamagesToItems(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) throw new Error(`damage to an item not covered by the policy: ${damage.itemType}`);
    return available.splice(index, 1)[0];
  });
}

/**
 * Reimbursement for one damage before the deductible. The high-enchantment
 * clause halves the amount and wins over the dragon-material clause, which
 * reimburses in full — as does the standard case, so it needs no branch.
 */
function reimbursement(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  return amount;
}

export function claim(policy: Policy, incident: Incident): ClaimResult {
  for (const damage of incident.damages) {
    if (damage.amount < 0) throw new Error(`negative damage amount: ${damage.amount}`);
  }
  const items = matchDamagesToItems(policy, incident.damages);
  const desired = incident.damages.reduce((sum, damage, index) => {
    const net = reimbursement(items[index], damage.amount) - DEDUCTIBLE;
    return sum + Math.max(net, 0);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
