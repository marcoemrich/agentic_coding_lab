//! The ceiling the MHPCO puts on what a policy will ever pay out, and how far
//! a policy has already eaten into it.
//!
//! This is the office's exposure limit. It changes when the MHPCO revises how
//! far it will stand behind a policy -- a different multiple of the insurance
//! sum, a different basis for that sum, a ceiling that resets with the
//! insurance year rather than running for the life of the policy -- and those
//! revisions change together, because the ceiling and the running total
//! measured against it are one piece of knowledge. It changes independently of
//! the clauses that judge any single damage, and independently of how the
//! premium side surcharged the same items: premium modifiers never raise the
//! cap.

use crate::pricing::insurance_sum;
use crate::{Item, Settlement};

/// The total payout per policy is capped at twice its insurance sum.
const CAP_MULTIPLE: i64 = 2;

/// How far a policy has eaten into the most the MHPCO will ever pay on it.
///
/// The ceiling covers the policy rather than any one claim, so the office
/// carries this from settlement to settlement: each claim is paid out of
/// what successive earlier ones have left.
pub(crate) struct PolicyExposure {
    remaining: i64,
}

impl PolicyExposure {
    /// A policy's exposure at the outset: the whole ceiling is still available.
    pub(crate) fn on_policy_covering(items: &[Item]) -> Self {
        PolicyExposure {
            remaining: CAP_MULTIPLE * insurance_sum(items),
        }
    }

    /// What the office actually settles once its exposure limit is applied to
    /// the amount the claim's clauses would otherwise pay, spending that much
    /// of the ceiling. The MHPCO does not refuse a claim that outruns the cap;
    /// it pays up to what is left and reports how much exposure remains.
    pub(crate) fn settle(&mut self, desired_payout: i64) -> Settlement {
        let payout = desired_payout.min(self.remaining);
        self.remaining -= payout;
        Settlement {
            payout,
            remaining_cap: self.remaining,
        }
    }
}
