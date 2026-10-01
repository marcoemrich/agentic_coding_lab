//! The wire vocabulary MHPCO trades in: the JSON documents a scenario arrives
//! in and the results document the office answers with. The field names here
//! are the ones the schema binds the office to, and they are stated nowhere
//! else -- a change to the wire changes this module alone, and none of the
//! office's pricing, claim or scenario rules.

use serde::{Deserialize, Serialize};

use crate::{Customer, Damage, Item, ItemType, Scenario, Step, StepResult, run};

/// A scenario document as MHPCO receives it over the wire.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ScenarioDocument {
    customer: CustomerDocument,
    steps: Vec<StepDocument>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct CustomerDocument {
    #[serde(rename = "yearsWithMHPCO")]
    years_with_mhpco: u32,
}

#[derive(Deserialize)]
#[serde(tag = "op", rename_all = "camelCase")]
enum StepDocument {
    Quote { items: Vec<ItemDocument> },
    Claim { policy: usize, incident: IncidentDocument },
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ItemDocument {
    #[serde(rename = "type")]
    item_type: String,
    #[serde(default)]
    material: String,
    #[serde(default)]
    enchantment: u32,
    #[serde(default)]
    cursed: bool,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct IncidentDocument {
    /// What the report says brought the damage about. MHPCO requires every
    /// incident to name a cause and refuses a report that states none, or
    /// states one that is not a name; but no rule of its wording reads the
    /// cause, so having required it the office goes no further.
    #[expect(dead_code, reason = "required of the report, read by no rule")]
    cause: String,
    damages: Vec<DamageDocument>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct DamageDocument {
    item_type: String,
    amount: i64,
}

/// The results document the office answers a scenario with.
#[derive(Serialize)]
struct ResultsDocument {
    results: Vec<StepResultDocument>,
}

#[derive(Serialize)]
#[serde(untagged)]
enum StepResultDocument {
    Quote {
        premium: u64,
    },
    #[serde(rename_all = "camelCase")]
    Claim {
        payout: u64,
        remaining_cap: u64,
    },
}

impl ItemDocument {
    /// The item MHPCO reads this document as describing. Only the type is
    /// fallible -- it must name something on the price list; the rest of the
    /// document records attributes of an item the office already recognises.
    fn read(&self) -> Result<Item, String> {
        let item = Item::new(ItemType::named(&self.item_type)?)
            .made_of(&self.material)
            .with_enchantment(self.enchantment);
        Ok(if self.cursed { item.cursed() } else { item })
    }
}

impl DamageDocument {
    fn read(&self) -> Result<Damage, String> {
        Damage::reported(ItemType::named(&self.item_type)?, self.amount)
    }
}

impl StepDocument {
    fn read(&self) -> Result<Step, String> {
        match self {
            Self::Quote { items } => Ok(Step::Quote {
                items: items.iter().map(ItemDocument::read).collect::<Result<_, _>>()?,
            }),
            Self::Claim { policy, incident } => Ok(Step::Claim {
                policy: *policy,
                damages: incident
                    .damages
                    .iter()
                    .map(DamageDocument::read)
                    .collect::<Result<_, _>>()?,
            }),
        }
    }
}

fn reported(result: StepResult) -> StepResultDocument {
    match result {
        StepResult::Quote { premium } => StepResultDocument::Quote { premium },
        StepResult::Claim {
            payout,
            remaining_cap,
        } => StepResultDocument::Claim {
            payout,
            remaining_cap,
        },
    }
}

/// Reads a scenario document as MHPCO receives it and writes the results
/// document the office answers with.
pub fn settle_scenario_document(document: &str) -> Result<String, String> {
    let document: ScenarioDocument =
        serde_json::from_str(document).map_err(|error| error.to_string())?;
    let scenario = Scenario {
        customer: Customer::with_years(document.customer.years_with_mhpco),
        steps: document
            .steps
            .iter()
            .map(StepDocument::read)
            .collect::<Result<_, _>>()?,
    };
    let results = ResultsDocument {
        results: run(&scenario)?.into_iter().map(reported).collect(),
    };
    serde_json::to_string(&results).map_err(|error| error.to_string())
}
