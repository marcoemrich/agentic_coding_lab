//! Premium calculation: base premium, item and policy modifiers, fee.
//!
//! Item-specific modifiers (curse, high enchantment) apply to the base
//! premium of the affected item; policy-wide modifiers (loyalty, first
//! insurance, follow-up contract) apply to the policy base premium; the
//! processing fee is added at the very end.

use crate::amount::Amount;
use crate::catalog::base_premium;
use crate::policy::{Item, Policy};

const CURSE_SURCHARGE: i128 = 50;
const HIGH_ENCHANTMENT_SURCHARGE: i128 = 30;
const HIGH_ENCHANTMENT_FROM: i64 = 5;
const LOYALTY_DISCOUNT: i128 = 20;
const LOYALTY_FROM_YEARS: i64 = 2;
const FIRST_INSURANCE_SURCHARGE: i128 = 10;
const FOLLOW_UP_DISCOUNT: i128 = 15;
const PROCESSING_FEE: i128 = 5;

/// The single customer of a scenario, as seen by a given quote.
#[derive(Debug, Clone)]
pub struct Customer {
    pub years_with_mhpco: i64,
    /// Contracts already quoted for this customer before the current one.
    pub previous_contracts: u64,
}

impl Customer {
    fn is_long_standing(&self) -> bool {
        self.years_with_mhpco >= LOYALTY_FROM_YEARS
    }

    fn is_on_follow_up_contract(&self) -> bool {
        self.previous_contracts > 0
    }
}

/// The total premium in G for a policy, rounded up in the MHPCO's favor.
pub fn quote_premium(policy: &Policy, customer: &Customer) -> i128 {
    let base = policy.base_premium();
    let total = base + item_surcharges(policy.items()) + policy_modifiers(base, customer);
    (total + Amount::whole(PROCESSING_FEE)).round_up()
}

/// Curse and high-enchantment surcharges, each on its own item's base premium.
fn item_surcharges(items: &[Item]) -> Amount {
    items
        .iter()
        .map(item_surcharge)
        .fold(Amount::zero(), |sum, surcharge| sum + surcharge)
}

/// The surcharges carried by one item.
fn item_surcharge(item: &Item) -> Amount {
    let base = Amount::whole(i128::from(
        base_premium(&item.item_type).expect("validated on construction"),
    ));
    let mut surcharge = Amount::zero();
    if item.cursed {
        surcharge = surcharge + base.percent(CURSE_SURCHARGE);
    }
    if is_highly_enchanted(item) {
        surcharge = surcharge + base.percent(HIGH_ENCHANTMENT_SURCHARGE);
    }
    surcharge
}

fn is_highly_enchanted(item: &Item) -> bool {
    item.enchantment
        .is_some_and(|level| level >= HIGH_ENCHANTMENT_FROM)
}

/// Loyalty, first insurance and follow-up contract, all on the policy base.
fn policy_modifiers(base: Amount, customer: &Customer) -> Amount {
    let mut net = base.percent(FIRST_INSURANCE_SURCHARGE);
    if customer.is_long_standing() {
        net = net - base.percent(LOYALTY_DISCOUNT);
    }
    if customer.is_on_follow_up_contract() {
        net = net - base.percent(FOLLOW_UP_DISCOUNT);
    }
    net
}
