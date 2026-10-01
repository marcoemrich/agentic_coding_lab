//! Sequencing of a scenario's steps: quotes open policies, claims draw on them.

use serde::{Deserialize, Serialize};

use crate::claim::{ClaimError, Incident, Policy};
use crate::item::Item;
use crate::quote::{self, Customer, UnknownItemType};

/// The customer a scenario is about.
#[derive(Debug, Deserialize)]
pub struct CustomerInput {
    #[serde(rename = "yearsWithMHPCO")]
    pub years_with_mhpco: i64,
}

/// One step of a scenario.
#[derive(Debug, Deserialize)]
#[serde(tag = "op")]
pub enum Step {
    #[serde(rename = "quote")]
    Quote { items: Vec<Item> },
    #[serde(rename = "claim")]
    Claim { policy: usize, incident: Incident },
}

/// A whole scenario read from stdin.
#[derive(Debug, Deserialize)]
pub struct Scenario {
    pub customer: CustomerInput,
    pub steps: Vec<Step>,
}

/// One step's result, shaped for the output schema.
#[derive(Debug, Serialize)]
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

/// The output document.
#[derive(Debug, Serialize)]
pub struct Output {
    pub results: Vec<StepResult>,
}

/// Anything that makes the MHPCO reject a scenario outright.
#[derive(Debug)]
pub enum ScenarioError {
    UnknownItemType(String),
    Claim(ClaimError),
    /// A claim naming a step that is not a quote, or is out of range.
    NoSuchPolicy(usize),
}

impl std::fmt::Display for ScenarioError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ScenarioError::UnknownItemType(t) => {
                write!(f, "the MHPCO does not insure items of type '{t}'")
            }
            ScenarioError::NoSuchPolicy(i) => {
                write!(f, "step {i} did not create a policy")
            }
            ScenarioError::Claim(ClaimError::NotCovered(t)) => {
                write!(f, "the policy does not cover an item of type '{t}'")
            }
            ScenarioError::Claim(ClaimError::MoreDamagesThanInsured(t)) => {
                write!(f, "more '{t}' damages reported than the policy insures")
            }
            ScenarioError::Claim(ClaimError::NegativeAmount(a)) => {
                write!(f, "a damage amount of {a} G is not a damage")
            }
        }
    }
}

impl From<UnknownItemType> for ScenarioError {
    fn from(e: UnknownItemType) -> Self {
        ScenarioError::UnknownItemType(e.0)
    }
}

impl From<ClaimError> for ScenarioError {
    fn from(e: ClaimError) -> Self {
        ScenarioError::Claim(e)
    }
}

/// Runs every step in order, in the MHPCO's venerable sequence.
pub fn run(scenario: &Scenario) -> Result<Output, ScenarioError> {
    let mut results = Vec::with_capacity(scenario.steps.len());
    // A policy per step index, so a claim can find the quote step it names.
    let mut policies: Vec<Option<Policy>> = Vec::with_capacity(scenario.steps.len());
    let mut contracts = 0;

    for step in &scenario.steps {
        let result = match step {
            Step::Quote { items } => {
                let quoted = open_policy(items, scenario.customer.years_with_mhpco, contracts)?;
                contracts += 1;
                policies.push(Some(quoted.policy));
                StepResult::Quote {
                    premium: quoted.premium,
                }
            }
            Step::Claim { policy, incident } => {
                policies.push(None);
                settle(&mut policies, *policy, incident)?
            }
        };
        results.push(result);
    }

    Ok(Output { results })
}

/// A freshly quoted policy and the premium the customer owes for it.
struct Quoted {
    premium: i64,
    policy: Policy,
}

/// Prices `items` for this customer and opens the matching policy.
fn open_policy(
    items: &[Item],
    years_with_mhpco: i64,
    previous_contracts: i64,
) -> Result<Quoted, ScenarioError> {
    let customer = Customer {
        years_with_mhpco,
        previous_contracts,
    };
    let premium = quote::premium(items, &customer)?;
    let sum = quote::insurance_sum(items)?;
    Ok(Quoted {
        premium,
        policy: Policy::new(items.to_vec(), sum),
    })
}

/// Settles `incident` against the policy opened at step `policy`.
fn settle(
    policies: &mut [Option<Policy>],
    policy: usize,
    incident: &Incident,
) -> Result<StepResult, ScenarioError> {
    let open = policies
        .get_mut(policy)
        .and_then(Option::as_mut)
        .ok_or(ScenarioError::NoSuchPolicy(policy))?;
    let payout = open.settle(incident)?;
    Ok(StepResult::Claim {
        payout,
        remaining_cap: open.remaining_cap,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn run_json(json: &str) -> Result<Vec<StepResult>, ScenarioError> {
        let scenario: Scenario = serde_json::from_str(json).expect("scenario parses");
        run(&scenario).map(|o| o.results)
    }

    fn premiums(results: &[StepResult]) -> Vec<i64> {
        results
            .iter()
            .map(|r| match r {
                StepResult::Quote { premium } => *premium,
                StepResult::Claim { payout, .. } => *payout,
            })
            .collect()
    }

    #[test]
    fn a_quote_step_yields_a_premium() {
        let results = run_json(
            r#"{"customer":{"yearsWithMHPCO":0},
                "steps":[{"op":"quote","items":[
                    {"type":"sword","material":"steel","enchantment":3,"cursed":true}]}]}"#,
        )
        .expect("valid scenario");
        assert_eq!(premiums(&results), vec![165]);
    }

    #[test]
    fn a_second_quote_earns_the_follow_up_discount() {
        let results = run_json(
            r#"{"customer":{"yearsWithMHPCO":3},
                "steps":[
                  {"op":"quote","items":[{"type":"sword","enchantment":7,"cursed":true}]},
                  {"op":"quote","items":[{"type":"sword","enchantment":7,"cursed":true}]}]}"#,
        )
        .expect("valid scenario");
        // First contract: 100 + 50 + 30 - 20 + 10 + 5 = 175. Second: 160.
        assert_eq!(premiums(&results), vec![175, 160]);
    }

    #[test]
    fn a_claim_draws_on_the_policy_from_its_quote_step() {
        let results = run_json(
            r#"{"customer":{"yearsWithMHPCO":5},
                "steps":[
                  {"op":"quote","items":[{"type":"amulet","material":"silver","enchantment":2}]},
                  {"op":"claim","policy":0,
                   "incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}]}"#,
        )
        .expect("valid scenario");
        match results[1] {
            StepResult::Claim {
                payout,
                remaining_cap,
            } => assert_eq!((payout, remaining_cap), (100, 1100)),
            _ => panic!("expected a claim result"),
        }
    }

    #[test]
    fn successive_claims_against_one_policy_share_its_cap() {
        let results = run_json(
            r#"{"customer":{"yearsWithMHPCO":0},
                "steps":[
                  {"op":"quote","items":[{"type":"sword","enchantment":3}]},
                  {"op":"claim","policy":0,
                   "incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}},
                  {"op":"claim","policy":0,
                   "incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}}]}"#,
        )
        .expect("valid scenario");
        let caps: Vec<(i64, i64)> = results[1..]
            .iter()
            .map(|r| match r {
                StepResult::Claim {
                    payout,
                    remaining_cap,
                } => (*payout, *remaining_cap),
                _ => panic!("expected claim results"),
            })
            .collect();
        assert_eq!(caps, vec![(1400, 600), (600, 0)]);
    }

    #[test]
    fn an_unknown_item_type_sinks_the_scenario() {
        let failure = run_json(
            r#"{"customer":{"yearsWithMHPCO":0},
                "steps":[{"op":"quote","items":[{"type":"broomstick"}]}]}"#,
        );
        assert!(failure.is_err());
    }

    #[test]
    fn a_claim_against_a_missing_policy_sinks_the_scenario() {
        let failure = run_json(
            r#"{"customer":{"yearsWithMHPCO":0},
                "steps":[{"op":"claim","policy":7,
                  "incident":{"cause":"fire","damages":[{"itemType":"sword","amount":200}]}}]}"#,
        );
        assert!(failure.is_err());
    }

    #[test]
    fn an_empty_quote_costs_only_the_processing_fee() {
        let results = run_json(
            r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[]}]}"#,
        )
        .expect("valid scenario");
        assert_eq!(premiums(&results), vec![5]);
    }
}
