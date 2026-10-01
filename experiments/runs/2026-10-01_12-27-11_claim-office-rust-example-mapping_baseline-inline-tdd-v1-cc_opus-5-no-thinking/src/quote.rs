//! Premium calculation for a list of items a customer wishes to insure.

use crate::catalog::{self, ItemSpec};
use crate::money::Amount;

/// An item as it appears in a `quote` step.
#[derive(Debug, Clone)]
pub struct Item {
    pub item_type: String,
    pub material: Option<String>,
    pub enchantment: Option<i64>,
    pub cursed: bool,
}

/// What the MHPCO knows about the customer when pricing a quote.
#[derive(Debug, Clone, Copy)]
pub struct CustomerContext {
    pub years_with_mhpco: i64,
    /// True once the customer has had an earlier `quote` in the scenario.
    pub has_previous_contract: bool,
}

/// An item type the MHPCO does not cover.
#[derive(Debug, PartialEq, Eq)]
pub struct UnknownItemType(pub String);

/// The special base premium for a building block of 3 alike components.
const COMPONENT_BLOCK_PREMIUM: i64 = 60;
/// A building block is exactly this many alike components.
const COMPONENT_BLOCK_SIZE: i64 = 3;
/// The processing fee added to every premium.
const PROCESSING_FEE: i64 = 5;

const CURSE_SURCHARGE: i64 = 50;
const HIGH_ENCHANTMENT_SURCHARGE: i64 = 30;
const LOYALTY_DISCOUNT: i64 = 20;
const FIRST_INSURANCE_SURCHARGE: i64 = 10;
const FOLLOW_UP_DISCOUNT: i64 = 15;

/// Enchantment from which the high-enchantment surcharge applies.
const HIGH_ENCHANTMENT_LEVEL: i64 = 5;
/// Years of business from which the loyalty discount applies.
const LOYALTY_YEARS: i64 = 2;

/// Base premium per component type, honouring the block of 3 alike components.
fn component_base_premium(count: i64, spec: ItemSpec) -> Amount {
    if count == COMPONENT_BLOCK_SIZE {
        Amount::whole(COMPONENT_BLOCK_PREMIUM)
    } else {
        Amount::whole(spec.base_premium) * count
    }
}

/// The policy base premium and the item-specific surcharges on top of it.
///
/// Policy-wide modifiers apply to `base`; the surcharges are added alongside
/// them, so a 10 % first-insurance surcharge is 10 % of the base premium only.
#[derive(Debug, Clone, Copy)]
struct ItemsPremium {
    base: Amount,
    surcharges: Amount,
}

/// The cursed and high-enchantment surcharges owed for one main item.
fn item_surcharges(item: &Item, spec: ItemSpec) -> Amount {
    let base = Amount::whole(spec.base_premium);
    let mut surcharges = Amount::ZERO;
    if item.cursed {
        surcharges = surcharges + base.percent(CURSE_SURCHARGE);
    }
    if item.enchantment.unwrap_or(0) >= HIGH_ENCHANTMENT_LEVEL {
        surcharges = surcharges + base.percent(HIGH_ENCHANTMENT_SURCHARGE);
    }
    surcharges
}

/// Sums the item base premiums, grouping components so blocks of 3 are recognised.
fn items_premium(items: &[Item]) -> Result<ItemsPremium, UnknownItemType> {
    let mut base = Amount::ZERO;
    let mut surcharges = Amount::ZERO;
    let mut component_counts: Vec<(&str, i64, ItemSpec)> = Vec::new();

    for item in items {
        let spec = catalog::lookup(&item.item_type)
            .ok_or_else(|| UnknownItemType(item.item_type.clone()))?;
        if spec.is_component {
            match component_counts.iter_mut().find(|(t, _, _)| *t == item.item_type) {
                Some(entry) => entry.1 += 1,
                None => component_counts.push((&item.item_type, 1, spec)),
            }
        } else {
            base = base + Amount::whole(spec.base_premium);
            surcharges = surcharges + item_surcharges(item, spec);
        }
    }

    for (_, count, spec) in component_counts {
        base = base + component_base_premium(count, spec);
    }
    Ok(ItemsPremium { base, surcharges })
}

/// The insurance sum of a policy: the items' unmodified insurance values.
pub fn insurance_sum(items: &[Item]) -> Result<i64, UnknownItemType> {
    items
        .iter()
        .map(|item| {
            catalog::lookup(&item.item_type)
                .map(|spec| spec.insurance_value)
                .ok_or_else(|| UnknownItemType(item.item_type.clone()))
        })
        .sum()
}

/// The premium in whole G for insuring `items`, rounded in the MHPCO's favour.
pub fn premium(items: &[Item], customer: CustomerContext) -> Result<i64, UnknownItemType> {
    let ItemsPremium { base, surcharges } = items_premium(items)?;
    let mut total = base + surcharges;

    if customer.years_with_mhpco >= LOYALTY_YEARS {
        total = total - base.percent(LOYALTY_DISCOUNT);
    }
    // Every item in a quote counts as a first insurance, regardless of history.
    total = total + base.percent(FIRST_INSURANCE_SURCHARGE);
    if customer.has_previous_contract {
        total = total - base.percent(FOLLOW_UP_DISCOUNT);
    }

    Ok((total + Amount::whole(PROCESSING_FEE)).round_up())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn newcomer() -> CustomerContext {
        CustomerContext { years_with_mhpco: 0, has_previous_contract: false }
    }

    fn item(item_type: &str) -> Item {
        Item {
            item_type: item_type.to_string(),
            material: None,
            enchantment: None,
            cursed: false,
        }
    }

    /// Base premium plus item surcharges: no policy-wide modifiers, no fee.
    fn base_of(items: &[Item]) -> i64 {
        let premium = items_premium(items).expect("known item types");
        (premium.base + premium.surcharges).round_up()
    }

    #[test]
    fn two_runes_cost_50_g_base_premium() {
        assert_eq!(base_of(&[item("rune"), item("rune")]), 50);
    }

    #[test]
    fn three_runes_form_a_block_at_60_g() {
        assert_eq!(base_of(&[item("rune"), item("rune"), item("rune")]), 60);
    }

    #[test]
    fn four_runes_are_no_block_and_cost_100_g() {
        assert_eq!(base_of(&vec![item("rune"); 4]), 100);
    }

    #[test]
    fn seven_runes_cost_175_g() {
        assert_eq!(base_of(&vec![item("rune"); 7]), 175);
    }

    #[test]
    fn alike_means_the_same_type_so_two_runes_and_a_moonstone_cost_75_g() {
        assert_eq!(base_of(&[item("rune"), item("rune"), item("moonstone")]), 75);
    }

    #[test]
    fn three_runes_and_three_moonstones_are_two_separate_blocks_at_120_g() {
        let mut items = vec![item("rune"); 3];
        items.extend(vec![item("moonstone"); 3]);
        assert_eq!(base_of(&items), 120);
    }

    #[test]
    fn the_curse_surcharge_applies_to_the_cursed_item_only() {
        let cursed_sword = Item { cursed: true, ..item("sword") };
        assert_eq!(base_of(&[cursed_sword, item("amulet")]), 210);
    }

    #[test]
    fn exactly_enchantment_5_earns_the_high_enchantment_surcharge() {
        let sword = Item { enchantment: Some(5), ..item("sword") };
        assert_eq!(base_of(&[sword]), 130);
    }

    #[test]
    fn enchantment_4_earns_no_high_enchantment_surcharge() {
        let sword = Item { enchantment: Some(4), ..item("sword") };
        assert_eq!(base_of(&[sword]), 100);
    }

    #[test]
    fn a_cursed_highly_enchanted_sword_carries_both_surcharges() {
        let sword = Item { enchantment: Some(5), cursed: true, ..item("sword") };
        assert_eq!(base_of(&[sword]), 180);
    }

    #[test]
    fn exactly_2_years_with_mhpco_earns_the_loyalty_discount() {
        let loyal = CustomerContext { years_with_mhpco: 2, has_previous_contract: false };
        // 100 base − 20 loyalty + 10 first insurance + 5 fee
        assert_eq!(premium(&[item("sword")], loyal).unwrap(), 95);
    }

    #[test]
    fn an_empty_item_list_costs_only_the_processing_fee() {
        assert_eq!(premium(&[], newcomer()).unwrap(), 5);
    }

    #[test]
    fn a_newcomer_with_a_cursed_sword_pays_165_g() {
        let sword = Item { enchantment: Some(3), cursed: true, ..item("sword") };
        assert_eq!(premium(&[sword], newcomer()).unwrap(), 165);
    }

    #[test]
    fn a_long_standing_customers_second_contract_for_a_cursed_sword_costs_160_g() {
        let customer = CustomerContext { years_with_mhpco: 3, has_previous_contract: true };
        let sword = Item { enchantment: Some(7), cursed: true, ..item("sword") };
        assert_eq!(premium(&[sword], customer).unwrap(), 160);
    }

    #[test]
    fn an_unknown_item_type_is_rejected() {
        assert_eq!(
            premium(&[item("broomstick")], newcomer()),
            Err(UnknownItemType("broomstick".to_string()))
        );
    }

    #[test]
    fn a_sword_and_an_amulet_are_insured_for_1600_g() {
        assert_eq!(insurance_sum(&[item("sword"), item("amulet")]).unwrap(), 1600);
    }

    #[test]
    fn two_swords_are_insured_for_2000_g() {
        assert_eq!(insurance_sum(&vec![item("sword"); 2]).unwrap(), 2000);
    }

    #[test]
    fn a_component_block_discount_does_not_shrink_the_insurance_sum() {
        let mut items = vec![item("sword")];
        items.extend(vec![item("rune"); 3]);
        assert_eq!(insurance_sum(&items).unwrap(), 1750);
    }
}
