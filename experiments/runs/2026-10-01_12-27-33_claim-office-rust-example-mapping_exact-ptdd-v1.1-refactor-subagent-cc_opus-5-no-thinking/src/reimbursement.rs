//! What the MHPCO reimburses for a single reported damage: the clauses the
//! office applies to one damage amount before it reaches the settlement.
//!
//! This is the claim side's judgement of a single damage event, always passed
//! on a damage the office has admitted and matched to a cover. It changes when
//! the office revises its clauses -- a steeper deductible, a new material that
//! is fully covered, a different enchantment level -- quite independently of
//! the policy-wide limits on what a settlement may total, independently of how
//! a report is matched to a cover, and independently of how the premium side
//! assessed the same item's risk.

use crate::{Damage, Item};

/// A deductible applies per damage event.
const DEDUCTIBLE: f64 = 100.0;

/// Damage to an item enchanted at this level or above is reimbursed at half.
const HALF_REIMBURSEMENT_LEVEL: i64 = 8;

/// The share of the damage that clause reimburses.
const HALF_REIMBURSEMENT_SHARE: f64 = 0.5;

/// With no clause cutting it down, the MHPCO reimburses a damage in full.
const FULL_REIMBURSEMENT_SHARE: f64 = 1.0;

/// Whether the half-reimbursement clause applies to an insured item. The claim
/// side judges high enchantment by its own level, well above the one the
/// premium side surcharges for.
fn half_reimbursement_applies(damaged: &Item) -> bool {
    damaged.enchantment >= HALF_REIMBURSEMENT_LEVEL
}

/// Which share of a reported damage the office's clauses cover. The MHPCO
/// reimburses in full unless a clause of its own cuts the share down.
fn reimbursement_share(damaged: &Item) -> f64 {
    if half_reimbursement_applies(damaged) {
        HALF_REIMBURSEMENT_SHARE
    } else {
        FULL_REIMBURSEMENT_SHARE
    }
}

/// How much of a reported damage the office covers, before the deductible.
fn covered_amount(damage: &Damage, damaged: &Item) -> f64 {
    damage.amount as f64 * reimbursement_share(damaged)
}

/// What the MHPCO reimburses for one reported damage to a covered item: the
/// share of the damage the office covers, less the deductible the claimant
/// bears themselves.
///
/// The amount is carried as a fraction: the MHPCO keeps intermediate amounts
/// unrounded and rounds only the settlement the claimant is finally paid.
pub(crate) fn damage_reimbursement(damage: &Damage, damaged: &Item) -> f64 {
    covered_amount(damage, damaged) - DEDUCTIBLE
}
