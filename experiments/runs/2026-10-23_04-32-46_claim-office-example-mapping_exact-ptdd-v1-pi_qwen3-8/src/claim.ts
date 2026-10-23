import type { ClaimResult, Damage, Incident, QuoteItem } from "./types";

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

export interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

function insuranceSum(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
}

export function createPolicy(items: QuoteItem[]): Policy {
  return { items, remainingCap: CAP_MULTIPLIER * insuranceSum(items) };
}

const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function reimbursementFor(item: QuoteItem, amount: number): number {
  if ((item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return amount;
}

function countByType(types: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
}

function rejectOverDamagedClaims(policy: Policy, damages: Damage[]): void {
  const insured = countByType(policy.items.map((item) => item.type));
  const damaged = countByType(damages.map((damage) => damage.itemType));
  for (const [type, damagedCount] of damaged) {
    if (damagedCount > (insured.get(type) ?? 0)) {
      throw new Error(
        `claim damages ${damagedCount} items of type '${type}' but the policy covers fewer`,
      );
    }
  }
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  rejectOverDamagedClaims(policy, incident.damages);
  let desiredPayout = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount ${damage.amount} must not be negative`);
    }
    const item = policy.items.find(
      (candidate) => candidate.type === damage.itemType,
    );
    if (item === undefined) {
      throw new Error(`damaged item '${damage.itemType}' is not part of the policy`);
    }
    desiredPayout += Math.max(0, reimbursementFor(item, damage.amount) - DEDUCTIBLE);
  }
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
