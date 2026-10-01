//! CLI adapter for the MHPCO claim office: JSON on stdin, JSON on stdout.
//!
//! The domain rules live in the library; this binary only translates between
//! the published JSON contract and the library's types.

use std::io::{self, Read, Write};
use std::process::ExitCode;

use kata::{Customer, Damage, Incident, Item, Scenario, Step, StepResult, run_scenario};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct ScenarioJson {
    customer: CustomerJson,
    steps: Vec<StepJson>,
}

#[derive(Deserialize)]
struct CustomerJson {
    #[serde(rename = "yearsWithMHPCO")]
    years_with_mhpco: i64,
}

#[derive(Deserialize)]
#[serde(tag = "op", rename_all = "lowercase")]
enum StepJson {
    Quote {
        items: Vec<ItemJson>,
    },
    Claim {
        policy: usize,
        incident: IncidentJson,
    },
}

#[derive(Deserialize)]
struct ItemJson {
    #[serde(rename = "type")]
    item_type: String,
    #[serde(default)]
    material: Option<String>,
    #[serde(default)]
    enchantment: Option<i64>,
    #[serde(default)]
    cursed: bool,
}

#[derive(Deserialize)]
struct IncidentJson {
    cause: String,
    damages: Vec<DamageJson>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct DamageJson {
    item_type: String,
    amount: i64,
}

#[derive(Serialize)]
struct ResultsJson {
    results: Vec<StepResultJson>,
}

#[derive(Serialize)]
#[serde(untagged, rename_all = "camelCase")]
enum StepResultJson {
    Quote {
        premium: i64,
    },
    Claim {
        payout: i64,
        #[serde(rename = "remainingCap")]
        remaining_cap: i64,
    },
}

impl From<ScenarioJson> for Scenario {
    fn from(scenario: ScenarioJson) -> Self {
        Scenario {
            customer: Customer {
                years_with_mhpco: scenario.customer.years_with_mhpco,
            },
            steps: scenario.steps.into_iter().map(Step::from).collect(),
        }
    }
}

impl From<StepJson> for Step {
    fn from(step: StepJson) -> Self {
        match step {
            StepJson::Quote { items } => Step::Quote {
                items: items.into_iter().map(Item::from).collect(),
            },
            StepJson::Claim { policy, incident } => Step::Claim {
                policy,
                incident: Incident {
                    cause: incident.cause,
                    damages: incident
                        .damages
                        .into_iter()
                        .map(|damage| Damage {
                            item_type: damage.item_type,
                            amount: damage.amount,
                        })
                        .collect(),
                },
            },
        }
    }
}

impl From<ItemJson> for Item {
    fn from(item: ItemJson) -> Self {
        Item {
            item_type: item.item_type,
            cursed: item.cursed,
            enchantment: item.enchantment,
            material: item.material,
        }
    }
}

impl From<&StepResult> for StepResultJson {
    fn from(result: &StepResult) -> Self {
        match *result {
            StepResult::Quote { premium } => StepResultJson::Quote { premium },
            StepResult::Claim {
                payout,
                remaining_cap,
            } => StepResultJson::Claim {
                payout,
                remaining_cap,
            },
        }
    }
}

fn settle_from_stdin() -> Result<String, String> {
    let mut input = String::new();
    io::stdin()
        .read_to_string(&mut input)
        .map_err(|error| format!("cannot read stdin: {error}"))?;
    let scenario: ScenarioJson =
        serde_json::from_str(&input).map_err(|error| format!("invalid scenario: {error}"))?;

    let results = run_scenario(&Scenario::from(scenario))?;

    let results = ResultsJson {
        results: results.iter().map(StepResultJson::from).collect(),
    };
    serde_json::to_string(&results).map_err(|error| format!("cannot write results: {error}"))
}

fn main() -> ExitCode {
    match settle_from_stdin() {
        Ok(results) => {
            println!("{results}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            let _ = writeln!(io::stderr(), "{error}");
            ExitCode::FAILURE
        }
    }
}
