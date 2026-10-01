//! Claim processing: per-damage reimbursement clauses, deductible and cap.

use std::collections::BTreeMap;

use crate::amount::Amount;
use crate::policy::{Item, Policy};

const DEDUCTIBLE: i128 = 100;
const CAP_MULTIPLE: i128 = 2;
const HALF_REIMBURSEMENT: i128 = 50;
const FULL_REIMBURSEMENT: i128 = 100;
const HALF_RULE_FROM_ENCHANTMENT: i64 = 8;

/// One damaged item in a damage report.
#[derive(Debug, Clone)]
pub struct Damage {
    pub item_type: String,
    pub amount: i64,
}

/// A damage event reported against a policy.
#[derive(Debug, Clone)]
pub struct Incident {
    pub cause: String,
    pub damages: Vec<Damage>,
}

/// Why the MHPCO refuses to process a claim at all.
#[derive(Debug, PartialEq, Eq)]
pub enum ClaimError {
    /// A damage names an item this policy does not cover (or covers fewer of).
    NotCovered(String),
    /// A damage reports a negative amount.
    NegativeAmount(i64),
}

impl std::fmt::Display for ClaimError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NotCovered(item_type) => {
                write!(f, "damaged item '{item_type}' is not covered by this policy")
            }
            Self::NegativeAmount(amount) => {
                write!(f, "damage amount {amount} is negative")
            }
        }
    }
}

/// The outcome of one settled claim.
#[derive(Debug, PartialEq, Eq)]
pub struct Settlement {
    pub payout: i128,
    pub remaining_cap: i128,
}

/// A policy in force, tracking how much of its cap is left.
#[derive(Debug, Clone)]
pub struct OpenPolicy {
    policy: Policy,
    remaining_cap: Amount,
}

impl OpenPolicy {
    /// Puts a policy in force with its full cap available.
    pub fn new(policy: Policy) -> Self {
        let cap = Amount::whole(policy.insurance_sum() * CAP_MULTIPLE);
        Self {
            policy,
            remaining_cap: cap,
        }
    }

    /// Cap still available for future claims, in whole G.
    pub fn remaining_cap(&self) -> i128 {
        self.remaining_cap.round_down()
    }
}

/// Settles an incident against a policy, consuming part of its cap.
///
/// The whole claim is rejected — leaving the cap untouched — if any damage
/// names an item the policy does not cover or reports a negative amount.
pub fn settle(policy: &mut OpenPolicy, incident: &Incident) -> Result<Settlement, ClaimError> {
    let matched = match_damages_to_items(&policy.policy, &incident.damages)?;

    let desired = matched
        .iter()
        .map(|(damage, item)| reimbursement(damage, item))
        .fold(Amount::zero(), |sum, part| sum + part);

    let payout = desired.min(policy.remaining_cap);
    policy.remaining_cap = policy.remaining_cap - payout;

    Ok(Settlement {
        payout: payout.round_down(),
        remaining_cap: policy.remaining_cap(),
    })
}

/// Pairs every damage with a distinct covered item of the same type.
fn match_damages_to_items<'a>(
    policy: &'a Policy,
    damages: &'a [Damage],
) -> Result<Vec<(&'a Damage, &'a Item)>, ClaimError> {
    let mut available = covered_items_by_type(policy);
    damages
        .iter()
        .map(|damage| Ok((validated(damage)?, take_item(&mut available, &damage.item_type)?)))
        .collect()
}

/// The covered items grouped by type, each available to one damage entry.
fn covered_items_by_type(policy: &Policy) -> BTreeMap<&str, Vec<&Item>> {
    let mut by_type: BTreeMap<&str, Vec<&Item>> = BTreeMap::new();
    for item in policy.items() {
        by_type
            .entry(item.item_type.as_str())
            .or_default()
            .push(item);
    }
    by_type
}

/// Claims one covered item of `item_type`, failing once they are used up.
fn take_item<'a>(
    available: &mut BTreeMap<&str, Vec<&'a Item>>,
    item_type: &str,
) -> Result<&'a Item, ClaimError> {
    available
        .get_mut(item_type)
        .and_then(Vec::pop)
        .ok_or_else(|| ClaimError::NotCovered(item_type.to_string()))
}

/// Rejects a damage the MHPCO will not even look at.
fn validated(damage: &Damage) -> Result<&Damage, ClaimError> {
    if damage.amount < 0 {
        return Err(ClaimError::NegativeAmount(damage.amount));
    }
    Ok(damage)
}

/// Reimbursement for one damaged item: its clause, then the deductible.
fn reimbursement(damage: &Damage, item: &Item) -> Amount {
    let covered = Amount::whole(i128::from(damage.amount)).percent(reimbursement_rate(item));
    (covered - Amount::whole(DEDUCTIBLE)).clamp_to_zero()
}

/// The share of the damage the MHPCO reimburses for this item.
///
/// Dragon material is reimbursed in full, which is also what every item
/// without a special clause gets. A highly enchanted item is reimbursed at
/// half even when it is made of dragon material — where both clauses apply,
/// the 50 % rule wins.
fn reimbursement_rate(item: &Item) -> i128 {
    if is_highly_enchanted(item) {
        HALF_REIMBURSEMENT
    } else {
        FULL_REIMBURSEMENT
    }
}

fn is_highly_enchanted(item: &Item) -> bool {
    item.enchantment
        .is_some_and(|level| level >= HALF_RULE_FROM_ENCHANTMENT)
}
