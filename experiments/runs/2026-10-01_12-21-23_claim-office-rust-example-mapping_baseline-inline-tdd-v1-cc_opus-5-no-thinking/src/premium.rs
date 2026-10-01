//! Premium calculation: item base premiums (including the component block
//! discount), item-specific surcharges, policy-wide modifiers and the fee.

use crate::item::{ComponentKind, Kind};
use crate::money::Money;
use std::collections::BTreeMap;

/// Percentages from the MHPCO rule book.
const CURSE_SURCHARGE: i64 = 50;
const HIGH_ENCHANTMENT_SURCHARGE: i64 = 30;
const LOYALTY_DISCOUNT: i64 = 20;
const FIRST_INSURANCE_SURCHARGE: i64 = 10;
const FOLLOW_UP_DISCOUNT: i64 = 15;
const PROCESSING_FEE_G: i64 = 5;

/// Thresholds from the MHPCO rule book.
const HIGH_ENCHANTMENT_LEVEL: i64 = 5;
const LOYAL_YEARS: i64 = 2;

/// The customer the whole scenario is about.
#[derive(Debug, Clone, Copy)]
pub struct Customer {
    pub years_with_mhpco: i64,
}

impl Customer {
    /// Long-standing customers (>= 2 years) get the loyalty discount.
    fn is_loyal(self) -> bool {
        self.years_with_mhpco >= LOYAL_YEARS
    }
}

/// A single insured thing as described by a `quote` step.
#[derive(Debug, Clone)]
pub struct Item {
    pub kind: Kind,
    pub material: Option<String>,
    pub enchantment: Option<i64>,
    pub cursed: bool,
}

/// Base premium of a group of alike components. The special block price of
/// 60 G applies only to a group of *exactly* 3; any other count pays the plain
/// 25 G per piece (4 runes → 100 G, 7 runes → 175 G).
///
/// "Alike" means the same concrete component type — a block of 3 runes counts,
/// 2 runes plus a moonstone does not.
fn component_group_premium(count: i64) -> i64 {
    if count == 3 { 60 } else { count * 25 }
}

/// Sum of all item base premiums of a policy, with component blocks applied.
pub fn base_premium(items: &[Item]) -> i64 {
    let mut components: BTreeMap<ComponentKind, i64> = BTreeMap::new();
    let mut total = 0;
    for item in items {
        match item.kind.component() {
            Some(component) => *components.entry(component).or_insert(0) += 1,
            None => total += item.kind.base_premium(),
        }
    }
    total + components.values().map(|&n| component_group_premium(n)).sum::<i64>()
}

impl Item {
    /// Item-specific surcharges apply to this item's own base premium, not to
    /// the policy total.
    fn surcharges(&self) -> Money {
        let base = Money::from_g(self.kind.base_premium());
        let mut total = Money::ZERO;
        if self.cursed {
            total = total + base.percent(CURSE_SURCHARGE);
        }
        if self.is_highly_enchanted() {
            total = total + base.percent(HIGH_ENCHANTMENT_SURCHARGE);
        }
        total
    }

    fn is_highly_enchanted(&self) -> bool {
        self.enchantment.is_some_and(|level| level >= HIGH_ENCHANTMENT_LEVEL)
    }
}

/// Total premium in G for a `quote`.
///
/// Item-specific surcharges are taken on each affected item's base premium;
/// the policy-wide modifiers are taken on the policy base premium (the sum of
/// the item base premiums, block discount included); the processing fee is
/// added last and the result is rounded up.
///
/// `is_follow_up` is true when the customer already had a contract in this
/// scenario. Every item in a quote counts as a first insurance regardless of
/// customer history.
pub fn quote_premium(items: &[Item], customer: Customer, is_follow_up: bool) -> i64 {
    let policy_base = Money::from_g(base_premium(items));
    let mut total = policy_base + items.iter().map(Item::surcharges).sum::<Money>();

    if customer.is_loyal() {
        total = total - policy_base.percent(LOYALTY_DISCOUNT);
    }
    if !items.is_empty() {
        total = total + policy_base.percent(FIRST_INSURANCE_SURCHARGE);
    }
    if is_follow_up {
        total = total - policy_base.percent(FOLLOW_UP_DISCOUNT);
    }

    (total + Money::from_g(PROCESSING_FEE_G)).round_up()
}

/// Insurance sum of a policy: the plain sum of the items' insurance values.
/// The block discount is a premium discount and does not lower this sum.
pub fn insurance_sum(items: &[Item]) -> i64 {
    items.iter().map(|item| item.kind.insurance_value()).sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn component(name: &str) -> Item {
        Item {
            kind: Kind::parse(name).expect("known type"),
            material: None,
            enchantment: None,
            cursed: false,
        }
    }

    fn runes(count: usize) -> Vec<Item> {
        (0..count).map(|_| component("rune")).collect()
    }

    fn sword(enchantment: i64, cursed: bool) -> Item {
        Item {
            kind: Kind::parse("sword").expect("known type"),
            material: Some("steel".to_string()),
            enchantment: Some(enchantment),
            cursed,
        }
    }

    const NEWCOMER: Customer = Customer { years_with_mhpco: 0 };

    #[test]
    fn newcomer_with_a_cursed_sword_pays_165() {
        assert_eq!(quote_premium(&[sword(3, true)], NEWCOMER, false), 165);
    }

    #[test]
    fn long_standing_customers_second_contract_pays_160() {
        let customer = Customer { years_with_mhpco: 3 };
        assert_eq!(quote_premium(&[sword(7, true)], customer, true), 160);
    }

    #[test]
    fn item_surcharge_applies_only_to_the_cursed_items_base_premium() {
        // cursed sword (100) + plain amulet (60) = 160 base; curse adds 50.
        let amulet = Item {
            kind: Kind::parse("amulet").expect("known type"),
            material: Some("silver".to_string()),
            enchantment: Some(2),
            cursed: false,
        };
        let items = [sword(3, true), amulet];
        let policy_base = Money::from_g(base_premium(&items));
        let surcharges = items.iter().map(Item::surcharges).sum::<Money>();
        assert_eq!(policy_base.round_up(), 160);
        assert_eq!((policy_base + surcharges).round_up(), 210);
    }

    #[test]
    fn loyalty_applies_from_exactly_two_years() {
        let loyal = Customer { years_with_mhpco: 2 };
        // 100 base + 10 first insurance - 20 loyalty + 5 fee.
        assert_eq!(quote_premium(&[sword(3, false)], loyal, false), 95);
        // 100 base + 10 first insurance + 5 fee, no discount at 1 year.
        let newer = Customer { years_with_mhpco: 1 };
        assert_eq!(quote_premium(&[sword(3, false)], newer, false), 115);
    }

    #[test]
    fn high_enchantment_applies_from_exactly_five() {
        // 100 base + 30 enchantment + 10 first insurance + 5 fee.
        assert_eq!(quote_premium(&[sword(5, false)], NEWCOMER, false), 145);
        // enchantment 4: no surcharge.
        assert_eq!(quote_premium(&[sword(4, false)], NEWCOMER, false), 115);
    }

    #[test]
    fn curse_and_high_enchantment_stack_on_the_same_item() {
        // 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee.
        assert_eq!(quote_premium(&[sword(5, true)], NEWCOMER, false), 195);
    }

    #[test]
    fn empty_item_list_pays_only_the_processing_fee() {
        assert_eq!(quote_premium(&[], NEWCOMER, false), 5);
    }

    #[test]
    fn block_of_three_alike_components_is_cheaper() {
        assert_eq!(base_premium(&runes(2)), 50);
        assert_eq!(base_premium(&runes(3)), 60);
    }

    #[test]
    fn block_requires_exactly_three_components() {
        assert_eq!(base_premium(&runes(4)), 100);
        assert_eq!(base_premium(&runes(7)), 175);
    }

    #[test]
    fn alike_means_same_component_type() {
        let mixed = vec![component("rune"), component("rune"), component("moonstone")];
        assert_eq!(base_premium(&mixed), 75);
    }

    #[test]
    fn two_groups_of_three_form_two_separate_blocks() {
        let mut items = runes(3);
        items.extend((0..3).map(|_| component("moonstone")));
        assert_eq!(base_premium(&items), 120);
    }

    #[test]
    fn insurance_sum_ignores_the_block_discount() {
        let mut items = vec![Item {
            kind: Kind::parse("sword").expect("known type"),
            material: None,
            enchantment: None,
            cursed: false,
        }];
        items.extend(runes(3));
        assert_eq!(insurance_sum(&items), 1750);
        assert_eq!(base_premium(&items), 160);
    }
}
