//! The scenario runner: the JSON input/output shapes of the CLI and the
//! sequential processing of the steps.

use crate::claim::{ClaimError, Damage, Policy};
use crate::item::Kind;
use crate::premium::{quote_premium, Customer, Item};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Deserialize)]
pub struct Scenario {
    pub customer: CustomerInput,
    pub steps: Vec<Step>,
}

#[derive(Debug, Deserialize)]
pub struct CustomerInput {
    #[serde(rename = "yearsWithMHPCO")]
    pub years_with_mhpco: i64,
}

#[derive(Debug, Deserialize)]
#[serde(tag = "op", rename_all = "lowercase")]
pub enum Step {
    Quote { items: Vec<ItemInput> },
    Claim { policy: usize, incident: Incident },
}

#[derive(Debug, Deserialize)]
pub struct ItemInput {
    #[serde(rename = "type")]
    pub type_name: String,
    pub material: Option<String>,
    pub enchantment: Option<i64>,
    #[serde(default)]
    pub cursed: bool,
}

#[derive(Debug, Deserialize)]
pub struct Incident {
    #[allow(dead_code)]
    pub cause: String,
    pub damages: Vec<DamageInput>,
}

#[derive(Debug, Deserialize)]
pub struct DamageInput {
    #[serde(rename = "itemType")]
    pub item_type: String,
    pub amount: i64,
}

/// One entry of the `results` array. A quote yields a premium, a claim a
/// payout plus the cap remaining on its policy.
#[derive(Debug, Serialize, PartialEq, Eq)]
#[serde(untagged)]
pub enum StepResult {
    Quote {
        premium: i64,
    },
    Claim {
        payout: i64,
        #[serde(rename = "remainingCap")]
        remaining_cap: i64,
    },
}

#[derive(Debug, Serialize)]
pub struct Output {
    pub results: Vec<StepResult>,
}

/// A scenario the MHPCO refuses to process.
#[derive(Debug)]
pub enum ScenarioError {
    UnknownItemType(String),
    UnknownPolicy(usize),
    Claim(ClaimError),
}

impl std::fmt::Display for ScenarioError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::UnknownItemType(name) => {
                write!(f, "item type '{name}' is not covered by the MHPCO")
            }
            Self::UnknownPolicy(index) => {
                write!(f, "step {index} did not create a policy")
            }
            Self::Claim(error) => write!(f, "{error}"),
        }
    }
}

fn to_item(input: &ItemInput) -> Result<Item, ScenarioError> {
    let kind = Kind::parse(&input.type_name)
        .ok_or_else(|| ScenarioError::UnknownItemType(input.type_name.clone()))?;
    Ok(Item {
        kind,
        material: input.material.clone(),
        enchantment: input.enchantment,
        cursed: input.cursed,
    })
}

/// Runs all steps in order. A later claim refers to the policy created by an
/// earlier quote step via that step's zero-based index.
pub fn run(scenario: &Scenario) -> Result<Output, ScenarioError> {
    let customer = Customer { years_with_mhpco: scenario.customer.years_with_mhpco };
    let mut policies: HashMap<usize, Policy> = HashMap::new();
    let mut quotes_so_far = 0;
    let mut results = Vec::with_capacity(scenario.steps.len());

    for (index, step) in scenario.steps.iter().enumerate() {
        let result = match step {
            Step::Quote { items } => {
                let items: Vec<Item> = items.iter().map(to_item).collect::<Result<_, _>>()?;
                let premium = quote_premium(&items, customer, quotes_so_far > 0);
                quotes_so_far += 1;
                policies.insert(index, Policy::new(items));
                StepResult::Quote { premium }
            }
            Step::Claim { policy, incident } => {
                let target = policies
                    .get_mut(policy)
                    .ok_or(ScenarioError::UnknownPolicy(*policy))?;
                process_claim(target, incident)?
            }
        };
        results.push(result);
    }
    Ok(Output { results })
}

fn process_claim(policy: &mut Policy, incident: &Incident) -> Result<StepResult, ScenarioError> {
    let damages: Vec<Damage> = incident
        .damages
        .iter()
        .map(|damage| Damage {
            item_type: damage.item_type.clone(),
            amount: damage.amount,
        })
        .collect();
    let claim = policy.process(&damages).map_err(ScenarioError::Claim)?;
    Ok(StepResult::Claim {
        payout: claim.payout,
        remaining_cap: claim.remaining_cap,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn run_json(input: &str) -> Result<Vec<StepResult>, ScenarioError> {
        let scenario: Scenario = serde_json::from_str(input).expect("valid input");
        run(&scenario).map(|output| output.results)
    }

    #[test]
    fn quote_then_claim_follows_the_schema_example() {
        let results = run_json(
            r#"{
                "customer": {"yearsWithMHPCO": 5},
                "steps": [
                    {"op": "quote", "items": [
                        {"type": "amulet", "material": "silver",
                         "enchantment": 2, "cursed": false}]},
                    {"op": "claim", "policy": 0, "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "amulet", "amount": 200}]}}
                ]
            }"#,
        )
        .expect("valid scenario");

        // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59.
        assert_eq!(results[0], StepResult::Quote { premium: 59 });
        // 200 damage - 100 deductible; cap 1200 - 100.
        assert_eq!(results[1], StepResult::Claim { payout: 100, remaining_cap: 1100 });
    }

    #[test]
    fn the_second_quote_in_a_scenario_is_a_follow_up_contract() {
        let results = run_json(
            r#"{
                "customer": {"yearsWithMHPCO": 3},
                "steps": [
                    {"op": "quote", "items": [
                        {"type": "sword", "material": "steel",
                         "enchantment": 3, "cursed": false}]},
                    {"op": "quote", "items": [
                        {"type": "sword", "material": "steel",
                         "enchantment": 7, "cursed": true}]}
                ]
            }"#,
        )
        .expect("valid scenario");

        assert_eq!(results[1], StepResult::Quote { premium: 160 });
    }

    #[test]
    fn an_unknown_item_type_in_a_quote_fails_the_scenario() {
        let error = run_json(
            r#"{"customer": {"yearsWithMHPCO": 1},
                "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}"#,
        )
        .expect_err("broomstick is not covered");
        assert!(error.to_string().contains("broomstick"), "{error}");
    }

    #[test]
    fn a_claim_against_an_uninsured_item_fails_the_scenario() {
        let error = run_json(
            r#"{"customer": {"yearsWithMHPCO": 1},
                "steps": [
                    {"op": "quote", "items": [{"type": "sword"}]},
                    {"op": "claim", "policy": 0, "incident": {
                        "cause": "dragon",
                        "damages": [{"itemType": "amulet", "amount": 200}]}}]}"#,
        )
        .expect_err("amulet is not insured");
        assert!(error.to_string().contains("amulet"), "{error}");
    }

    #[test]
    fn items_may_omit_material_and_enchantment() {
        let results = run_json(
            r#"{"customer": {"yearsWithMHPCO": 0},
                "steps": [{"op": "quote", "items": [
                    {"type": "rune"}, {"type": "rune"}, {"type": "rune"}]}]}"#,
        )
        .expect("valid scenario");
        // 60 block + 6 first insurance + 5 fee = 71.
        assert_eq!(results[0], StepResult::Quote { premium: 71 });
    }
}
