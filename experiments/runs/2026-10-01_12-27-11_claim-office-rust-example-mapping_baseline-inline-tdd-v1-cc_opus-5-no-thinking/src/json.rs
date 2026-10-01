//! The CLI's JSON wire format, translated to and from the domain types.

use serde::{Deserialize, Serialize};

use crate::claim::{Damage, Incident};
use crate::quote::Item;
use crate::scenario::{Scenario, Step, StepResult};

#[derive(Debug, Deserialize)]
struct ScenarioJson {
    customer: CustomerJson,
    steps: Vec<StepJson>,
}

#[derive(Debug, Deserialize)]
struct CustomerJson {
    // camelCase would mangle the acronym into `yearsWithMhpco`.
    #[serde(rename = "yearsWithMHPCO")]
    years_with_mhpco: i64,
}

#[derive(Debug, Deserialize)]
#[serde(tag = "op", rename_all = "lowercase")]
enum StepJson {
    Quote { items: Vec<ItemJson> },
    Claim { policy: usize, incident: IncidentJson },
}

#[derive(Debug, Deserialize)]
struct ItemJson {
    #[serde(rename = "type")]
    item_type: String,
    material: Option<String>,
    enchantment: Option<i64>,
    #[serde(default)]
    cursed: bool,
}

#[derive(Debug, Deserialize)]
struct IncidentJson {
    cause: String,
    damages: Vec<DamageJson>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DamageJson {
    item_type: String,
    amount: i64,
}

#[derive(Debug, Serialize)]
struct ResultsJson {
    results: Vec<StepResultJson>,
}

#[derive(Debug, Serialize)]
#[serde(untagged)]
enum StepResultJson {
    Quote { premium: i64 },
    Claim {
        payout: i64,
        #[serde(rename = "remainingCap")]
        remaining_cap: i64,
    },
}

impl From<ItemJson> for Item {
    fn from(json: ItemJson) -> Item {
        Item {
            item_type: json.item_type,
            material: json.material,
            enchantment: json.enchantment,
            cursed: json.cursed,
        }
    }
}

impl From<IncidentJson> for Incident {
    fn from(json: IncidentJson) -> Incident {
        Incident {
            cause: json.cause,
            damages: json
                .damages
                .into_iter()
                .map(|damage| Damage { item_type: damage.item_type, amount: damage.amount })
                .collect(),
        }
    }
}

impl From<StepJson> for Step {
    fn from(json: StepJson) -> Step {
        match json {
            StepJson::Quote { items } => {
                Step::Quote { items: items.into_iter().map(Item::from).collect() }
            }
            StepJson::Claim { policy, incident } => {
                Step::Claim { policy, incident: incident.into() }
            }
        }
    }
}

/// Parses a scenario from the CLI's stdin document.
pub fn parse_scenario(input: &str) -> Result<Scenario, serde_json::Error> {
    let json: ScenarioJson = serde_json::from_str(input)?;
    Ok(Scenario {
        years_with_mhpco: json.customer.years_with_mhpco,
        steps: json.steps.into_iter().map(Step::from).collect(),
    })
}

/// Renders step results as the CLI's stdout document.
pub fn render_results(results: &[StepResult]) -> String {
    let results = results
        .iter()
        .map(|result| match *result {
            StepResult::Quote { premium } => StepResultJson::Quote { premium },
            StepResult::Claim { payout, remaining_cap } => {
                StepResultJson::Claim { payout, remaining_cap }
            }
        })
        .collect();
    serde_json::to_string(&ResultsJson { results }).expect("results are plain integers")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_schema_example_parses_into_a_quote_and_a_claim() {
        let input = r#"{
            "customer": {"yearsWithMHPCO": 5},
            "steps": [
                {"op": "quote", "items": [
                    {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}
                ]},
                {"op": "claim", "policy": 0, "incident": {
                    "cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]
                }}
            ]
        }"#;
        let scenario = parse_scenario(input).expect("valid scenario");

        assert_eq!(scenario.years_with_mhpco, 5);
        match &scenario.steps[..] {
            [Step::Quote { items }, Step::Claim { policy, incident }] => {
                assert_eq!(items[0].item_type, "amulet");
                assert_eq!(items[0].material.as_deref(), Some("silver"));
                assert_eq!(items[0].enchantment, Some(2));
                assert!(!items[0].cursed);
                assert_eq!(*policy, 0);
                assert_eq!(incident.cause, "fire");
                assert_eq!(incident.damages[0].item_type, "amulet");
                assert_eq!(incident.damages[0].amount, 200);
            }
            other => panic!("expected a quote and a claim, got {other:?}"),
        }
    }

    #[test]
    fn items_may_omit_the_optional_fields() {
        let input = r#"{"customer": {"yearsWithMHPCO": 0},
                        "steps": [{"op": "quote", "items": [{"type": "rune"}]}]}"#;
        let scenario = parse_scenario(input).expect("valid scenario");
        match &scenario.steps[..] {
            [Step::Quote { items }] => {
                assert_eq!(items[0].material, None);
                assert_eq!(items[0].enchantment, None);
                assert!(!items[0].cursed);
            }
            other => panic!("expected one quote step, got {other:?}"),
        }
    }

    #[test]
    fn a_document_that_is_not_a_scenario_is_rejected() {
        assert!(parse_scenario("{\"steps\": []}").is_err());
    }

    #[test]
    fn results_render_with_the_binding_field_names() {
        let results = vec![
            StepResult::Quote { premium: 165 },
            StepResult::Claim { payout: 400, remaining_cap: 1600 },
        ];
        assert_eq!(
            render_results(&results),
            r#"{"results":[{"premium":165},{"payout":400,"remainingCap":1600}]}"#
        );
    }
}
