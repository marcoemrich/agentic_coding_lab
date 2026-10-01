//! How a customer's standing with the MHPCO bears on the premium: the
//! policy-wide modifiers the office grants or levies for loyalty, for a first
//! insurance, and for a contract that follows an earlier one.
//!
//! This is the customer-relations side of the office's knowledge. It changes
//! when the MHPCO courts or squeezes its customers -- a longer loyalty
//! qualification, a deeper follow-up discount -- independently of how
//! hazardous any insured item happens to be.

use crate::Customer;

const FIRST_INSURANCE_SURCHARGE: f64 = 0.10;
const LOYALTY_DISCOUNT: f64 = 0.20;
const LOYALTY_YEARS: i64 = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT: f64 = 0.15;

/// A long-standing customer has been with the MHPCO for at least two years.
fn is_long_standing(customer: &Customer) -> bool {
    customer.years_with_mhpco >= LOYALTY_YEARS
}

/// Long-standing customers are rewarded with a discount on the policy.
fn loyalty_rate(customer: &Customer) -> f64 {
    if is_long_standing(customer) {
        -LOYALTY_DISCOUNT
    } else {
        0.0
    }
}

/// Every contract after the customer's first is discounted.
fn follow_up_contract_rate(previous_quotes: usize) -> f64 {
    if previous_quotes > 0 {
        -FOLLOW_UP_CONTRACT_DISCOUNT
    } else {
        0.0
    }
}

/// Every quote insures its items for the first time, so the initial assessment
/// surcharge is carried unconditionally: the MHPCO reads "first insurance" as
/// the item's, not the customer's, so customer history never waives it.
fn first_insurance_rate() -> f64 {
    FIRST_INSURANCE_SURCHARGE
}

/// The net policy-wide modifier rate the customer's circumstances carry, as a
/// share of the policy base premium. The MHPCO sums its policy-wide modifiers
/// rather than compounding them, so each one contributes its own rate here.
fn policy_modifier_rate(customer: &Customer, previous_quotes: usize) -> f64 {
    first_insurance_rate() + loyalty_rate(customer) + follow_up_contract_rate(previous_quotes)
}

/// What the customer's standing adds to or takes off the policy base premium.
pub(crate) fn standing_adjustment(
    base: f64,
    customer: &Customer,
    previous_quotes: usize,
) -> f64 {
    base * policy_modifier_rate(customer, previous_quotes)
}
