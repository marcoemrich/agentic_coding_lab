//! Translation between the scenario document and the claims office.

use serde::{Deserialize, Serialize};

use crate::{Customer, Damage, Item, ItemType, Material, MhpcoError, Policy, quote};

#[derive(Deserialize)]
pub struct Scenario {
    customer: CustomerDocument,
    steps: Vec<Step>,
}

#[derive(Deserialize)]
struct CustomerDocument {
    #[serde(rename = "yearsWithMHPCO")]
    years_with_mhpco: i64,
}

#[derive(Deserialize)]
#[serde(tag = "op", rename_all = "camelCase")]
enum Step {
    Quote { items: Vec<ItemDocument> },
    Claim { policy: usize, incident: Incident },
}

#[derive(Deserialize)]
struct ItemDocument {
    #[serde(rename = "type")]
    item_type: String,
    material: Option<String>,
    enchantment: Option<i64>,
    cursed: Option<bool>,
}

#[derive(Deserialize)]
struct Incident {
    #[serde(rename = "cause")]
    _cause: String,
    damages: Vec<DamageDocument>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct DamageDocument {
    item_type: String,
    amount: i64,
}

#[derive(Serialize)]
struct Results {
    results: Vec<StepResult>,
}

#[derive(Serialize)]
#[serde(untagged)]
enum StepResult {
    Quote { premium: i64 },
    #[serde(rename_all = "camelCase")]
    Claim { payout: i64, remaining_cap: i64 },
}

/// Read a scenario document, process its steps in order, and write the results.
pub fn run_scenario(document: &str) -> Result<String, MhpcoError> {
    let scenario: Scenario = serde_json::from_str(document)
        .map_err(|error| MhpcoError(format!("the scenario is unreadable: {error}")))?;
    let customer = Customer {
        years_with_mhpco: scenario.customer.years_with_mhpco,
        contracts_so_far: 0,
    };
    let results = process(customer, &scenario.steps)?;
    serde_json::to_string(&Results { results })
        .map_err(|error| MhpcoError(format!("the results are unwritable: {error}")))
}

fn process(mut customer: Customer, steps: &[Step]) -> Result<Vec<StepResult>, MhpcoError> {
    let mut results = Vec::with_capacity(steps.len());
    let mut policies: Vec<Option<Policy>> = Vec::with_capacity(steps.len());
    for step in steps {
        match step {
            Step::Quote { items } => {
                let items = insured_items(items)?;
                results.push(StepResult::Quote { premium: quote(&customer, &items) });
                policies.push(Some(Policy::covering(&items)));
                customer.contracts_so_far += 1;
            }
            Step::Claim { policy, incident } => {
                let damages = reported_damages(&incident.damages)?;
                let policy = policies
                    .get_mut(*policy)
                    .and_then(Option::as_mut)
                    .ok_or_else(|| MhpcoError("the claim names no issued policy".into()))?;
                let settlement = policy.settle(&damages)?;
                results.push(StepResult::Claim {
                    payout: settlement.payout,
                    remaining_cap: settlement.remaining_cap,
                });
                policies.push(None);
            }
        }
    }
    Ok(results)
}

fn insured_items(documents: &[ItemDocument]) -> Result<Vec<Item>, MhpcoError> {
    documents.iter().map(insured_item).collect()
}

fn insured_item(document: &ItemDocument) -> Result<Item, MhpcoError> {
    Ok(Item {
        item_type: ItemType::from_name(&document.item_type)?,
        material: Material::from_name(document.material.as_deref()),
        enchantment: document.enchantment.unwrap_or(0),
        cursed: document.cursed.unwrap_or(false),
    })
}

fn reported_damages(documents: &[DamageDocument]) -> Result<Vec<Damage>, MhpcoError> {
    documents
        .iter()
        .map(|document| {
            Ok(Damage {
                item_type: ItemType::from_name(&document.item_type)?,
                amount: document.amount,
            })
        })
        .collect()
}
