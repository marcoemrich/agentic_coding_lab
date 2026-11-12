import { percentOf, total } from "./amounts.js";
import { coveredDamages, type Damage, type DamagedItem } from "./coverage.js";
import type { Policy } from "./policy.js";
import type { Item } from "./price-list.js";
import { roundPayoutInMHPCOsFavor } from "./rounding.js";

export type Settlement = { payout: number; remainingCap: number };

const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;

function hasReducedReimbursement(item: Item): boolean {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL;
}

function reimbursement({ item, damageAmount }: DamagedItem): number {
  return hasReducedReimbursement(item)
    ? percentOf(damageAmount, REDUCED_REIMBURSEMENT_PERCENT)
    : damageAmount;
}

function afterDeductible(reimbursedAmount: number): number {
  return Math.max(0, reimbursedAmount - DEDUCTIBLE);
}

function payoutFor(damagedItem: DamagedItem): number {
  return afterDeductible(reimbursement(damagedItem));
}

export function settleClaim(policy: Policy, damages: Damage[]): Settlement {
  const desiredPayout = roundPayoutInMHPCOsFavor(
    total(coveredDamages(policy.items, damages).map(payoutFor)),
  );
  const payout = Math.min(desiredPayout, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
}
