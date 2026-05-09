import { Incident, Policy, ClaimResult } from "./types.js";

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DRAGON_MATERIAL = "dragon";

function reimbursementRate(enchantment: number, material: string): number {
  if (material.toLowerCase() === DRAGON_MATERIAL) return 1.0;
  if (enchantment >= HIGH_ENCHANTMENT_THRESHOLD) return HIGH_ENCHANTMENT_REIMBURSEMENT;
  return 1.0;
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  let totalReimbursement = 0;

  for (const damage of incident.damages) {
    const enchantment = damage.enchantment ?? 0;
    const material = damage.material ?? "";
    const rate = reimbursementRate(enchantment, material);
    totalReimbursement += damage.amount * rate;
  }

  const gross = Math.max(0, totalReimbursement - DEDUCTIBLE);
  // Round floor in MHPCO's favor (they pay out less)
  const payout = Math.floor(Math.min(gross, policy.remainingCap));

  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
