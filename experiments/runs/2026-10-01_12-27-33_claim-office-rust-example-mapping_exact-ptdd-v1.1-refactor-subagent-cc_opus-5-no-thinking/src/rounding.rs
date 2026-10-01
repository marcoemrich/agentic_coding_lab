//! How the MHPCO turns a fractional amount into the whole G it finally books.
//!
//! The office rounds in its own favor, and which direction that is depends on
//! who owes whom. This is one convention with two faces, so both live here:
//! the office revises how it rounds -- to whole G, to the nearest 5 G, always
//! toward itself or not -- as a single decision, independently of the price
//! list, the clauses, and the limits that produce the fractional amount.

/// A premium is rounded in the MHPCO's favor, which for money the customer
/// owes the office means upwards.
pub(crate) fn round_premium_in_mhpco_favor(premium: f64) -> i64 {
    premium.ceil() as i64
}

/// A payout is rounded in the MHPCO's favor, which for money the office owes
/// the claimant means downwards. Only the settlement total is rounded; the
/// reimbursements it sums are carried as fractions.
pub(crate) fn round_payout_in_mhpco_favor(payout: f64) -> i64 {
    payout.floor() as i64
}
