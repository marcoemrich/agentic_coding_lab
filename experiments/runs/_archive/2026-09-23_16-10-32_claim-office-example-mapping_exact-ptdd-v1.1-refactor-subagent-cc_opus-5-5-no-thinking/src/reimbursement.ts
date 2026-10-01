import type { InsuredItem } from "./insured-item";

// The MHPCO reimbursement clauses: what a single damage event to an insured item pays out.
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE = 0.5;
const FULL_REIMBURSEMENT_SHARE = 1;

// Claim clause threshold; independent of the premium's high-enchantment surcharge threshold.
function fallsUnderHighEnchantmentClause(damagedItem: InsuredItem): boolean {
  return (damagedItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL;
}

// Which reimbursement clause applies to the damaged item: the share of the damage amount MHPCO covers.
// The high-enchantment clause wins over the dragon-material clause; dragon material is fully reimbursed,
// which coincides with the standard full reimbursement.
function reimbursementShare(damagedItem: InsuredItem): number {
  return fallsUnderHighEnchantmentClause(damagedItem) ? HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE : FULL_REIMBURSEMENT_SHARE;
}

// The deductible is taken per damage event; a damage below the deductible reimburses nothing, never a negative amount.
function afterDeductible(coveredAmount: number): number {
  return Math.max(0, coveredAmount - DEDUCTIBLE);
}

// What MHPCO reimburses for a single damaged item: the covered share first, then the deductible.
export function reimbursement(damageAmount: number, damagedItem: InsuredItem): number {
  return afterDeductible(damageAmount * reimbursementShare(damagedItem));
}
