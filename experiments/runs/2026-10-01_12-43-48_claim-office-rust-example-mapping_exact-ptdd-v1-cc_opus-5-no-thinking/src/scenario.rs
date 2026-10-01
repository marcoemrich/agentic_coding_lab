//! Translates the MHPCO's JSON scenario contract into domain operations and
//! back. The domain rules live in the library root; this module only adapts.

use serde::{Deserialize, Serialize};

use crate::{Customer, Damage, Item, PolicyRegister};

#[derive(Deserialize)]
struct ScenarioDocument {
    customer: CustomerDocument,
    steps: Vec<StepDocument>,
}

#[derive(Deserialize)]
struct CustomerDocument {
    #[serde(rename = "yearsWithMHPCO")]
    years_with_mhpco: u32,
}

#[derive(Deserialize)]
#[serde(tag = "op", rename_all = "lowercase")]
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
struct IncidentDocument {
    #[serde(default)]
    #[allow(dead_code, reason = "part of the input contract; no rule reads it")]
    cause: String,
    damages: Vec<DamageDocument>,
}

#[derive(Deserialize)]
struct DamageDocument {
    #[serde(rename = "itemType")]
    item_type: String,
    amount: i64,
}

#[derive(Serialize)]
struct ResultsDocument {
    results: Vec<ResultDocument>,
}

#[derive(Serialize)]
#[serde(untagged)]
enum ResultDocument {
    Quote {
        premium: u32,
    },
    Claim {
        payout: u32,
        #[serde(rename = "remainingCap")]
        remaining_cap: u32,
    },
}

/// Runs one scenario document and renders its results document.
pub fn run_scenario(input: &str) -> Result<String, String> {
    let scenario: ScenarioDocument =
        serde_json::from_str(input).map_err(|error| error.to_string())?;
    let mut policies =
        PolicyRegister::for_customer(Customer::with_years(scenario.customer.years_with_mhpco));
    let mut results = Vec::with_capacity(scenario.steps.len());
    for step in &scenario.steps {
        results.push(run_step(&mut policies, step)?);
    }
    serde_json::to_string(&ResultsDocument { results }).map_err(|error| error.to_string())
}

fn run_step(policies: &mut PolicyRegister, step: &StepDocument) -> Result<ResultDocument, String> {
    match step {
        StepDocument::Quote { items } => {
            let items: Vec<Item> = items.iter().map(insured_item).collect();
            Ok(ResultDocument::Quote {
                premium: policies.try_quote(&items)?,
            })
        }
        StepDocument::Claim { policy, incident } => {
            let damages: Vec<Damage> = incident.damages.iter().map(reported_damage).collect();
            let settlement = policies.claim(*policy, &damages)?;
            Ok(ResultDocument::Claim {
                payout: settlement.payout,
                remaining_cap: settlement.remaining_cap,
            })
        }
    }
}

fn insured_item(document: &ItemDocument) -> Item {
    Item::of_type(&document.item_type)
        .material(&document.material)
        .enchantment(document.enchantment)
        .cursed_if(document.cursed)
}

fn reported_damage(document: &DamageDocument) -> Damage {
    Damage::to(&document.item_type, document.amount)
}
