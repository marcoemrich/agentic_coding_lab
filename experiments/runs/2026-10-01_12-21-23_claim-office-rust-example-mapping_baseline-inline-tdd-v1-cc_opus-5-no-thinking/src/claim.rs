//! Claim processing: the reimbursement clauses, the per-damage deductible and
//! the policy payout cap.

use crate::money::Money;
use crate::premium::Item;

const DEDUCTIBLE_G: i64 = 100;
const HIGH_ENCHANTMENT_PAYOUT_LEVEL: i64 = 8;
const HIGH_ENCHANTMENT_PAYOUT_PERCENT: i64 = 50;
const DRAGON_MATERIAL: &str = "dragon";
/// The total payout per policy is capped at twice the insurance sum.
const CAP_FACTOR: i64 = 2;

/// A single damage entry of an incident.
#[derive(Debug, Clone)]
pub struct Damage {
    pub item_type: String,
    pub amount: i64,
}

/// The reimbursable amount for one damaged item, before the deductible.
///
/// Damage to items with enchantment >= 8 is reimbursed at 50 %; dragon
/// material is fully reimbursed. When both clauses apply the 50 % rule wins.
fn reimbursement(item: &Item, damage: Money) -> Money {
    let highly_enchanted = item
        .enchantment
        .is_some_and(|level| level >= HIGH_ENCHANTMENT_PAYOUT_LEVEL);
    if highly_enchanted {
        return damage.percent(HIGH_ENCHANTMENT_PAYOUT_PERCENT);
    }
    if is_dragon_material(item) {
        return damage;
    }
    // No special clause: full reimbursement as well.
    damage
}

fn is_dragon_material(item: &Item) -> bool {
    item.material.as_deref() == Some(DRAGON_MATERIAL)
}

/// Payout for one damage entry: the reimbursement less the deductible, never
/// negative — the deductible applies once per damaged item.
fn item_payout(item: &Item, damage: Money) -> Money {
    let after_clauses = reimbursement(item, damage);
    let after_deductible = after_clauses - Money::from_g(DEDUCTIBLE_G);
    if after_deductible.is_positive() {
        after_deductible
    } else {
        Money::ZERO
    }
}

/// The payout cap of a policy: twice the insurance sum.
pub fn cap(insurance_sum: i64) -> Money {
    Money::from_g(insurance_sum * CAP_FACTOR)
}

/// A policy created by a `quote` step. It keeps the cap remaining, which
/// successive claims against the same policy draw down.
#[derive(Debug, Clone)]
pub struct Policy {
    items: Vec<Item>,
    remaining_cap: Money,
}

/// Rejects the whole claim if any damage entry carries a negative amount.
fn reject_negative_amounts(damages: &[Damage]) -> Result<(), ClaimError> {
    match damages.iter().find(|damage| damage.amount < 0) {
        Some(damage) => Err(ClaimError::NegativeAmount(damage.amount)),
        None => Ok(()),
    }
}

/// A claim the MHPCO refuses to process at all.
#[derive(Debug, PartialEq, Eq)]
pub enum ClaimError {
    /// A damage entry names an item the policy does not cover, or names more
    /// items of a type than the policy covers.
    NotCovered(String),
    /// A damage entry carries a negative amount.
    NegativeAmount(i64),
}

impl std::fmt::Display for ClaimError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NotCovered(item_type) => {
                write!(f, "damaged item '{item_type}' is not covered by the policy")
            }
            Self::NegativeAmount(amount) => {
                write!(f, "damage amount {amount} is negative")
            }
        }
    }
}

/// The result of one processed claim.
#[derive(Debug, PartialEq, Eq)]
pub struct ClaimResult {
    pub payout: i64,
    pub remaining_cap: i64,
}

impl Policy {
    pub fn new(items: Vec<Item>) -> Self {
        let sum = crate::premium::insurance_sum(&items);
        Self { items, remaining_cap: cap(sum) }
    }

    /// Processes an incident against this policy, drawing down the remaining
    /// cap. Each damage entry is matched to a distinct insured item, so two
    /// sword damages need two insured swords and each carries its own
    /// deductible.
    pub fn process(&mut self, damages: &[Damage]) -> Result<ClaimResult, ClaimError> {
        let matched = self.match_damages(damages)?;

        let desired: Money = matched
            .iter()
            .map(|&(index, amount)| item_payout(&self.items[index], amount))
            .sum();
        let payout = desired.min(self.remaining_cap);
        self.remaining_cap = self.remaining_cap - payout;

        Ok(ClaimResult {
            payout: payout.round_down(),
            remaining_cap: self.remaining_cap.round_down(),
        })
    }

    /// Pairs every damage entry with a distinct insured item of the same type.
    /// Rejects the whole claim if any entry cannot be matched or is negative.
    fn match_damages(&self, damages: &[Damage]) -> Result<Vec<(usize, Money)>, ClaimError> {
        reject_negative_amounts(damages)?;

        let mut used = vec![false; self.items.len()];
        let mut matched = Vec::with_capacity(damages.len());

        for damage in damages {
            let index = self
                .find_unused_item(&damage.item_type, &used)
                .ok_or_else(|| ClaimError::NotCovered(damage.item_type.clone()))?;
            used[index] = true;
            matched.push((index, Money::from_g(damage.amount)));
        }
        Ok(matched)
    }

    /// Index of an insured item of this type that no other damage entry of the
    /// same incident has claimed yet.
    fn find_unused_item(&self, item_type: &str, used: &[bool]) -> Option<usize> {
        let kind = crate::item::Kind::parse(item_type)?;
        (0..self.items.len()).find(|&i| !used[i] && self.items[i].kind == kind)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::item::Kind;

    fn item(type_name: &str, material: &str, enchantment: Option<i64>) -> Item {
        Item {
            kind: Kind::parse(type_name).expect("known type"),
            material: Some(material.to_string()),
            enchantment,
            cursed: false,
        }
    }

    #[test]
    fn standard_damage_is_reimbursed_in_full_minus_deductible() {
        let sword = item("sword", "steel", Some(3));
        assert_eq!(item_payout(&sword, Money::from_g(500)).round_down(), 400);
    }

    #[test]
    fn component_without_enchantment_or_material_has_no_special_clause() {
        let rune = Item {
            kind: Kind::parse("rune").expect("known type"),
            material: None,
            enchantment: None,
            cursed: false,
        };
        assert_eq!(item_payout(&rune, Money::from_g(200)).round_down(), 100);
    }

    #[test]
    fn high_enchantment_halves_the_damage_before_the_deductible() {
        let sword = item("sword", "steel", Some(9));
        assert_eq!(item_payout(&sword, Money::from_g(1000)).round_down(), 400);
    }

    #[test]
    fn high_enchantment_clause_starts_at_exactly_eight() {
        let sword = item("sword", DRAGON_MATERIAL, Some(8));
        assert_eq!(item_payout(&sword, Money::from_g(1000)).round_down(), 400);
    }

    #[test]
    fn dragon_material_alone_is_reimbursed_in_full() {
        let sword = item("sword", DRAGON_MATERIAL, Some(5));
        assert_eq!(item_payout(&sword, Money::from_g(800)).round_down(), 700);
    }

    #[test]
    fn fifty_percent_rule_wins_over_dragon_material() {
        let sword = item("sword", DRAGON_MATERIAL, Some(9));
        assert_eq!(item_payout(&sword, Money::from_g(1000)).round_down(), 400);
    }

    #[test]
    fn cap_is_twice_the_insurance_sum() {
        assert_eq!(cap(1600).round_down(), 3200);
        assert_eq!(cap(1000).round_down(), 2000);
    }

    fn damage(item_type: &str, amount: i64) -> Damage {
        Damage { item_type: item_type.to_string(), amount }
    }

    #[test]
    fn deductible_applies_once_per_damaged_item() {
        let mut policy = Policy::new(vec![
            item("sword", "steel", Some(3)),
            item("amulet", "silver", Some(2)),
        ]);
        let result = policy
            .process(&[damage("sword", 500), damage("amulet", 300)])
            .expect("covered");
        assert_eq!(result.payout, 600);
    }

    #[test]
    fn two_items_of_the_same_type_are_separate_damages() {
        let mut policy = Policy::new(vec![
            item("sword", "steel", Some(3)),
            item("sword", "steel", Some(3)),
        ]);
        assert_eq!(policy.remaining_cap.round_down(), 4000);
        let result = policy
            .process(&[damage("sword", 500), damage("sword", 500)])
            .expect("covered");
        assert_eq!(result.payout, 800);
    }

    #[test]
    fn more_damages_of_a_type_than_insured_items_is_rejected() {
        let mut policy = Policy::new(vec![item("sword", "steel", Some(3))]);
        let error = policy
            .process(&[damage("sword", 500), damage("sword", 500)])
            .expect_err("only one sword insured");
        assert_eq!(error, ClaimError::NotCovered("sword".to_string()));
    }

    #[test]
    fn damage_to_an_uninsured_item_is_rejected() {
        let mut policy = Policy::new(vec![item("sword", "steel", Some(3))]);
        assert_eq!(
            policy.process(&[damage("amulet", 200)]),
            Err(ClaimError::NotCovered("amulet".to_string()))
        );
        assert_eq!(
            policy.process(&[damage("broomstick", 200)]),
            Err(ClaimError::NotCovered("broomstick".to_string()))
        );
    }

    #[test]
    fn negative_damage_amount_is_rejected() {
        let mut policy = Policy::new(vec![item("sword", "steel", Some(3))]);
        assert_eq!(
            policy.process(&[damage("sword", -200)]),
            Err(ClaimError::NegativeAmount(-200))
        );
    }

    #[test]
    fn successive_claims_exhaust_the_cap() {
        let mut policy = Policy::new(vec![item("sword", "steel", Some(3))]);
        let first = policy.process(&[damage("sword", 1500)]).expect("covered");
        assert_eq!((first.payout, first.remaining_cap), (1400, 600));
        let second = policy.process(&[damage("sword", 1500)]).expect("covered");
        assert_eq!((second.payout, second.remaining_cap), (600, 0));
    }

    #[test]
    fn premium_modifiers_do_not_raise_the_cap() {
        let cursed_sword = Item { cursed: true, ..item("sword", "steel", Some(3)) };
        let policy = Policy::new(vec![cursed_sword]);
        assert_eq!(policy.remaining_cap.round_down(), 2000);
    }
}
