//! Which insured item a reported damage is a claim against.
//!
//! This is the office's matching rule, and it is a policy decision of its own:
//! the MHPCO has to decide what a damage report names when a policy covers
//! several items, and today it reads an `itemType` as naming the cover of that
//! type the policy carries. It changes when the office revises how a report is
//! read against a policy -- matching successive reports of one type to
//! successive covers, reading a report against the cover it most resembles --
//! independently of the clauses that then judge each damage's amount, and
//! independently of the ceiling on what the settlement may total.
//!
//! The office never reads a report it has not already admitted, so the rule is
//! stated over admitted reports only: admissibility decides whether a report
//! is entertained at all, and matching decides which cover entertains it.

use crate::{Damage, Item};

/// The cover an admitted damage report is read against.
///
/// The MHPCO matches by item type alone: a report names a type, and the office
/// reads it against a cover of that type on the policy. Admissibility has
/// already established that the policy carries cover for every report it
/// entertains, so an admitted report always finds its cover; the office would
/// have refused the incident otherwise.
pub(crate) fn cover_claimed_against<'a>(insured: &'a [Item], damage: &Damage) -> &'a Item {
    insured
        .iter()
        .find(|item| item.item_type == damage.item_type)
        .expect("an admitted incident reports only damage the policy covers")
}

/// How much cover of one item type the policy carries: the office reads a
/// damage report of a type against the covers of that type, so it can
/// entertain no more reports of a type than the policy has covers.
pub(crate) fn covers_of_type(insured: &[Item], item_type: &str) -> usize {
    insured
        .iter()
        .filter(|item| item.item_type == item_type)
        .count()
}
