import type { Item } from "./price-list.js";

// The MHPCO's reimbursement clauses: which share of a damage amount the office
// reimburses, before it withholds its deductible. Each clause is keyed on an
// attribute of the damaged item; absent any clause, damage is reimbursed in
// full. These clauses change with the office's risk policy, independently of
// the deductible and of how a claim is settled across several damages.

const FULL_SHARE = 1;

// Damage to items of this enchantment level or above is reimbursed at half.
const HALF_REIMBURSEMENT_ENCHANTMENT = 8;
const HALF_SHARE = 0.5;

// The office's dragon-material clause — "damage to dragon-material items is
// fully reimbursed" — needs no rule of its own here, because it never changes
// a share: below the half-reimbursement enchantment it grants the full share
// that every damage already gets, and at or above it the half-reimbursement
// clause expressly wins. Branching on material would therefore add a rule
// that no claim can turn on. Should the office ever make the clause pay a
// share of its own, that is where it would enter.

function qualifiesForHalfReimbursement(item: Item): boolean {
  return (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT;
}

export function reimbursementShareOf(damagedItem: Item): number {
  return qualifiesForHalfReimbursement(damagedItem) ? HALF_SHARE : FULL_SHARE;
}
