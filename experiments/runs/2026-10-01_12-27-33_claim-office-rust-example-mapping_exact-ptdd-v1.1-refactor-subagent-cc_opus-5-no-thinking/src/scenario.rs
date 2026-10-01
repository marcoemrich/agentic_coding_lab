//! The scenario the office is asked to work through: the JSON document a
//! client submits, and the answers the office writes back.
//!
//! This is the transport adapter, not a domain decision. It changes when the
//! document format changes -- a renamed field, a new step -- independently of
//! what the office charges or settles.

use serde::{Deserialize, Serialize};

use crate::{Customer, Damage, Item, Refusal};

#[derive(Deserialize)]
pub(crate) struct Scenario {
    pub(crate) customer: CustomerDocument,
    pub(crate) steps: Vec<Step>,
}

#[derive(Deserialize)]
pub(crate) struct CustomerDocument {
    #[serde(rename = "yearsWithMHPCO")]
    years_with_mhpco: i64,
}

impl CustomerDocument {
    pub(crate) fn customer(&self) -> Customer {
        Customer {
            years_with_mhpco: self.years_with_mhpco,
        }
    }
}

#[derive(Deserialize)]
#[serde(tag = "op", rename_all = "lowercase")]
pub(crate) enum Step {
    Quote { items: Vec<ItemDocument> },
    Claim { policy: usize, incident: Incident },
}

#[derive(Deserialize)]
pub(crate) struct ItemDocument {
    #[serde(rename = "type")]
    item_type: String,
    #[serde(default)]
    material: String,
    #[serde(default)]
    enchantment: i64,
    #[serde(default)]
    cursed: bool,
}

impl ItemDocument {
    pub(crate) fn item(&self) -> Item {
        Item {
            item_type: self.item_type.clone(),
            material: self.material.clone(),
            enchantment: self.enchantment,
            cursed: self.cursed,
        }
    }
}

#[derive(Deserialize)]
pub(crate) struct Incident {
    #[allow(dead_code)]
    cause: String,
    pub(crate) damages: Vec<DamageDocument>,
}

#[derive(Deserialize)]
pub(crate) struct DamageDocument {
    #[serde(rename = "itemType")]
    item_type: String,
    amount: i64,
}

impl DamageDocument {
    pub(crate) fn damage(&self) -> Damage {
        Damage {
            item_type: self.item_type.clone(),
            amount: self.amount,
        }
    }
}

#[derive(Serialize)]
#[serde(untagged)]
pub(crate) enum StepResult {
    Quote {
        premium: i64,
    },
    Claim {
        payout: i64,
        #[serde(rename = "remainingCap")]
        remaining_cap: i64,
    },
}

#[derive(Serialize)]
pub(crate) struct Results {
    pub(crate) results: Vec<StepResult>,
}

/// The office cannot even read the document it was handed.
#[derive(Debug)]
pub enum Unreadable {
    Malformed(String),
    Refused(Refusal),
}

impl From<Refusal> for Unreadable {
    fn from(refusal: Refusal) -> Self {
        Unreadable::Refused(refusal)
    }
}
