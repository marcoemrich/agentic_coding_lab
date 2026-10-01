//! Premium calculation for a quote step.

use std::collections::BTreeMap;

use crate::item::Item;
use crate::money::Amount;
use crate::pricing;

/// An item type that is not in the MHPCO price list.
#[derive(Debug)]
pub struct UnknownItemType(pub String);

/// Sum of the items' base premiums, with alike components priced in blocks.
///
/// "Alike" means the same type: 2 runes and 1 moonstone form no block, while
/// 3 runes and 3 moonstones form two separate blocks.
pub fn base_premium(items: &[Item]) -> Result<i64, UnknownItemType> {
    let mut total = 0;
    let mut component_counts: BTreeMap<&str, i64> = BTreeMap::new();
    for item in items {
        let catalogued = pricing::lookup(&item.item_type)
            .ok_or_else(|| UnknownItemType(item.item_type.clone()))?;
        if item.is_component() {
            *component_counts.entry(&item.item_type).or_default() += 1;
        } else {
            total += catalogued.base_premium;
        }
    }
    for count in component_counts.values() {
        total += pricing::component_block_premium(*count);
    }
    Ok(total)
}

/// Sum of the items' unmodified insurance values.
///
/// The block discount and the premium modifiers affect the premium only, never
/// the insurance sum, so the payout cap derived from it stays unmodified too.
pub fn insurance_sum(items: &[Item]) -> Result<i64, UnknownItemType> {
    items
        .iter()
        .map(|item| {
            pricing::lookup(&item.item_type)
                .map(|c| c.insurance_value)
                .ok_or_else(|| UnknownItemType(item.item_type.clone()))
        })
        .sum()
}

/// The customer the whole scenario is about.
pub struct Customer {
    pub years_with_mhpco: i64,
    /// How many contracts this customer already holds in the scenario.
    pub previous_contracts: i64,
}

/// The premium for a quote, in whole G, rounded up in the MHPCO's favour.
///
/// Item-specific modifiers (cursed, high enchantment) apply to the affected
/// item's base premium; policy-wide modifiers (loyalty, first insurance,
/// follow-up contract) apply to the policy base premium; the processing fee is
/// added at the very end.
pub fn premium(items: &[Item], customer: &Customer) -> Result<i64, UnknownItemType> {
    const CURSE_SURCHARGE: i64 = 50;
    const HIGH_ENCHANTMENT_SURCHARGE: i64 = 30;
    const LOYALTY_DISCOUNT: i64 = 20;
    const FIRST_INSURANCE_SURCHARGE: i64 = 10;
    const FOLLOW_UP_DISCOUNT: i64 = 15;
    const PROCESSING_FEE: i64 = 5;

    let base = Amount::from_g(base_premium(items)?);
    let mut total = base;

    for item in items {
        let item_base = Amount::from_g(item_base_premium(item)?);
        if item.cursed {
            total = total + item_base.percent(CURSE_SURCHARGE);
        }
        if is_highly_enchanted(item) {
            total = total + item_base.percent(HIGH_ENCHANTMENT_SURCHARGE);
        }
        // Each item in a quote counts as a first insurance, whatever the
        // customer's history.
        total = total + item_base.percent(FIRST_INSURANCE_SURCHARGE);
    }

    if customer.years_with_mhpco >= 2 {
        total = total - base.percent(LOYALTY_DISCOUNT);
    }
    if customer.previous_contracts >= 1 {
        total = total - base.percent(FOLLOW_UP_DISCOUNT);
    }

    Ok((total + Amount::from_g(PROCESSING_FEE)).round_up_g())
}

/// Whether the high-enchantment surcharge applies: enchantment level >= 5.
fn is_highly_enchanted(item: &Item) -> bool {
    item.enchantment.is_some_and(|level| level >= 5)
}

/// The base premium of a single item, ignoring any component block discount.
fn item_base_premium(item: &Item) -> Result<i64, UnknownItemType> {
    pricing::lookup(&item.item_type)
        .map(|c| c.base_premium)
        .ok_or_else(|| UnknownItemType(item.item_type.clone()))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn items(json: &str) -> Vec<Item> {
        serde_json::from_str(json).expect("items parse")
    }

    #[test]
    fn main_items_add_up_their_base_premiums() {
        let items = items(r#"[{"type":"sword"},{"type":"amulet"}]"#);
        assert_eq!(base_premium(&items).expect("known types"), 160);
    }

    #[test]
    fn alike_components_form_a_block_by_type() {
        let two_runes_a_moonstone = items(r#"[{"type":"rune"},{"type":"rune"},{"type":"moonstone"}]"#);
        assert_eq!(base_premium(&two_runes_a_moonstone).expect("known types"), 75);
    }

    #[test]
    fn two_separate_types_form_two_separate_blocks() {
        let three_each = items(
            r#"[{"type":"rune"},{"type":"rune"},{"type":"rune"},
                {"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}]"#,
        );
        assert_eq!(base_premium(&three_each).expect("known types"), 120);
    }

    #[test]
    fn an_empty_item_list_has_no_base_premium() {
        assert_eq!(base_premium(&[]).expect("no types"), 0);
    }

    #[test]
    fn piles_of_runes_follow_the_block_examples() {
        for (count, expected) in [(2, 50), (3, 60), (4, 100), (7, 175)] {
            let pile: Vec<Item> = (0..count).map(|_| items(r#"[{"type":"rune"}]"#).remove(0)).collect();
            assert_eq!(
                base_premium(&pile).expect("known types"),
                expected,
                "{count} runes"
            );
        }
    }

    #[test]
    fn the_insurance_sum_adds_up_the_items_values() {
        let sword_and_amulet = items(r#"[{"type":"sword"},{"type":"amulet"}]"#);
        assert_eq!(insurance_sum(&sword_and_amulet).expect("known types"), 1600);
    }

    #[test]
    fn two_swords_are_insured_twice_over() {
        let two_swords = items(r#"[{"type":"sword"},{"type":"sword"}]"#);
        assert_eq!(insurance_sum(&two_swords).expect("known types"), 2000);
    }

    #[test]
    fn a_component_block_does_not_shrink_the_insurance_sum() {
        let sword_and_three_runes = items(
            r#"[{"type":"sword"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]"#,
        );
        assert_eq!(insurance_sum(&sword_and_three_runes).expect("known types"), 1750);
    }

    fn newcomer() -> Customer {
        Customer {
            years_with_mhpco: 0,
            previous_contracts: 0,
        }
    }

    #[test]
    fn an_empty_item_list_costs_only_the_processing_fee() {
        assert_eq!(premium(&[], &newcomer()).expect("no types"), 5);
    }

    #[test]
    fn a_newcomer_with_a_cursed_sword_pays_165_g() {
        let cursed_sword =
            items(r#"[{"type":"sword","material":"steel","enchantment":3,"cursed":true}]"#);
        assert_eq!(premium(&cursed_sword, &newcomer()).expect("known types"), 165);
    }

    #[test]
    fn a_long_standing_customers_second_contract_pays_160_g() {
        let cursed_sword =
            items(r#"[{"type":"sword","material":"steel","enchantment":7,"cursed":true}]"#);
        let returning = Customer {
            years_with_mhpco: 3,
            previous_contracts: 1,
        };
        assert_eq!(premium(&cursed_sword, &returning).expect("known types"), 160);
    }

    #[test]
    fn a_curse_surcharges_only_the_cursed_items_base_premium() {
        let cursed_sword_and_plain_amulet = items(
            r#"[{"type":"sword","enchantment":3,"cursed":true},{"type":"amulet","enchantment":1}]"#,
        );
        // 160 base + 50 curse + 16 first insurance = 226 + 5 fee
        let customer = Customer {
            years_with_mhpco: 0,
            previous_contracts: 0,
        };
        assert_eq!(
            premium(&cursed_sword_and_plain_amulet, &customer).expect("known types"),
            231
        );
    }

    #[test]
    fn exactly_two_years_earns_the_loyalty_discount() {
        let sword = items(r#"[{"type":"sword","enchantment":3}]"#);
        let loyal = Customer {
            years_with_mhpco: 2,
            previous_contracts: 0,
        };
        // 100 base - 20 loyalty + 10 first insurance + 5 fee
        assert_eq!(premium(&sword, &loyal).expect("known types"), 95);
    }

    #[test]
    fn exactly_enchantment_five_earns_the_high_enchantment_surcharge() {
        let sword = items(r#"[{"type":"sword","enchantment":5}]"#);
        // 100 base + 30 enchantment + 10 first insurance + 5 fee
        assert_eq!(premium(&sword, &newcomer()).expect("known types"), 145);
    }

    #[test]
    fn enchantment_four_earns_no_surcharge() {
        let sword = items(r#"[{"type":"sword","enchantment":4}]"#);
        assert_eq!(premium(&sword, &newcomer()).expect("known types"), 115);
    }

    #[test]
    fn a_cursed_highly_enchanted_item_pays_both_surcharges() {
        let sword = items(r#"[{"type":"sword","enchantment":5,"cursed":true}]"#);
        // 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee
        assert_eq!(premium(&sword, &newcomer()).expect("known types"), 195);
    }

    #[test]
    fn a_quote_with_an_unknown_type_is_rejected() {
        let items = items(r#"[{"type":"broomstick"}]"#);
        assert!(premium(&items, &newcomer()).is_err());
    }

    #[test]
    fn an_unknown_item_type_is_rejected() {
        let items = items(r#"[{"type":"broomstick"}]"#);
        assert!(base_premium(&items).is_err());
    }
}
