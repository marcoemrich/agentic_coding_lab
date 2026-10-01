//! Runs a scenario: a sequence of quote and claim steps for one customer.

use crate::claim::{ClaimError, Incident, Policy};
use crate::quote::{self, CustomerContext, Item, UnknownItemType};

/// One step of a scenario.
#[derive(Debug, Clone)]
pub enum Step {
    Quote { items: Vec<Item> },
    Claim { policy: usize, incident: Incident },
}

/// The result of one step.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum StepResult {
    Quote { premium: i64 },
    Claim { payout: i64, remaining_cap: i64 },
}

/// A scenario the MHPCO is asked to process.
#[derive(Debug, Clone)]
pub struct Scenario {
    pub years_with_mhpco: i64,
    pub steps: Vec<Step>,
}

/// Why the MHPCO rejects a whole scenario.
#[derive(Debug, PartialEq, Eq)]
pub enum ScenarioError {
    UnknownItemType(String),
    Claim(ClaimError),
    /// A claim step naming a step index that is not an earlier quote.
    NoSuchPolicy(usize),
}

impl std::fmt::Display for ScenarioError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ScenarioError::UnknownItemType(item_type) => {
                write!(f, "the MHPCO does not insure items of type '{item_type}'")
            }
            ScenarioError::Claim(ClaimError::NotCovered(item_type)) => {
                write!(f, "the policy does not cover a damaged '{item_type}'")
            }
            ScenarioError::Claim(ClaimError::NegativeAmount(amount)) => {
                write!(f, "a damage amount may not be negative, got {amount}")
            }
            ScenarioError::NoSuchPolicy(index) => {
                write!(f, "step {index} did not create a policy")
            }
        }
    }
}

impl From<UnknownItemType> for ScenarioError {
    fn from(error: UnknownItemType) -> ScenarioError {
        ScenarioError::UnknownItemType(error.0)
    }
}

/// Processes every step in order, returning one result per step.
pub fn run(scenario: &Scenario) -> Result<Vec<StepResult>, ScenarioError> {
    let mut results = Vec::with_capacity(scenario.steps.len());
    // Policies by the index of the quote step that created them.
    let mut policies: Vec<Option<Policy>> = Vec::with_capacity(scenario.steps.len());
    let mut quotes_so_far = 0;

    for step in &scenario.steps {
        match step {
            Step::Quote { items } => {
                let customer = CustomerContext {
                    years_with_mhpco: scenario.years_with_mhpco,
                    has_previous_contract: quotes_so_far > 0,
                };
                let premium = quote::premium(items, customer)?;
                let insurance_sum = quote::insurance_sum(items)?;
                quotes_so_far += 1;
                policies.push(Some(Policy::new(items.clone(), insurance_sum)));
                results.push(StepResult::Quote { premium });
            }
            Step::Claim { policy: index, incident } => {
                let policy = policies
                    .get_mut(*index)
                    .and_then(Option::as_mut)
                    .ok_or(ScenarioError::NoSuchPolicy(*index))?;
                let payout = policy.process(incident).map_err(ScenarioError::Claim)?;
                let remaining_cap = policy.remaining_cap();
                policies.push(None);
                results.push(StepResult::Claim { payout, remaining_cap });
            }
        }
    }
    Ok(results)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::claim::Damage;

    fn sword() -> Item {
        Item {
            item_type: "sword".to_string(),
            material: Some("steel".to_string()),
            enchantment: Some(3),
            cursed: false,
        }
    }

    fn claim_of(policy: usize, item_type: &str, amount: i64) -> Step {
        Step::Claim {
            policy,
            incident: Incident {
                cause: "fire".to_string(),
                damages: vec![Damage { item_type: item_type.to_string(), amount }],
            },
        }
    }

    #[test]
    fn a_quote_then_a_claim_against_it_yields_both_results() {
        let scenario = Scenario {
            years_with_mhpco: 5,
            steps: vec![
                Step::Quote { items: vec![sword()] },
                claim_of(0, "sword", 500),
            ],
        };
        assert_eq!(
            run(&scenario).unwrap(),
            vec![
                // 100 base − 20 loyalty + 10 first insurance + 5 fee
                StepResult::Quote { premium: 95 },
                StepResult::Claim { payout: 400, remaining_cap: 1600 },
            ]
        );
    }

    #[test]
    fn the_second_quote_in_a_scenario_earns_the_follow_up_discount() {
        let scenario = Scenario {
            years_with_mhpco: 0,
            steps: vec![
                Step::Quote { items: vec![sword()] },
                Step::Quote { items: vec![sword()] },
            ],
        };
        assert_eq!(
            run(&scenario).unwrap(),
            vec![
                // 100 base + 10 first insurance + 5 fee
                StepResult::Quote { premium: 115 },
                // ... minus the 15 follow-up discount
                StepResult::Quote { premium: 100 },
            ]
        );
    }

    #[test]
    fn claims_share_the_cap_of_the_policy_they_name() {
        let scenario = Scenario {
            years_with_mhpco: 0,
            steps: vec![
                Step::Quote { items: vec![sword()] },
                claim_of(0, "sword", 1500),
                claim_of(0, "sword", 1500),
            ],
        };
        assert_eq!(
            run(&scenario).unwrap()[1..],
            [
                StepResult::Claim { payout: 1400, remaining_cap: 600 },
                StepResult::Claim { payout: 600, remaining_cap: 0 },
            ]
        );
    }

    #[test]
    fn an_unknown_item_type_rejects_the_scenario() {
        let scenario = Scenario {
            years_with_mhpco: 0,
            steps: vec![Step::Quote {
                items: vec![Item {
                    item_type: "broomstick".to_string(),
                    material: None,
                    enchantment: None,
                    cursed: false,
                }],
            }],
        };
        assert_eq!(
            run(&scenario),
            Err(ScenarioError::UnknownItemType("broomstick".to_string()))
        );
    }

    #[test]
    fn a_claim_against_a_step_that_is_not_a_quote_rejects_the_scenario() {
        let scenario = Scenario {
            years_with_mhpco: 0,
            steps: vec![
                Step::Quote { items: vec![sword()] },
                claim_of(0, "sword", 200),
                claim_of(1, "sword", 200),
            ],
        };
        assert_eq!(run(&scenario), Err(ScenarioError::NoSuchPolicy(1)));
    }

    #[test]
    fn a_claim_naming_a_later_step_rejects_the_scenario() {
        let scenario = Scenario {
            years_with_mhpco: 0,
            steps: vec![claim_of(1, "sword", 200), Step::Quote { items: vec![sword()] }],
        };
        assert_eq!(run(&scenario), Err(ScenarioError::NoSuchPolicy(1)));
    }

    #[test]
    fn a_damage_outside_the_policy_rejects_the_scenario() {
        let scenario = Scenario {
            years_with_mhpco: 0,
            steps: vec![Step::Quote { items: vec![sword()] }, claim_of(0, "amulet", 200)],
        };
        assert_eq!(
            run(&scenario),
            Err(ScenarioError::Claim(ClaimError::NotCovered("amulet".to_string())))
        );
    }
}
