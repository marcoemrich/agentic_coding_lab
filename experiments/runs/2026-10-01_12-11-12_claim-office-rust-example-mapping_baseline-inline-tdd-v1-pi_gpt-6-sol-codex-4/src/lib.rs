use serde_json::{Value, json};

struct Policy {
    items: Vec<Value>,
    remaining_cap: i128,
}

fn item_prices(kind: &str) -> Result<(i128, i128), String> {
    match kind {
        "sword" => Ok((100, 1000)),
        "amulet" => Ok((60, 600)),
        "staff" => Ok((80, 800)),
        "potion" => Ok((40, 400)),
        "rune" | "moonstone" => Ok((25, 250)),
        _ => Err(format!("unknown item type: {kind}")),
    }
}

fn quote(step: &Value, years: i64, previous_quotes: usize) -> Result<(Value, Policy), String> {
    let items = step["items"].as_array().ok_or("missing items")?;
    let mut base = 0_i128;
    let mut cap = 0_i128;
    let mut item_bases = Vec::new();
    for item in items {
        let kind = item["type"].as_str().ok_or("missing item type")?;
        let (premium, value) = item_prices(kind)?;
        let discounted = (kind == "rune" || kind == "moonstone")
            && items.iter().filter(|candidate| candidate["type"] == kind).count() == 3;
        let premium = if discounted { 20 } else { premium };
        item_bases.push(premium);
        base += premium;
        cap += value * 2;
    }
    // All modifier terms are expressed in twentieths, to round only at the end.
    let mut twentieths = base * 20;
    for (item, premium) in items.iter().zip(item_bases) {
        if item["cursed"] == true { twentieths += premium * 10; }
        if item["enchantment"].as_i64().is_some_and(|level| level >= 5) {
            twentieths += premium * 6;
        }
    }
    if years >= 2 { twentieths -= base * 4; }
    twentieths += base * 2; // Every item is a first insurance.
    if previous_quotes > 0 { twentieths -= base * 3; }
    let premium = (twentieths + 19) / 20 + 5;
    Ok((json!({"premium":premium}), Policy { items: items.clone(), remaining_cap: cap }))
}

fn claim(step: &Value, policy: &mut Policy) -> Result<Value, String> {
    let damages = step["incident"]["damages"].as_array().ok_or("missing damages")?;
    let mut used = vec![false; policy.items.len()];
    let mut desired_halves = 0_i128;
    for damage in damages {
        let kind = damage["itemType"].as_str().ok_or("missing itemType")?;
        item_prices(kind)?;
        let amount = damage["amount"].as_i64().ok_or("invalid damage amount")?;
        if amount < 0 { return Err("negative damage amount".into()); }
        let index = policy.items.iter().enumerate().position(|(index, item)|
            !used[index] && item["type"] == kind
        ).ok_or_else(|| format!("uninsured damage to {kind}"))?;
        used[index] = true;
        let item = &policy.items[index];
        let high = item["enchantment"].as_i64().is_some_and(|level| level >= 8);
        let reimbursed_halves = if high { i128::from(amount) } else { i128::from(amount) * 2 };
        desired_halves += (reimbursed_halves - 200).max(0);
    }
    let payout = (desired_halves / 2).min(policy.remaining_cap);
    policy.remaining_cap -= payout;
    Ok(json!({"payout":payout,"remainingCap":policy.remaining_cap}))
}

/// Process a complete customer scenario, rejecting malformed or unsupported input.
pub fn run_scenario(input: Value) -> Result<Value, String> {
    let years = input["customer"]["yearsWithMHPCO"].as_i64().ok_or("missing yearsWithMHPCO")?;
    let steps = input["steps"].as_array().ok_or("missing steps")?;
    let mut policies: Vec<Option<Policy>> = Vec::new();
    let mut results = Vec::new();
    let mut quote_count = 0;
    for step in steps {
        let result = match step["op"].as_str() {
            Some("quote") => {
                let (result, policy) = quote(step, years, quote_count)?;
                quote_count += 1;
                policies.push(Some(policy));
                result
            }
            Some("claim") => {
                let index = step["policy"].as_u64().ok_or("invalid policy index")? as usize;
                let policy = policies.get_mut(index).and_then(Option::as_mut).ok_or("policy must refer to an earlier quote")?;
                let result = claim(step, policy)?;
                policies.push(None);
                result
            }
            _ => return Err("unsupported step".into()),
        };
        results.push(result);
    }
    Ok(json!({"results": results}))
}

#[cfg(test)]
mod tests {
    use super::run_scenario;
    use serde_json::{Value, json};

    fn run(input: Value) -> Value {
        run_scenario(input).unwrap()
    }

    #[test]
    fn base_prices_and_component_blocks() {
        let items = json!([{"type":"sword"},{"type":"amulet"},{"type":"staff"},
            {"type":"potion"},{"type":"rune"},{"type":"rune"},{"type":"rune"},
            {"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}]);
        assert_eq!(run(json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":items}]})),
            json!({"results":[{"premium":445}]}));
        // 280 main + 120 components + 10% initial assessment + 5 fee = 445.
    }

    #[test]
    fn block_requires_exactly_three_of_the_same_type() {
        for (types, base) in [
            (vec!["rune", "rune"], 50),
            (vec!["rune", "rune", "rune"], 60),
            (vec!["rune"; 4], 100),
            (vec!["rune"; 7], 175),
            (vec!["rune", "rune", "moonstone"], 75),
        ] {
            let items: Vec<_> = types.iter().map(|t| json!({"type":t})).collect();
            let output = run(json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":items}]}));
            assert_eq!(output["results"][0]["premium"], json!(base + base / 10 + if base % 10 != 0 {1} else {0} + 5));
        }
    }

    #[test]
    fn modifiers_stack_on_correct_bases_and_contract_history() {
        let output = run(json!({"customer":{"yearsWithMHPCO":3},"steps":[
            {"op":"quote","items":[{"type":"amulet"}]},
            {"op":"quote","items":[{"type":"sword","cursed":true,"enchantment":7}]},
            {"op":"quote","items":[{"type":"sword","cursed":true},{"type":"amulet"}]}
        ]}));
        assert_eq!(output, json!({"results":[{"premium":59},{"premium":160},{"premium":175}]}));
        // 160 + 50 curse - 32 loyalty + 16 initial - 24 follow-up + 5 = 175.
    }

    #[test]
    fn claim_deductibles_special_clauses_and_cap() {
        let output = run(json!({"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":8},
                {"type":"amulet"},{"type":"rune"}]},
            {"op":"claim","policy":0,"incident":{"cause":"attack","damages":[
                {"itemType":"sword","amount":1000},{"itemType":"amulet","amount":300},
                {"itemType":"rune","amount":200}]}},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[
                {"itemType":"amulet","amount":4000}]}}
        ]}));
        assert_eq!(output["results"][1], json!({"payout":700,"remainingCap":3000}));
        assert_eq!(output["results"][2], json!({"payout":3000,"remainingCap":0}));
    }

    #[test]
    fn repeated_items_have_independent_deductibles_and_cap_exhausts() {
        let output = run(json!({"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":[{"type":"sword"},{"type":"sword"}]},
            {"op":"claim","policy":0,"incident":{"cause":"attack","damages":[
                {"itemType":"sword","amount":1500},{"itemType":"sword","amount":1500}]}},
            {"op":"claim","policy":0,"incident":{"cause":"attack","damages":[
                {"itemType":"sword","amount":1500},{"itemType":"sword","amount":1500}]}}
        ]}));
        assert_eq!(output["results"][1], json!({"payout":2800,"remainingCap":1200}));
        assert_eq!(output["results"][2], json!({"payout":1200,"remainingCap":0}));
    }

    #[test]
    fn invalid_input_rejects_whole_scenario() {
        for steps in [
            json!([{"op":"quote","items":[{"type":"broomstick"}]}]),
            json!([{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[]}}]),
            json!([{"op":"quote","items":[{"type":"sword"}]},
                {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":50}]}}]),
            json!([{"op":"quote","items":[{"type":"sword"}]},
                {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":50},{"itemType":"sword","amount":50}]}}]),
            json!([{"op":"quote","items":[{"type":"rune"}]},
                {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"rune","amount":-200}]}}]),
        ] {
            assert!(run_scenario(json!({"customer":{"yearsWithMHPCO":0},"steps":steps})).is_err());
        }
    }

    #[test]
    fn fractional_amounts_round_once_at_end() {
        // Base 125, loyalty -25, initial +12.5, follow-up -18.75: 93.75 + fee = 98.75.
        let output = run(json!({"customer":{"yearsWithMHPCO":2},"steps":[
            {"op":"quote","items":[]},
            {"op":"quote","items":[{"type":"sword"},{"type":"rune"}]},
            {"op":"quote","items":[{"type":"sword","enchantment":4,"cursed":true}]}
        ]}));
        assert_eq!(output["results"][1], json!({"premium":99}));
        assert_eq!(output["results"][2], json!({"premium":130}));

        let output = run(json!({"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":[{"type":"sword","enchantment":8},{"type":"amulet","enchantment":8}]},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[
                {"itemType":"sword","amount":201},{"itemType":"amulet","amount":202}]}}
        ]}));
        assert_eq!(output["results"][1], json!({"payout":1,"remainingCap":3199}));
    }

    #[test]
    fn thresholds_and_dragon_priority() {
        let output = run(json!({"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":[{"type":"sword","enchantment":5,"cursed":true,"material":"dragon"}]},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":800}]}},
            {"op":"quote","items":[{"type":"sword","enchantment":9,"material":"dragon"}]},
            {"op":"claim","policy":2,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1000}]}}
        ]}));
        assert_eq!(output["results"][0], json!({"premium":195}));
        assert_eq!(output["results"][1], json!({"payout":700,"remainingCap":1300}));
        assert_eq!(output["results"][3], json!({"payout":400,"remainingCap":1600}));
    }

    #[test]
    fn empty_quote_pays_only_processing_fee() {
        assert_eq!(run(json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[]}]})),
            json!({"results":[{"premium":5}]}));
    }
}
