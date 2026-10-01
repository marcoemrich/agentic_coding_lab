use serde::Deserialize;
use serde_json::{Value, json};

use crate::claim::{ClaimablePolicy, Damage};
use crate::quote::{Item, try_quote};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Scenario {
    customer: Customer,
    steps: Vec<Step>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Customer {
    #[serde(rename = "yearsWithMHPCO")]
    years_with_mhpco: i64,
}

#[derive(Deserialize)]
#[serde(tag = "op", rename_all = "camelCase")]
enum Step {
    Quote { items: Vec<ItemInput> },
    Claim { policy: usize, incident: Incident },
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ItemInput {
    #[serde(rename = "type")]
    kind: String,
    #[serde(default)]
    material: String,
    #[serde(default)]
    enchantment: i64,
    #[serde(default)]
    cursed: bool,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Incident {
    /// Recorded on the incident but not priced: the MHPCO reimburses the same
    /// whether the sword met a dragon or a doorframe.
    #[serde(default)]
    #[allow(dead_code)]
    cause: String,
    damages: Vec<DamageInput>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct DamageInput {
    item_type: String,
    amount: i64,
}

/// Runs a whole scenario: steps are processed in order, and a claim step
/// refers back to the policy a previous quote step created.
pub fn run_json(input: &str) -> Result<Value, String> {
    let scenario: Scenario = serde_json::from_str(input).map_err(|e| e.to_string())?;
    let years = scenario.customer.years_with_mhpco.max(0) as u32;

    let mut policies: Vec<Option<ClaimablePolicy>> = Vec::new();
    let mut results = Vec::new();
    let mut quotes_so_far = 0;

    for step in &scenario.steps {
        match step {
            Step::Quote { items } => {
                let items: Vec<Item> = items.iter().map(ItemInput::to_item).collect();
                let policy = try_quote(years, quotes_so_far, &items)?;
                quotes_so_far += 1;
                results.push(json!({"premium": policy.premium}));
                policies.push(Some(ClaimablePolicy::new(&items, policy.cap)));
            }
            Step::Claim { policy, incident } => {
                let covered = policies
                    .get_mut(*policy)
                    .and_then(Option::as_mut)
                    .ok_or_else(|| format!("no policy at step {policy}"))?;
                let damages: Vec<Damage> = incident.damages.iter().map(DamageInput::to_damage).collect();
                let claim = covered.claim(&damages)?;
                results.push(json!({
                    "payout": claim.payout,
                    "remainingCap": claim.remaining_cap,
                }));
            }
        }
    }
    Ok(json!({"results": results}))
}

impl ItemInput {
    fn to_item(&self) -> Item {
        Item {
            kind: self.kind.clone(),
            material: self.material.clone(),
            enchantment: self.enchantment,
            cursed: self.cursed,
        }
    }
}

impl DamageInput {
    fn to_damage(&self) -> Damage {
        Damage {
            item_type: self.item_type.clone(),
            amount: self.amount,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const SCHEMA_EXAMPLE: &str = r#"{
        "customer": {"yearsWithMHPCO": 5},
        "steps": [
            {"op": "quote", "items": [
                {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}
            ]},
            {"op": "claim", "policy": 0, "incident": {
                "cause": "fire",
                "damages": [{"itemType": "amulet", "amount": 200}]
            }}
        ]
    }"#;

    fn premiums(json: &str) -> Vec<i64> {
        run_json(json).unwrap()["results"]
            .as_array()
            .unwrap()
            .iter()
            .map(|r| r["premium"].as_i64().unwrap())
            .collect()
    }

    #[test]
    fn every_quote_after_the_first_gets_the_follow_up_discount() {
        let scenario = r#"{
            "customer": {"yearsWithMHPCO": 3},
            "steps": [
                {"op": "quote", "items": [
                    {"type": "sword", "material": "steel", "enchantment": 7, "cursed": true}
                ]},
                {"op": "quote", "items": [
                    {"type": "sword", "material": "steel", "enchantment": 7, "cursed": true}
                ]}
            ]
        }"#;
        // first contract 175, second one 160 (the documented example)
        assert_eq!(premiums(scenario), vec![175, 160]);
    }

    #[test]
    fn an_unknown_item_type_fails_the_whole_scenario() {
        let scenario = r#"{
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]
        }"#;
        assert!(run_json(scenario).is_err());
    }

    #[test]
    fn a_claim_against_an_uninsured_item_fails_the_whole_scenario() {
        let scenario = r#"{
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "sword"}]},
                {"op": "claim", "policy": 0, "incident": {
                    "cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]
                }}
            ]
        }"#;
        assert!(run_json(scenario).is_err());
    }

    #[test]
    fn runs_a_quote_followed_by_a_claim_against_its_policy() {
        let output = run_json(SCHEMA_EXAMPLE).unwrap();
        // amulet: 60 base - 12 loyalty + 6 first insurance = 54 + 5 fee
        // claim: 200 - 100 deductible = 100, cap 1200 - 100
        assert_eq!(
            output,
            serde_json::json!({"results": [{"premium": 59}, {"payout": 100, "remainingCap": 1100}]})
        );
    }
}
