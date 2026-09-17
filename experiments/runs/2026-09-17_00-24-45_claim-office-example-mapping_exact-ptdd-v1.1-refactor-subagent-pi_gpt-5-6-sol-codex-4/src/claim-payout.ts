import type { InsuredDamage } from "./claim-damage-coverage.js";

interface PayoutItem {
  type: string;
  enchantment?: number;
}

interface PayoutDamage {
  itemType: string;
  amount: number;
}

const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

function reimbursementRateFor(item: PayoutItem): number {
  return (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL
    ? HALF_REIMBURSEMENT_RATE
    : 1;
}

function calculateDamagePayout(damage: PayoutDamage, item: PayoutItem): number {
  const reimbursement = damage.amount * reimbursementRateFor(item);
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

export function calculateClaimPayout(
  insuredDamages: InsuredDamage<PayoutItem, PayoutDamage>[],
): number {
  const incidentPayout = insuredDamages.reduce(
    (total, { damage, item }) => total + calculateDamagePayout(damage, item),
    0,
  );
  return Math.floor(incidentPayout);
}
