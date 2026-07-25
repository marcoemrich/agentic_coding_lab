// claim.ts — computes payout and remaining cap for a damage incident against a policy.
import type { Damage, Policy } from "./types.js";

// Flat amount subtracted from every damage event before reimbursement.
const DEDUCTIBLE = 100;

// Items at or above this enchantment level are reimbursed at 50%.
const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_DAMAGE_RATE = 0.5;

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

// Apply per-damage clauses to a damage amount:
// 1. High enchantment (>= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD) → 50% reimbursement.
// 2. Otherwise → full reimbursement.
// Future material-based clauses (e.g. for dragon material) would extend here.
function applySpecialClauses(
  amount: number,
  enchantment: number | undefined,
): number {
  if (enchantment !== undefined && enchantment >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_DAMAGE_RATE;
  }
  return amount;
}

export function claim(
  policy: Policy,
  damages: Damage[],
): ClaimResult {
  let rawSum = 0;
  for (const damage of damages) {
    const item = policy.items.find((policyItem) => policyItem.type === damage.itemType);
    const afterClauses = applySpecialClauses(damage.amount, item?.enchantment);
    rawSum += afterClauses - DEDUCTIBLE;
  }
  // Total payout per policy cannot exceed the remaining cap.
  // Payouts round DOWN in MHPCO's favor (only the final payout is rounded).
  const cappedSum = Math.min(rawSum, policy.capRemaining);
  const payout = Math.floor(cappedSum);
  return {
    payout,
    remainingCap: policy.capRemaining - payout,
  };
}
