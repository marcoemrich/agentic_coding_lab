//! What business the MHPCO will entertain at all: the office's grounds for
//! refusing a quote outright, and for refusing to settle an incident.
//!
//! This is the counter clerk's judgement, settled before any price is quoted
//! or any clause applied. It changes when the office tightens or loosens what
//! it will take on -- a type struck from the price list, a damage report it
//! will no longer read against a policy, an amount it will not entertain --
//! independently of what the office then charges for the business it accepts,
//! and independently of what its clauses reimburse once a claim is admitted.

use std::collections::BTreeMap;

use crate::coverage::covers_of_type;
use crate::pricing::is_listed;
use crate::{Damage, Item};

/// The MHPCO refuses business it has no rule for.
#[derive(Debug, PartialEq, Eq)]
pub enum Refusal {
    UnlistedItemType(String),
    OverclaimedItemType(String),
    NegativeDamageAmount(i64),
}

/// Why the office would refuse to insure this list of items, if it would.
/// Acceptance is settled before any pricing: the office only quotes business
/// its rules cover, and it names the first item it cannot place.
pub(crate) fn refusal_to_insure(items: &[Item]) -> Option<Refusal> {
    items
        .iter()
        .find(|item| !is_listed(item))
        .map(|unlisted| Refusal::UnlistedItemType(unlisted.item_type.clone()))
}

/// Why the office would refuse to settle this incident against these covers,
/// if it would. Two judgements stand between an incident and its clauses, and
/// the office makes them in this order: it first refuses a report it will not
/// read at all, and only then asks whether the policy's covers will entertain
/// the reports that remain.
pub(crate) fn refusal_to_settle(insured: &[Item], damages: &[Damage]) -> Option<Refusal> {
    unreadable_report(damages).or_else(|| overclaimed_cover(insured, damages))
}

/// Why the office would refuse to read a damage report at all, if it would.
/// This judgement is made on the report alone, before any policy is consulted:
/// an amount of negative worth is not a damage the office will entertain. It
/// changes when the office revises what it accepts as a damage report -- a
/// floor on what is worth claiming, a ceiling on what one report may name --
/// independently of what any particular policy covers.
fn unreadable_report(damages: &[Damage]) -> Option<Refusal> {
    damages
        .iter()
        .find(|damage| damage.amount < 0)
        .map(|negative| Refusal::NegativeDamageAmount(negative.amount))
}

/// Why the policy's covers would not entertain these reports, if they would
/// not. The office entertains no more damage of a type than the policy carries
/// cover of that type, which refuses an item the policy does not cover at all
/// -- including a type the office does not even list -- by the same rule. It
/// changes with the office's matching rule, independently of what it accepts
/// as a damage report in the first place.
fn overclaimed_cover(insured: &[Item], damages: &[Damage]) -> Option<Refusal> {
    let mut reported: BTreeMap<&str, usize> = BTreeMap::new();
    for damage in damages {
        *reported.entry(damage.item_type.as_str()).or_default() += 1;
    }
    reported
        .into_iter()
        .find(|(item_type, count)| *count > covers_of_type(insured, item_type))
        .map(|(overclaimed, _)| Refusal::OverclaimedItemType(overclaimed.to_string()))
}
