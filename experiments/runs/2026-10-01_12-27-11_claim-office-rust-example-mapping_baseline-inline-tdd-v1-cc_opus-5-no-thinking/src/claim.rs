//! Claim processing against an existing policy.

use crate::money::Amount;
use crate::quote::Item;

/// One damaged item within an incident.
#[derive(Debug, Clone)]
pub struct Damage {
    pub item_type: String,
    pub amount: i64,
}

/// A damage report against a policy.
#[derive(Debug, Clone)]
pub struct Incident {
    pub cause: String,
    pub damages: Vec<Damage>,
}

/// Why the MHPCO rejects a claim outright.
#[derive(Debug, PartialEq, Eq)]
pub enum ClaimError {
    /// A damaged item the policy does not cover, or covers fewer of.
    NotCovered(String),
    /// A damage amount below zero.
    NegativeAmount(i64),
}

/// The deductible withheld per damage event.
const DEDUCTIBLE: i64 = 100;
/// The payout cap as a multiple of the insurance sum.
const CAP_MULTIPLE: i64 = 2;
/// Enchantment from which damage is reimbursed at half.
const HALF_REIMBURSEMENT_LEVEL: i64 = 8;
/// The material whose damage is fully reimbursed.
const FULLY_REIMBURSED_MATERIAL: &str = "dragon";

/// A policy created by a `quote` step, tracking how much of its cap is left.
#[derive(Debug, Clone)]
pub struct Policy {
    items: Vec<Item>,
    remaining_cap: Amount,
}

impl Policy {
    /// Opens a policy over `items` with a cap of twice their insurance sum.
    pub fn new(items: Vec<Item>, insurance_sum: i64) -> Policy {
        Policy { items, remaining_cap: Amount::whole(insurance_sum * CAP_MULTIPLE) }
    }

    /// The cap still available on this policy, in whole G.
    pub fn remaining_cap(&self) -> i64 {
        self.remaining_cap.round_down()
    }

    /// Processes `incident`, reducing the remaining cap, and returns the payout in whole G.
    pub fn process(&mut self, incident: &Incident) -> Result<i64, ClaimError> {
        let covered = self.match_damages_to_items(incident)?;

        let desired: Amount = covered
            .iter()
            .map(|(item, amount)| reimbursement(item, *amount))
            .fold(Amount::ZERO, |total, part| total + part);

        // The cap is reduced by what is actually paid out, so the rounded-away
        // fraction of a G is not quietly charged against the policy.
        let payout = desired.min(self.remaining_cap).round_down();
        self.remaining_cap = (self.remaining_cap - Amount::whole(payout)).clamp_to_zero();
        Ok(payout)
    }

    /// Pairs each damage with a distinct insured item, rejecting anything uncovered.
    ///
    /// A policy may cover several items of one type, and each damage entry is
    /// its own event, so an item is consumed once it has been claimed for.
    fn match_damages_to_items<'a>(
        &'a self,
        incident: &Incident,
    ) -> Result<Vec<(&'a Item, i64)>, ClaimError> {
        reject_negative_amounts(incident)?;
        let mut unclaimed: Vec<&Item> = self.items.iter().collect();

        incident
            .damages
            .iter()
            .map(|damage| {
                let position = unclaimed
                    .iter()
                    .position(|item| item.item_type == damage.item_type)
                    .ok_or_else(|| ClaimError::NotCovered(damage.item_type.clone()))?;
                Ok((unclaimed.remove(position), damage.amount))
            })
            .collect()
    }
}

/// Rejects the whole claim if any damage reports a negative amount.
fn reject_negative_amounts(incident: &Incident) -> Result<(), ClaimError> {
    match incident.damages.iter().find(|damage| damage.amount < 0) {
        Some(damage) => Err(ClaimError::NegativeAmount(damage.amount)),
        None => Ok(()),
    }
}

/// The reimbursement clause that governs a damaged item.
#[derive(Debug, PartialEq, Eq)]
enum Clause {
    /// Enchantment level >= 8: half the damage.
    HighEnchantment,
    /// Dragon material: the whole damage.
    DragonMaterial,
    /// No special clause: the whole damage.
    Standard,
}

impl Clause {
    /// The clause that applies to `item`. Where both special clauses apply,
    /// the high-enchantment rule wins.
    fn for_item(item: &Item) -> Clause {
        if item.enchantment.unwrap_or(0) >= HALF_REIMBURSEMENT_LEVEL {
            Clause::HighEnchantment
        } else if item.material.as_deref() == Some(FULLY_REIMBURSED_MATERIAL) {
            Clause::DragonMaterial
        } else {
            Clause::Standard
        }
    }

    /// The share of the damage this clause reimburses.
    fn apply(&self, damage: Amount) -> Amount {
        match self {
            Clause::HighEnchantment => damage.half(),
            Clause::DragonMaterial | Clause::Standard => damage,
        }
    }
}

/// Reimbursement for one damage event: the applicable clause, then the deductible.
fn reimbursement(item: &Item, amount: i64) -> Amount {
    let reimbursed = Clause::for_item(item).apply(Amount::whole(amount));
    (reimbursed - Amount::whole(DEDUCTIBLE)).clamp_to_zero()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn item(item_type: &str, material: &str, enchantment: Option<i64>) -> Item {
        Item {
            item_type: item_type.to_string(),
            material: Some(material.to_string()),
            enchantment,
            cursed: false,
        }
    }

    fn incident(damages: &[(&str, i64)]) -> Incident {
        Incident {
            cause: "dragon attack".to_string(),
            damages: damages
                .iter()
                .map(|(item_type, amount)| Damage {
                    item_type: item_type.to_string(),
                    amount: *amount,
                })
                .collect(),
        }
    }

    fn policy_over(items: Vec<Item>, insurance_sum: i64) -> Policy {
        Policy::new(items, insurance_sum)
    }

    #[test]
    fn the_high_enchantment_clause_outranks_dragon_material() {
        let sword = item("sword", FULLY_REIMBURSED_MATERIAL, Some(8));
        assert_eq!(Clause::for_item(&sword), Clause::HighEnchantment);
    }

    #[test]
    fn dragon_material_below_the_enchantment_threshold_gets_its_own_clause() {
        let sword = item("sword", FULLY_REIMBURSED_MATERIAL, Some(7));
        assert_eq!(Clause::for_item(&sword), Clause::DragonMaterial);
    }

    #[test]
    fn a_plain_item_gets_no_special_clause() {
        let sword = item("sword", "steel", Some(3));
        assert_eq!(Clause::for_item(&sword), Clause::Standard);
    }

    #[test]
    fn a_regular_sword_damaged_500_g_pays_out_400_g() {
        let sword = item("sword", "steel", Some(3));
        let mut policy = policy_over(vec![sword], 1000);
        assert_eq!(policy.process(&incident(&[("sword", 500)])).unwrap(), 400);
    }

    #[test]
    fn a_rune_damaged_200_g_pays_out_100_g() {
        let mut policy = policy_over(
            vec![Item {
                item_type: "rune".to_string(),
                material: None,
                enchantment: None,
                cursed: false,
            }],
            250,
        );
        assert_eq!(policy.process(&incident(&[("rune", 200)])).unwrap(), 100);
    }

    #[test]
    fn a_dragon_sword_at_exactly_enchantment_8_is_halved_then_deducted() {
        let sword = item("sword", FULLY_REIMBURSED_MATERIAL, Some(8));
        let mut policy = policy_over(vec![sword], 1000);
        assert_eq!(policy.process(&incident(&[("sword", 1000)])).unwrap(), 400);
    }

    #[test]
    fn the_half_clause_wins_over_dragon_material() {
        let sword = item("sword", FULLY_REIMBURSED_MATERIAL, Some(9));
        let mut policy = policy_over(vec![sword], 1000);
        assert_eq!(policy.process(&incident(&[("sword", 1000)])).unwrap(), 400);
    }

    #[test]
    fn a_dragon_sword_below_the_half_threshold_is_fully_reimbursed() {
        let sword = item("sword", FULLY_REIMBURSED_MATERIAL, Some(5));
        let mut policy = policy_over(vec![sword], 1000);
        assert_eq!(policy.process(&incident(&[("sword", 800)])).unwrap(), 700);
    }

    #[test]
    fn a_steel_sword_at_enchantment_9_is_halved_then_deducted() {
        let sword = item("sword", "steel", Some(9));
        let mut policy = policy_over(vec![sword], 1000);
        assert_eq!(policy.process(&incident(&[("sword", 1000)])).unwrap(), 400);
    }

    #[test]
    fn the_deductible_applies_once_per_damaged_item() {
        let items = vec![item("sword", "steel", Some(1)), item("amulet", "silver", Some(1))];
        let mut policy = policy_over(items, 1600);
        let payout = policy.process(&incident(&[("sword", 500), ("amulet", 300)])).unwrap();
        assert_eq!(payout, 600);
    }

    #[test]
    fn two_swords_each_carry_their_own_deductible() {
        let items = vec![item("sword", "steel", Some(1)), item("sword", "steel", Some(1))];
        let mut policy = policy_over(items, 2000);
        let payout = policy.process(&incident(&[("sword", 500), ("sword", 500)])).unwrap();
        assert_eq!(payout, 800);
    }

    #[test]
    fn more_damages_of_a_type_than_insured_items_rejects_the_claim() {
        let mut policy = policy_over(vec![item("sword", "steel", Some(1))], 1000);
        assert_eq!(
            policy.process(&incident(&[("sword", 500), ("sword", 500)])),
            Err(ClaimError::NotCovered("sword".to_string()))
        );
    }

    #[test]
    fn a_damaged_item_outside_the_policy_rejects_the_claim() {
        let mut policy = policy_over(vec![item("sword", "steel", Some(1))], 1000);
        assert_eq!(
            policy.process(&incident(&[("amulet", 300)])),
            Err(ClaimError::NotCovered("amulet".to_string()))
        );
    }

    #[test]
    fn a_negative_damage_amount_rejects_the_claim() {
        let mut policy = policy_over(vec![item("sword", "steel", Some(1))], 1000);
        assert_eq!(
            policy.process(&incident(&[("sword", -200)])),
            Err(ClaimError::NegativeAmount(-200))
        );
    }

    #[test]
    fn the_cap_is_reduced_by_the_rounded_payout_not_the_fraction() {
        let sword = item("sword", "steel", Some(9));
        let mut policy = policy_over(vec![sword], 1000);
        // Half of 901 G minus the deductible is 350.5 G, paid out as 350 G.
        assert_eq!(policy.process(&incident(&[("sword", 901)])).unwrap(), 350);
        assert_eq!(policy.remaining_cap(), 1650);
    }

    #[test]
    fn the_cap_is_twice_the_insurance_sum() {
        let policy = policy_over(vec![item("sword", "steel", Some(1))], 1000);
        assert_eq!(policy.remaining_cap(), 2000);
    }

    #[test]
    fn successive_claims_exhaust_the_cap() {
        let mut policy = policy_over(vec![item("sword", "steel", Some(1))], 1000);
        assert_eq!(policy.process(&incident(&[("sword", 1500)])).unwrap(), 1400);
        assert_eq!(policy.remaining_cap(), 600);
        assert_eq!(policy.process(&incident(&[("sword", 1500)])).unwrap(), 600);
        assert_eq!(policy.remaining_cap(), 0);
    }
}
