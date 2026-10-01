//! Translation between the MHPCO's JSON documents and its domain types.

use serde::{Deserialize, Serialize};

use crate::{Customer, Damage, Incident, Item, Scenario, Step, StepResult};

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
    Quote {
        items: Vec<ItemDocument>,
    },
    Claim {
        policy: usize,
        incident: IncidentDocument,
    },
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
    cause: String,
    damages: Vec<DamageDocument>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct DamageDocument {
    item_type: String,
    amount: i64,
}

#[derive(Serialize)]
struct ResultsDocument {
    results: Vec<StepResultDocument>,
}

#[derive(Serialize)]
#[serde(untagged, rename_all = "camelCase")]
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

/// Reads a scenario document as the MHPCO's schema describes it.
pub fn parse_scenario(document: &str) -> Result<Scenario, String> {
    let parsed: ScenarioDocument =
        serde_json::from_str(document).map_err(|error| error.to_string())?;
    Ok(Scenario {
        customer: Customer {
            years_with_mhpco: parsed.customer.years_with_mhpco,
        },
        steps: parsed.steps.into_iter().map(Step::from).collect(),
    })
}

/// Writes the results of a scenario as the MHPCO's schema describes them.
pub fn render_results(results: &[StepResult]) -> String {
    let document = ResultsDocument {
        results: results.iter().map(StepResultDocument::from).collect(),
    };
    serde_json::to_string(&document).expect("the results document is serializable")
}

impl From<StepDocument> for Step {
    fn from(step: StepDocument) -> Self {
        match step {
            StepDocument::Quote { items } => Step::Quote {
                items: items.into_iter().map(Item::from).collect(),
            },
            StepDocument::Claim { policy, incident } => Step::Claim {
                policy,
                incident: Incident::from(incident),
            },
        }
    }
}

impl From<ItemDocument> for Item {
    fn from(item: ItemDocument) -> Self {
        Item {
            item_type: item.item_type,
            cursed: item.cursed,
            enchantment: item.enchantment,
            material: item.material,
        }
    }
}

impl From<IncidentDocument> for Incident {
    fn from(incident: IncidentDocument) -> Self {
        Incident {
            cause: incident.cause,
            damages: incident.damages.into_iter().map(Damage::from).collect(),
        }
    }
}

impl From<DamageDocument> for Damage {
    fn from(damage: DamageDocument) -> Self {
        Damage {
            item_type: damage.item_type,
            amount: damage.amount,
        }
    }
}

impl From<&StepResult> for StepResultDocument {
    fn from(result: &StepResult) -> Self {
        match result {
            StepResult::Quote { premium } => StepResultDocument::Quote { premium: *premium },
            StepResult::Claim {
                payout,
                remaining_cap,
            } => StepResultDocument::Claim {
                payout: *payout,
                remaining_cap: *remaining_cap,
            },
        }
    }
}
