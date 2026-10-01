//! The scenario runner: parses the stdin document, processes the steps in
//! order and renders the results document.

use serde::{Deserialize, Serialize};

use crate::claim::{self, Damage, Incident, OpenPolicy};
use crate::policy::{Item, Policy};
use crate::premium::{Customer, quote_premium};

/// Anything that stops the MHPCO from processing a scenario.
#[derive(Debug)]
pub enum ScenarioError {
    /// The stdin document is not a scenario.
    Malformed(serde_json::Error),
    /// A quote covers an item the price list does not know.
    UnknownItemType(String),
    /// A claim refers to a step that did not create a policy.
    NoSuchPolicy(usize),
    /// A claim cannot be settled against its policy.
    Claim(claim::ClaimError),
}

impl std::fmt::Display for ScenarioError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Malformed(error) => write!(f, "malformed scenario: {error}"),
            Self::UnknownItemType(item_type) => {
                write!(f, "unknown item type '{item_type}'")
            }
            Self::NoSuchPolicy(index) => {
                write!(f, "step {index} did not create a policy")
            }
            Self::Claim(error) => write!(f, "{error}"),
        }
    }
}

/// Runs a scenario given as a JSON document, returning the JSON results.
pub fn run_json(input: &str) -> Result<String, ScenarioError> {
    let scenario: ScenarioDoc = serde_json::from_str(input).map_err(ScenarioError::Malformed)?;
    let results = run(&scenario)?;
    serde_json::to_string(&ResultsDoc { results }).map_err(ScenarioError::Malformed)
}

/// Processes the steps in order, carrying customer history and open policies.
fn run(scenario: &ScenarioDoc) -> Result<Vec<StepResult>, ScenarioError> {
    let mut state = ScenarioState::new(scenario.customer.years_with_mhpco);
    scenario
        .steps
        .iter()
        .enumerate()
        .map(|(index, step)| state.process(index, step))
        .collect()
}

/// What the scenario accumulates as its steps are processed.
struct ScenarioState {
    years_with_mhpco: i64,
    contracts_so_far: u64,
    /// Open policies by the index of the quote step that created them.
    policies: Vec<Option<OpenPolicy>>,
}

impl ScenarioState {
    fn new(years_with_mhpco: i64) -> Self {
        Self {
            years_with_mhpco,
            contracts_so_far: 0,
            policies: Vec::new(),
        }
    }

    /// Processes one step, recording the policy a quote creates.
    fn process(&mut self, index: usize, step: &Step) -> Result<StepResult, ScenarioError> {
        self.policies.resize(index + 1, None);
        match step {
            Step::Quote { items } => self.quote(index, items),
            Step::Claim { policy, incident } => self.claim(*policy, incident),
        }
    }

    /// Quotes a policy and keeps it in force for later claims.
    fn quote(&mut self, index: usize, items: &[ItemDoc]) -> Result<StepResult, ScenarioError> {
        let items: Vec<Item> = items.iter().map(ItemDoc::to_item).collect();
        let policy =
            Policy::new(&items).map_err(|error| ScenarioError::UnknownItemType(error.0))?;

        let customer = Customer {
            years_with_mhpco: self.years_with_mhpco,
            previous_contracts: self.contracts_so_far,
        };
        let premium = quote_premium(&policy, &customer);

        self.contracts_so_far += 1;
        self.policies[index] = Some(OpenPolicy::new(policy));
        Ok(StepResult::Quote { premium })
    }

    /// Settles a claim against the policy a previous quote step created.
    fn claim(&mut self, index: usize, incident: &IncidentDoc) -> Result<StepResult, ScenarioError> {
        let policy = self
            .policies
            .get_mut(index)
            .and_then(Option::as_mut)
            .ok_or(ScenarioError::NoSuchPolicy(index))?;

        let settlement =
            claim::settle(policy, &incident.to_incident()).map_err(ScenarioError::Claim)?;
        Ok(StepResult::Claim {
            payout: settlement.payout,
            remaining_cap: settlement.remaining_cap,
        })
    }
}

#[derive(Debug, Deserialize)]
struct ScenarioDoc {
    customer: CustomerDoc,
    steps: Vec<Step>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CustomerDoc {
    #[serde(rename = "yearsWithMHPCO")]
    years_with_mhpco: i64,
}

#[derive(Debug, Deserialize)]
#[serde(tag = "op", rename_all = "lowercase")]
enum Step {
    Quote {
        items: Vec<ItemDoc>,
    },
    Claim {
        policy: usize,
        incident: IncidentDoc,
    },
}

#[derive(Debug, Deserialize)]
struct ItemDoc {
    #[serde(rename = "type")]
    item_type: String,
    material: Option<String>,
    enchantment: Option<i64>,
    #[serde(default)]
    cursed: bool,
}

impl ItemDoc {
    fn to_item(&self) -> Item {
        Item {
            item_type: self.item_type.clone(),
            material: self.material.clone(),
            enchantment: self.enchantment,
            cursed: self.cursed,
        }
    }
}

#[derive(Debug, Deserialize)]
struct IncidentDoc {
    cause: String,
    damages: Vec<DamageDoc>,
}

impl IncidentDoc {
    fn to_incident(&self) -> Incident {
        Incident {
            cause: self.cause.clone(),
            damages: self
                .damages
                .iter()
                .map(|damage| Damage {
                    item_type: damage.item_type.clone(),
                    amount: damage.amount,
                })
                .collect(),
        }
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DamageDoc {
    item_type: String,
    amount: i64,
}

#[derive(Debug, Serialize)]
struct ResultsDoc {
    results: Vec<StepResult>,
}

#[derive(Debug, Serialize)]
#[serde(untagged, rename_all = "camelCase")]
enum StepResult {
    Quote {
        premium: i128,
    },
    #[serde(rename_all = "camelCase")]
    Claim {
        payout: i128,
        remaining_cap: i128,
    },
}
