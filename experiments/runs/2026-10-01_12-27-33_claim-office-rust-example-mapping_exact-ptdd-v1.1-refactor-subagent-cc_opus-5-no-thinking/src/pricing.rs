//! The MHPCO price list: what each insurable item costs to cover, before any
//! risk assessment or customer standing is taken into account.
//!
//! This is the catalog side of the office's knowledge. It changes when the
//! MHPCO revises its prices or its building-block offer, independently of the
//! underwriting rules that surcharge and discount a policy.

use std::collections::BTreeMap;

use crate::Item;

const COMPONENT_BLOCK_SIZE: usize = 3;
const COMPONENT_BLOCK_BASE_PREMIUM: f64 = 60.0;

/// One entry in the MHPCO price list: what an item of this kind costs to
/// cover, and what the office insures it for. The two travel together because
/// they are one row of the list -- the office revises a price-list entry as a
/// whole -- and because the kind decides how the item is priced in a policy.
struct Listing {
    base_premium: f64,
    insurance_value: i64,
    /// Components are the small insurable parts the MHPCO lists apart from
    /// main items: they are priced per component and may form building blocks.
    is_component: bool,
}

const SWORD: Listing = Listing {
    base_premium: 100.0,
    insurance_value: 1000,
    is_component: false,
};
const AMULET: Listing = Listing {
    base_premium: 60.0,
    insurance_value: 600,
    is_component: false,
};
const STAFF: Listing = Listing {
    base_premium: 80.0,
    insurance_value: 800,
    is_component: false,
};
const POTION: Listing = Listing {
    base_premium: 40.0,
    insurance_value: 400,
    is_component: false,
};
const COMPONENT: Listing = Listing {
    base_premium: 25.0,
    insurance_value: 250,
    is_component: true,
};

/// The item's entry in the MHPCO price list, if the office lists its type at
/// all. An item type the list does not name is not insurable.
fn listed(item: &Item) -> Option<&'static Listing> {
    match item.item_type.as_str() {
        "sword" => Some(&SWORD),
        "amulet" => Some(&AMULET),
        "staff" => Some(&STAFF),
        "potion" => Some(&POTION),
        "rune" | "moonstone" => Some(&COMPONENT),
        _ => None,
    }
}

/// Whether the MHPCO lists this item type at all.
pub(crate) fn is_listed(item: &Item) -> bool {
    listed(item).is_some()
}

/// The item's entry in the MHPCO price list. Pricing is only ever asked of
/// items the office has already accepted as listed, so an unlisted type
/// cannot reach here; the office has no price to fall back on if one did.
fn listing_for(item: &Item) -> &'static Listing {
    listed(item).expect("the office prices only items it lists")
}

fn is_component(item: &Item) -> bool {
    listing_for(item).is_component
}

/// A building block of alike components is offered at a special base premium.
fn component_group_base_premium(count: usize) -> f64 {
    if count == COMPONENT_BLOCK_SIZE {
        COMPONENT_BLOCK_BASE_PREMIUM
    } else {
        count as f64 * COMPONENT.base_premium
    }
}

/// Components are alike when they are of the very same type: the MHPCO reads
/// "3 alike components" strictly, so runes and moonstones never share a block.
fn alike_component_kind(item: &Item) -> &str {
    item.item_type.as_str()
}

/// The base premium of all components in a policy: components of the same kind
/// are counted together so that their building block can apply.
fn components_base_premium(items: &[Item]) -> f64 {
    let mut counts: BTreeMap<&str, usize> = BTreeMap::new();
    for item in items.iter().filter(|item| is_component(item)) {
        *counts.entry(alike_component_kind(item)).or_default() += 1;
    }
    counts.into_values().map(component_group_base_premium).sum()
}

/// The base premium of all main items in a policy, straight from the price list.
fn main_items_base_premium(items: &[Item]) -> f64 {
    items
        .iter()
        .filter(|item| !is_component(item))
        .map(|item| listing_for(item).base_premium)
        .sum()
}

/// The policy base premium: the sum of the base premiums of all insured items.
pub(crate) fn policy_base_premium(items: &[Item]) -> f64 {
    main_items_base_premium(items) + components_base_premium(items)
}

/// The base premium an item-specific modifier is measured against: the item's
/// own listed price, which for a component is the per-component premium.
pub(crate) fn item_base_premium(item: &Item) -> f64 {
    listing_for(item).base_premium
}

/// The insurance sum of a policy: the sum of its items' insurance values.
/// Unlike the premium, the insurance sum knows nothing of building blocks --
/// three alike components are insured for three times a component's value.
pub(crate) fn insurance_sum(items: &[Item]) -> i64 {
    items
        .iter()
        .map(|item| listing_for(item).insurance_value)
        .sum()
}
