import { catalogEntry } from './catalog';
import { QuoteItem } from './basePremium';
import { roundInFavor } from './rounding';

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

export interface Policy {
  items: QuoteItem[];
  insuranceSum: number;
  remainingCap: number;
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
  remainingCap: number;
}

export function createPolicy(items: QuoteItem[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + catalogEntry(item.type).value, 0);
  return {
    items,
    insuranceSum,
    remainingCap: insuranceSum * CAP_MULTIPLIER,
  };
}

function reimbursement(item: QuoteItem, amount: number): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  return amount;
}

function matchDamagesToItems(policy: Policy, damages: Damage[]): QuoteItem[] {
  const available = new Map<string, number>();
  for (const item of policy.items) {
    available.set(item.type, (available.get(item.type) ?? 0) + 1);
  }

  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    const remaining = available.get(damage.itemType) ?? 0;
    if (remaining <= 0) {
      throw new Error(`Damage to uninsured item: ${damage.itemType}`);
    }
    available.set(damage.itemType, remaining - 1);
    return policy.items.find((item) => item.type === damage.itemType)!;
  });
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  const matched = matchDamagesToItems(policy, incident.damages);

  let rawPayout = 0;
  incident.damages.forEach((damage, index) => {
    const covered = reimbursement(matched[index], damage.amount);
    rawPayout += Math.max(0, covered - DEDUCTIBLE);
  });

  const desired = roundInFavor(rawPayout, 'payout');
  const payout = Math.min(desired, policy.remainingCap);
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
