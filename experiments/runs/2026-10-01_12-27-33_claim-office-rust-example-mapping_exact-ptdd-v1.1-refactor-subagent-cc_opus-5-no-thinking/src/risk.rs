//! The MHPCO's risk assessment of a single insured item: which properties of
//! an item the office judges hazardous, and what surcharge each one carries.
//!
//! This is the underwriting side's view of an item's danger. It changes when
//! the office revises its risk appetite -- a steeper curse surcharge, a new
//! hazardous property -- independently of the customer's standing, of the
//! price list, and of how a claim later judges the same item.

use crate::pricing::item_base_premium;
use crate::Item;

const CURSE_SURCHARGE: f64 = 0.50;
const HIGH_ENCHANTMENT_SURCHARGE: f64 = 0.30;
const HIGH_ENCHANTMENT_LEVEL: i64 = 5;

/// An item counts as highly enchanted for the premium's risk assessment from
/// the MHPCO's listed enchantment level upwards. The claim side judges high
/// enchantment by its own, separate level.
fn is_highly_enchanted(item: &Item) -> bool {
    item.enchantment >= HIGH_ENCHANTMENT_LEVEL
}

/// The risk surcharge rate a single item carries, as a share of its own base
/// premium: the MHPCO's item-specific risk assessment.
fn item_surcharge_rate(item: &Item) -> f64 {
    let mut rate = 0.0;
    if item.cursed {
        rate += CURSE_SURCHARGE;
    }
    if is_highly_enchanted(item) {
        rate += HIGH_ENCHANTMENT_SURCHARGE;
    }
    rate
}

/// What the policy's hazardous items add to its premium: each affected item
/// surcharges its own base premium, never the rest of the policy.
pub(crate) fn item_risk_surcharges(items: &[Item]) -> f64 {
    items
        .iter()
        .map(|item| item_base_premium(item) * item_surcharge_rate(item))
        .sum()
}
