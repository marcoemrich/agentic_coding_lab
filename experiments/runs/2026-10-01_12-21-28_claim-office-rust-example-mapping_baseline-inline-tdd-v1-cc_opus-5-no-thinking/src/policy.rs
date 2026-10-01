//! A policy: the items it covers, its base premium and its insurance sum.

use std::collections::BTreeMap;

use crate::amount::Amount;
use crate::catalog::{base_premium, insurance_value, is_component};
use crate::components::component_group_premium;

/// One insured item as described in a quote step.
#[derive(Debug, Clone)]
pub struct Item {
    pub item_type: String,
    pub material: Option<String>,
    pub enchantment: Option<i64>,
    pub cursed: bool,
}

/// An item type the MHPCO price list does not cover.
#[derive(Debug, PartialEq, Eq)]
pub struct UnknownItemType(pub String);

/// The items covered by one policy, validated against the price list.
#[derive(Debug, Clone)]
pub struct Policy {
    items: Vec<Item>,
}

impl Policy {
    /// Builds a policy, rejecting any item the price list does not cover.
    pub fn new(items: &[Item]) -> Result<Self, UnknownItemType> {
        let unknown = items
            .iter()
            .find(|item| base_premium(&item.item_type).is_none());
        match unknown {
            Some(item) => Err(UnknownItemType(item.item_type.clone())),
            None => Ok(Self {
                items: items.to_vec(),
            }),
        }
    }

    /// The items this policy covers.
    pub fn items(&self) -> &[Item] {
        &self.items
    }

    /// Sum of the item base premiums. Alike components are grouped first so
    /// the building-block rate can apply to each group.
    pub fn base_premium(&self) -> Amount {
        let main_items: Amount = self
            .items
            .iter()
            .filter(|item| !is_component(&item.item_type))
            .map(|item| Amount::whole(i128::from(price_of(&item.item_type))))
            .fold(Amount::zero(), |sum, premium| sum + premium);

        self.component_counts()
            .values()
            .map(|count| Amount::whole(i128::from(component_group_premium(*count))))
            .fold(main_items, |sum, premium| sum + premium)
    }

    /// How many components of each type this policy covers.
    fn component_counts(&self) -> BTreeMap<&str, u64> {
        let mut counts = BTreeMap::new();
        let components = self
            .items
            .iter()
            .filter(|item| is_component(&item.item_type));
        for item in components {
            *counts.entry(item.item_type.as_str()).or_insert(0) += 1;
        }
        counts
    }

    /// Sum of the items' unmodified insurance values; the basis for the cap.
    pub fn insurance_sum(&self) -> i128 {
        self.items
            .iter()
            .map(|item| i128::from(value_of(&item.item_type)))
            .sum()
    }
}

/// Base premium of a type already validated as covered.
fn price_of(item_type: &str) -> u64 {
    base_premium(item_type).expect("validated on construction")
}

/// Insurance value of a type already validated as covered.
fn value_of(item_type: &str) -> u64 {
    insurance_value(item_type).expect("validated on construction")
}
