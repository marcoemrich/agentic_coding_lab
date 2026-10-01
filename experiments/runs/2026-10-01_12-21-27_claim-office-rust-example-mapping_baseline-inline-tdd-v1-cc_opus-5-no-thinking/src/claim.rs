//! Payout calculation for a claim step.

use serde::Deserialize;

use crate::item::Item;
use crate::money::Amount;

/// A deductible applies once per damaged item.
const DEDUCTIBLE: i64 = 100;

/// One damaged item within an incident.
#[derive(Debug, Clone, Deserialize)]
pub struct Damage {
    #[serde(rename = "itemType")]
    pub item_type: String,
    pub amount: i64,
}

/// A damage event against a policy.
#[derive(Debug, Clone, Deserialize)]
pub struct Incident {
    pub cause: String,
    pub damages: Vec<Damage>,
}

/// The reimbursement for one damaged item, before the deductible.
///
/// Damage to a highly enchanted item (level >= 8) is reimbursed at 50 %.
/// Damage to a dragon-material item is reimbursed in full — but when both
/// clauses apply, the 50 % rule wins.
pub fn reimbursement(item: &Item, damage: i64) -> Amount {
    const HIGH_ENCHANTMENT_SHARE: i64 = 50;
    const HIGH_ENCHANTMENT_LEVEL: i64 = 8;

    let full = Amount::from_g(damage);
    if item
        .enchantment
        .is_some_and(|level| level >= HIGH_ENCHANTMENT_LEVEL)
    {
        full.percent(HIGH_ENCHANTMENT_SHARE)
    } else {
        full
    }
}

/// A damage entry that the policy cannot honour.
#[derive(Debug)]
pub enum ClaimError {
    /// A damaged item is not covered by the policy, or has an unknown type.
    NotCovered(String),
    /// More damages of a type than the policy covers items of that type.
    MoreDamagesThanInsured(String),
    /// A damage amount below zero.
    NegativeAmount(i64),
}

/// A policy created by a quote step, tracking how much cap it has left.
pub struct Policy {
    pub items: Vec<Item>,
    pub remaining_cap: i64,
}

impl Policy {
    /// Opens a policy over `items` with a cap of twice the insurance sum.
    pub fn new(items: Vec<Item>, insurance_sum: i64) -> Self {
        Policy {
            items,
            remaining_cap: insurance_sum * 2,
        }
    }

    /// Settles `incident`, returning the payout and reducing the remaining cap.
    ///
    /// Each damage entry is matched against a distinct insured item, carries its
    /// own deductible, and the total is limited to the cap left on the policy.
    pub fn settle(&mut self, incident: &Incident) -> Result<i64, ClaimError> {
        let mut claimed = Vec::new();
        let mut total = Amount::from_g(0);

        for damage in &incident.damages {
            let item = self.item_for(damage, &claimed)?;
            claimed.push(item);
            total = total + self.net_of_deductible(item, damage.amount);
        }

        let payout = total.round_down_g().min(self.remaining_cap);
        self.remaining_cap -= payout;
        Ok(payout)
    }

    /// The insured item `damage` refers to, rejecting invalid entries.
    fn item_for(&self, damage: &Damage, claimed: &[usize]) -> Result<usize, ClaimError> {
        if damage.amount < 0 {
            return Err(ClaimError::NegativeAmount(damage.amount));
        }
        self.match_item(&damage.item_type, claimed)
    }

    /// The reimbursement for one damage, less its deductible, never negative.
    fn net_of_deductible(&self, item: usize, amount: i64) -> Amount {
        let net = reimbursement(&self.items[item], amount) - Amount::from_g(DEDUCTIBLE);
        net.max(Amount::from_g(0))
    }

    /// Finds an insured item of `item_type` that no earlier damage claimed.
    fn match_item(&self, item_type: &str, claimed: &[usize]) -> Result<usize, ClaimError> {
        let covered = self
            .items
            .iter()
            .enumerate()
            .filter(|(_, item)| item.item_type == item_type);
        match covered.clone().find(|(i, _)| !claimed.contains(i)) {
            Some((i, _)) => Ok(i),
            None if covered.count() > 0 => {
                Err(ClaimError::MoreDamagesThanInsured(item_type.to_string()))
            }
            None => Err(ClaimError::NotCovered(item_type.to_string())),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn item(json: &str) -> Item {
        serde_json::from_str(json).expect("item parses")
    }

    fn items(json: &str) -> Vec<Item> {
        serde_json::from_str(json).expect("items parse")
    }

    fn incident(json: &str) -> Incident {
        serde_json::from_str(json).expect("incident parses")
    }

    #[test]
    fn a_deductible_applies_once_per_damaged_item() {
        let mut policy = Policy::new(items(r#"[{"type":"sword"},{"type":"amulet"}]"#), 1600);
        let dragon_attack = incident(
            r#"{"cause":"dragon","damages":[
                {"itemType":"sword","amount":500},{"itemType":"amulet","amount":300}]}"#,
        );
        assert_eq!(policy.settle(&dragon_attack).expect("covered"), 600);
    }

    #[test]
    fn a_cap_is_twice_the_insurance_sum() {
        let policy = Policy::new(items(r#"[{"type":"sword"}]"#), 1000);
        assert_eq!(policy.remaining_cap, 2000);
    }

    #[test]
    fn successive_claims_exhaust_the_cap() {
        let mut policy = Policy::new(items(r#"[{"type":"sword"}]"#), 1000);
        let big = incident(r#"{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}"#);
        assert_eq!(policy.settle(&big).expect("covered"), 1400);
        assert_eq!(policy.remaining_cap, 600);
        assert_eq!(policy.settle(&big).expect("covered"), 600);
        assert_eq!(policy.remaining_cap, 0);
    }

    #[test]
    fn two_entries_of_a_type_need_two_insured_items() {
        let mut policy = Policy::new(items(r#"[{"type":"sword"},{"type":"sword"}]"#), 2000);
        let both = incident(
            r#"{"cause":"dragon","damages":[
                {"itemType":"sword","amount":500},{"itemType":"sword","amount":500}]}"#,
        );
        assert_eq!(policy.settle(&both).expect("covered"), 800);
    }

    #[test]
    fn more_damages_than_insured_items_is_rejected() {
        let mut policy = Policy::new(items(r#"[{"type":"sword"}]"#), 1000);
        let both = incident(
            r#"{"cause":"dragon","damages":[
                {"itemType":"sword","amount":500},{"itemType":"sword","amount":500}]}"#,
        );
        assert!(policy.settle(&both).is_err());
    }

    #[test]
    fn an_uninsured_item_is_rejected() {
        let mut policy = Policy::new(items(r#"[{"type":"sword"}]"#), 1000);
        let amulet = incident(r#"{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}"#);
        assert!(policy.settle(&amulet).is_err());
    }

    #[test]
    fn a_negative_damage_amount_is_rejected() {
        let mut policy = Policy::new(items(r#"[{"type":"sword"}]"#), 1000);
        let bogus = incident(r#"{"cause":"fire","damages":[{"itemType":"sword","amount":-200}]}"#);
        assert!(policy.settle(&bogus).is_err());
    }

    #[test]
    fn a_dragon_sword_at_enchantment_eight_pays_400_g() {
        let mut policy = Policy::new(
            items(r#"[{"type":"sword","material":"dragon","enchantment":8}]"#),
            1000,
        );
        let hit = incident(r#"{"cause":"dragon","damages":[{"itemType":"sword","amount":1000}]}"#);
        assert_eq!(policy.settle(&hit).expect("covered"), 400);
    }

    #[test]
    fn a_damaged_rune_pays_100_g() {
        let mut policy = Policy::new(items(r#"[{"type":"rune"}]"#), 250);
        let hit = incident(r#"{"cause":"fire","damages":[{"itemType":"rune","amount":200}]}"#);
        assert_eq!(policy.settle(&hit).expect("covered"), 100);
    }

    #[test]
    fn a_regular_item_is_reimbursed_in_full() {
        let steel_sword = item(r#"{"type":"sword","material":"steel","enchantment":3}"#);
        assert_eq!(reimbursement(&steel_sword, 500), Amount::from_g(500));
    }

    #[test]
    fn a_highly_enchanted_item_is_reimbursed_at_half() {
        let sword = item(r#"{"type":"sword","material":"steel","enchantment":9}"#);
        assert_eq!(reimbursement(&sword, 1000), Amount::from_g(500));
    }

    #[test]
    fn enchantment_exactly_eight_is_already_highly_enchanted() {
        let sword = item(r#"{"type":"sword","material":"dragon","enchantment":8}"#);
        assert_eq!(reimbursement(&sword, 1000), Amount::from_g(500));
    }

    #[test]
    fn dragon_material_alone_is_reimbursed_in_full() {
        let sword = item(r#"{"type":"sword","material":"dragon","enchantment":5}"#);
        assert_eq!(reimbursement(&sword, 800), Amount::from_g(800));
    }

    #[test]
    fn the_half_rule_wins_over_dragon_material() {
        let sword = item(r#"{"type":"sword","material":"dragon","enchantment":9}"#);
        assert_eq!(reimbursement(&sword, 1000), Amount::from_g(500));
    }

    #[test]
    fn a_component_has_no_special_clause() {
        let rune = item(r#"{"type":"rune"}"#);
        assert_eq!(reimbursement(&rune, 200), Amount::from_g(200));
    }
}
