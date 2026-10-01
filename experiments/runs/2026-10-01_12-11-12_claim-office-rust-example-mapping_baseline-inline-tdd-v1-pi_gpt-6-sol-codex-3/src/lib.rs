use serde::Deserialize;
use serde_json::{Value, json};

#[derive(Deserialize)]
struct Scenario {
    customer: Customer,
    steps: Vec<Step>,
}

#[derive(Deserialize)]
struct Customer {
    #[serde(rename = "yearsWithMHPCO")]
    years_with_mhpco: i64,
}

#[derive(Deserialize)]
#[serde(tag = "op", rename_all = "lowercase")]
enum Step {
    Quote { items: Vec<Item> },
    Claim { policy: usize, incident: Incident },
}

#[derive(Clone, Deserialize)]
struct Item {
    #[serde(rename = "type")]
    kind: String,
    #[serde(default, rename = "material")]
    _material: String,
    #[serde(default)]
    enchantment: i64,
    #[serde(default)]
    cursed: bool,
}

#[derive(Deserialize)]
struct Incident {
    #[serde(rename = "cause")]
    _cause: String,
    damages: Vec<Damage>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Damage {
    item_type: String,
    amount: i64,
}

struct Policy {
    items: Vec<Item>,
    remaining_cap: i64,
}

fn price(kind: &str) -> Result<(i64, i64), String> {
    match kind {
        "sword" => Ok((100, 1000)),
        "amulet" => Ok((60, 600)),
        "staff" => Ok((80, 800)),
        "potion" => Ok((40, 400)),
        "rune" | "moonstone" => Ok((25, 250)),
        _ => Err(format!("unknown item type: {kind}")),
    }
}

fn quote(items: &[Item], years: i64, follow_up: bool) -> Result<(i64, Policy), String> {
    let mut base = 0;
    let mut surcharge = 0;
    let mut insurance_sum = 0;
    for item in items {
        let (premium, value) = price(&item.kind)?;
        base += premium;
        insurance_sum += value;
        if item.cursed {
            surcharge += premium * 50;
        }
        if item.enchantment >= 5 {
            surcharge += premium * 30;
        }
    }
    for kind in ["rune", "moonstone"] {
        if items.iter().filter(|item| item.kind == kind).count() == 3 {
            base -= 15;
        }
    }
    let mut hundredths = base * 100 + surcharge;
    hundredths += base * 10; // Every item is a first insurance.
    if years >= 2 {
        hundredths -= base * 20;
    }
    if follow_up {
        hundredths -= base * 15;
    }
    let premium = (hundredths + 99).div_euclid(100) + 5;
    Ok((premium, Policy { items: items.to_vec(), remaining_cap: insurance_sum * 2 }))
}

fn claim(policy: &mut Policy, incident: &Incident) -> Result<i64, String> {
    let mut used = vec![false; policy.items.len()];
    let mut payout_twice = 0;
    for damage in &incident.damages {
        if damage.amount < 0 {
            return Err("negative damage amount".into());
        }
        let index = policy.items.iter().enumerate()
            .position(|(index, item)| !used[index] && item.kind == damage.item_type)
            .ok_or_else(|| format!("uninsured or duplicate damage: {}", damage.item_type))?;
        used[index] = true;
        let item = &policy.items[index];
        // Values are kept in half-G units until the final payout is rounded.
        let reimbursement_twice = if item.enchantment >= 8 {
            damage.amount
        } else {
            damage.amount * 2 // Dragon and ordinary material are fully reimbursed.
        };
        payout_twice += (reimbursement_twice - 200).max(0);
    }
    let payout = (payout_twice / 2).min(policy.remaining_cap);
    policy.remaining_cap -= payout;
    Ok(payout)
}

pub fn run_scenario(input: &str) -> Result<Value, String> {
    let scenario: Scenario = serde_json::from_str(input).map_err(|e| e.to_string())?;
    let mut policies: Vec<Option<Policy>> = Vec::new();
    let mut results = Vec::new();
    let mut quotes = 0;
    for step in scenario.steps {
        match step {
            Step::Quote { items } => {
                let (premium, policy) = quote(&items, scenario.customer.years_with_mhpco, quotes > 0)?;
                quotes += 1;
                policies.push(Some(policy));
                results.push(json!({"premium":premium}));
            }
            Step::Claim { policy, incident } => {
                let policy = policies.get_mut(policy).and_then(Option::as_mut)
                    .ok_or_else(|| "policy must reference an earlier quote".to_string())?;
                let payout = claim(policy, &incident)?;
                results.push(json!({"payout":payout,"remainingCap":policy.remaining_cap}));
                policies.push(None);
            }
        }
    }
    Ok(json!({"results":results}))
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn scenario(years: i64, steps: Value) -> Value {
        run_scenario(&json!({"customer":{"yearsWithMHPCO":years},"steps":steps}).to_string()).unwrap()
    }

    #[test]
    fn price_list_and_empty_quote() {
        let result = scenario(0, json!([
            {"op":"quote","items":[]},
            {"op":"quote","items":[{"type":"sword"}]},
            {"op":"quote","items":[{"type":"amulet"}]},
            {"op":"quote","items":[{"type":"staff"}]},
            {"op":"quote","items":[{"type":"potion"}]},
            {"op":"quote","items":[{"type":"rune"}]}
        ]));
        assert_eq!(result, json!({"results":[{"premium":5},{"premium":100},{"premium":62},{"premium":81},{"premium":43},{"premium":29}]}));
    }

    #[test]
    fn component_blocks_are_exact_and_separate_by_type() {
        let result = scenario(0, json!([
            {"op":"quote","items":[{"type":"rune"},{"type":"rune"}]},
            {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"}]},
            {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]},
            {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"moonstone"}]},
            {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}]}
        ]));
        assert_eq!(result, json!({"results":[{"premium":60},{"premium":62},{"premium":100},{"premium":77},{"premium":119}]}));
    }

    #[test]
    fn item_surcharges_and_policy_discounts_stack_from_base() {
        let result = scenario(3, json!([
            {"op":"quote","items":[{"type":"sword","cursed":true,"enchantment":3},{"type":"amulet"}]},
            {"op":"quote","items":[{"type":"sword","cursed":true,"enchantment":7}]}
        ]));
        // 160 + 50 - 32 + 16 + 5; then 100 + 50 + 30 - 20 + 10 - 15 + 5
        assert_eq!(result, json!({"results":[{"premium":199},{"premium":160}]}));
    }

    #[test]
    fn standard_claim_and_per_damage_deductible() {
        let result = scenario(0, json!([
            {"op":"quote","items":[{"type":"sword","material":"steel","enchantment":3},{"type":"amulet"},{"type":"rune"}]},
            {"op":"claim","policy":0,"incident":{"cause":"dragon","damages":[{"itemType":"sword","amount":500},{"itemType":"amulet","amount":300},{"itemType":"rune","amount":200}]}}
        ]));
        assert_eq!(result["results"][1], json!({"payout":700,"remainingCap":3000}));
    }

    #[test]
    fn enchantment_eight_overrides_dragon_and_rounds_down() {
        let result = scenario(0, json!([
            {"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":8},{"type":"amulet","material":"dragon","enchantment":5}]},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1001},{"itemType":"amulet","amount":800}]}}
        ]));
        assert_eq!(result["results"][1], json!({"payout":1100,"remainingCap":2100}));
    }

    #[test]
    fn repeated_claims_exhaust_unmodified_cap() {
        let result = scenario(0, json!([
            {"op":"quote","items":[{"type":"sword","cursed":true}]},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}}
        ]));
        assert_eq!(result, json!({"results":[{"premium":165},{"payout":1400,"remainingCap":600},{"payout":600,"remainingCap":0}]}));
    }

    #[test]
    fn multiple_identical_items_have_independent_deductibles() {
        let result = scenario(0, json!([
            {"op":"quote","items":[{"type":"sword"},{"type":"sword"}]},
            {"op":"claim","policy":0,"incident":{"cause":"dragon","damages":[{"itemType":"sword","amount":500},{"itemType":"sword","amount":300}]}}
        ]));
        assert_eq!(result["results"][1], json!({"payout":600,"remainingCap":3400}));
    }

    #[test]
    fn invalid_items_and_damages_reject_entire_scenario() {
        for steps in [
            json!([{"op":"quote","items":[{"type":"broomstick"}]}]),
            json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}]),
            json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":200},{"itemType":"sword","amount":300}]}}]),
            json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":-200}]}}]),
            json!([{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[]}}]),
        ] {
            assert!(run_scenario(&json!({"customer":{"yearsWithMHPCO":0},"steps":steps}).to_string()).is_err());
        }
    }

    #[test]
    fn policy_indices_survive_claim_steps_and_component_blocks_do_not_reduce_cap() {
        let result = scenario(0, json!([
            {"op":"quote","items":[{"type":"sword"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[]}},
            {"op":"quote","items":[{"type":"potion"}]},
            {"op":"claim","policy":2,"incident":{"cause":"fire","damages":[{"itemType":"potion","amount":200}]}},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":300}]}}
        ]));
        assert_eq!(result, json!({"results":[{"premium":181},{"payout":0,"remainingCap":3500},{"premium":43},{"payout":100,"remainingCap":700},{"payout":200,"remainingCap":3300}]}));
    }

    #[test]
    fn seven_runes_are_not_a_block_and_fractional_premium_rounds_up() {
        let items: Vec<Value> = (0..7).map(|_| json!({"type":"rune"})).collect();
        let result = scenario(0, json!([{"op":"quote","items":items}]));
        assert_eq!(result["results"][0], json!({"premium":198}));
    }

    #[test]
    fn threshold_five_dragon_receives_full_reimbursement() {
        let result = scenario(0, json!([
            {"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":5}]},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":800}]}}
        ]));
        assert_eq!(result["results"][1], json!({"payout":700,"remainingCap":1300}));
    }

    #[test]
    fn thresholds_and_rounding_apply_only_at_end() {
        let result = scenario(2, json!([
            {"op":"quote","items":[{"type":"sword","enchantment":4,"cursed":true}]},
            {"op":"quote","items":[{"type":"sword","enchantment":5,"cursed":true}]},
            {"op":"quote","items":[{"type":"rune","cursed":true}]}
        ]));
        assert_eq!(result, json!({"results":[{"premium":145},{"premium":160},{"premium":37}]}));
    }
}
