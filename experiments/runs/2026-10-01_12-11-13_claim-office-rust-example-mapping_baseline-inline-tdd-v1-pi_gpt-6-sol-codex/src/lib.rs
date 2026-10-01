use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct Scenario {
    customer: Customer,
    steps: Vec<Step>,
}

#[derive(Deserialize)]
struct Customer {
    #[serde(rename = "yearsWithMHPCO")]
    years: i64,
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
struct Damage {
    #[serde(rename = "itemType")]
    item_type: String,
    amount: i64,
}

#[derive(Serialize)]
struct Output {
    results: Vec<ResultEntry>,
}

#[derive(Serialize)]
#[serde(untagged)]
enum ResultEntry {
    Quote { premium: i64 },
    Claim { payout: i64, #[serde(rename = "remainingCap")] remaining_cap: i64 },
}

struct Policy {
    items: Vec<Item>,
    remaining_cap: i64,
}

// All premium calculations remain in hundredths until the final ceiling.
fn quote(items: &[Item], years: i64, followup: bool) -> Result<i64, String> {
    let mut base = 0;
    let mut item_surcharges = 0;
    for item in items {
        let value = match item.kind.as_str() {
            "sword" => 100,
            "amulet" => 60,
            "staff" => 80,
            "potion" => 40,
            "rune" | "moonstone" => {
                let count = items.iter().filter(|other| other.kind == item.kind).count();
                if count == 3 { 20 } else { 25 }
            }
            other => return Err(format!("unknown item type: {other}")),
        };
        base += value;
        if item.cursed { item_surcharges += 50 * value; }
        if item.enchantment >= 5 { item_surcharges += 30 * value; }
    }
    let mut percent = 110; // Each quoted item is a first insurance.
    if years >= 2 { percent -= 20; }
    if followup { percent -= 15; }
    Ok((base * percent + item_surcharges + 500 + 99) / 100)
}

fn insurance_value(kind: &str) -> i64 {
    match kind {
        "sword" => 1000,
        "amulet" => 600,
        "staff" => 800,
        "potion" => 400,
        "rune" | "moonstone" => 250,
        _ => unreachable!("validated by quote"),
    }
}

fn claim(policy: &mut Policy, incident: Incident) -> Result<i64, String> {
    let mut used = vec![false; policy.items.len()];
    let mut desired_twice = 0;
    for damage in incident.damages {
        if damage.amount < 0 { return Err("negative damage amount".into()); }
        let position = policy.items.iter().enumerate().position(|(i, item)|
            !used[i] && item.kind == damage.item_type)
            .ok_or_else(|| format!("uninsured or excess damage: {}", damage.item_type))?;
        used[position] = true;
        let item = &policy.items[position];
        // Dragon material pays in full, like the standard clause; high enchantment takes precedence.
        let reimbursed_twice = if item.enchantment >= 8 { damage.amount } else { damage.amount * 2 };
        desired_twice += (reimbursed_twice - 200).max(0);
    }
    // Round down once, after adding all fractional reimbursements.
    let payout = (desired_twice / 2).min(policy.remaining_cap);
    policy.remaining_cap -= payout;
    Ok(payout)
}

pub fn run(input: &str) -> Result<String, String> {
    let scenario: Scenario = serde_json::from_str(input).map_err(|e| e.to_string())?;
    let mut results = Vec::new();
    let mut policies: Vec<Option<Policy>> = Vec::new();
    let mut quote_count = 0;
    for step in scenario.steps {
        match step {
            Step::Quote { items } => {
                let premium = quote(&items, scenario.customer.years, quote_count > 0)?;
                let cap = items.iter().map(|item| insurance_value(&item.kind) * 2).sum();
                policies.push(Some(Policy { items, remaining_cap: cap }));
                quote_count += 1;
                results.push(ResultEntry::Quote { premium });
            }
            Step::Claim { policy, incident } => {
                let active = policies.get_mut(policy).and_then(Option::as_mut)
                    .ok_or_else(|| format!("invalid policy: {policy}"))?;
                let payout = claim(active, incident)?;
                results.push(ResultEntry::Claim { payout, remaining_cap: active.remaining_cap });
                policies.push(None);
            }
        }
    }
    serde_json::to_string(&Output { results }).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn check(steps: &str, years: i64, expected: &str) {
        let input = format!(r#"{{"customer":{{"yearsWithMHPCO":{years}}},"steps":{steps}}}"#);
        let output = run(&input).unwrap();
        assert_eq!(serde_json::from_str::<serde_json::Value>(&output).unwrap(), serde_json::from_str::<serde_json::Value>(expected).unwrap());
    }

    #[test]
    fn newcomer_sword_quote() {
        let input = r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]}]}"#;
        assert_eq!(run(input).unwrap(), r#"{"results":[{"premium":115}]}"#);
    }

    #[test]
    fn component_blocks_and_types() {
        for (count, premium) in [(2, 60), (3, 71), (4, 115), (7, 198)] {
            let items = vec![serde_json::json!({"type":"rune"}); count];
            check(&serde_json::json!([{"op":"quote","items":items}]).to_string(), 0,
                &serde_json::json!({"results":[{"premium":premium}]}).to_string());
        }
        check(r#"[{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"moonstone"}]}]"#, 0, r#"{"results":[{"premium":88}]}"#);
        check(&serde_json::json!([{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}]}]).to_string(), 0, r#"{"results":[{"premium":137}]}"#);
    }

    #[test]
    fn modifiers_and_followup() {
        check(r#"[{"op":"quote","items":[{"type":"sword","cursed":true},{"type":"amulet"}]}]"#, 0, r#"{"results":[{"premium":231}]}"#);
        check(r#"[{"op":"quote","items":[{"type":"sword","cursed":true}]}]"#, 0, r#"{"results":[{"premium":165}]}"#);
        check(r#"[{"op":"quote","items":[]},{"op":"quote","items":[{"type":"sword","cursed":true,"enchantment":7}]}]"#, 3, r#"{"results":[{"premium":5},{"premium":160}]}"#);
        check(r#"[{"op":"quote","items":[{"type":"sword","enchantment":4}]},{"op":"quote","items":[{"type":"sword","enchantment":5,"cursed":true}]}]"#, 2, r#"{"results":[{"premium":95},{"premium":160}]}"#);
    }

    #[test]
    fn claims_deductible_and_clause_priority() {
        check(r#"[{"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":9},{"type":"amulet"},{"type":"rune"}]},{"op":"claim","policy":0,"incident":{"cause":"dragon","damages":[{"itemType":"sword","amount":1000},{"itemType":"amulet","amount":300},{"itemType":"rune","amount":200}]}}]"#, 0, r#"{"results":[{"premium":239},{"payout":700,"remainingCap":3000}]}"#);
        check(r#"[{"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":5}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":800}]}}]"#, 0, r#"{"results":[{"premium":145},{"payout":700,"remainingCap":1300}]}"#);
    }

    #[test]
    fn repeated_items_and_cap_exhaustion() {
        check(r#"[{"op":"quote","items":[{"type":"sword"},{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":500},{"itemType":"sword","amount":300}]}}]"#, 0, r#"{"results":[{"premium":225},{"payout":600,"remainingCap":3400}]}"#);
        check(r#"[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}}]"#, 0, r#"{"results":[{"premium":115},{"payout":1400,"remainingCap":600},{"payout":600,"remainingCap":0}]}"#);
    }

    #[test]
    fn rounding_and_independent_policies() {
        check(r#"[{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]},{"op":"quote","items":[{"type":"sword","enchantment":8}]},{"op":"claim","policy":1,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":901}]}},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[]}}]"#, 0, r#"{"results":[{"premium":198},{"premium":130},{"payout":350,"remainingCap":1650},{"payout":0,"remainingCap":3500}]}"#);
        check(r#"[{"op":"quote","items":[{"type":"sword"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[]}}]"#, 0, r#"{"results":[{"premium":181},{"payout":0,"remainingCap":3500}]}"#);
    }

    #[test]
    fn prices_and_standard_reimbursement() {
        check(r#"[{"op":"quote","items":[{"type":"amulet"},{"type":"staff"},{"type":"potion"},{"type":"moonstone"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"staff","amount":500},{"itemType":"moonstone","amount":200}]}}]"#, 0, r#"{"results":[{"premium":231},{"payout":500,"remainingCap":3600}]}"#);
        check(r#"[{"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":8}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1000}]}}]"#, 0, r#"{"results":[{"premium":145},{"payout":400,"remainingCap":1600}]}"#);
    }

    #[test]
    fn invalid_inputs() {
        for steps in [
            r#"[{"op":"quote","items":[{"type":"broomstick"}]}]"#,
            r#"[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}]"#,
            r#"[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":-200}]}}]"#,
            r#"[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":200},{"itemType":"sword","amount":200}]}}]"#,
        ] {
            assert!(run(&format!(r#"{{"customer":{{"yearsWithMHPCO":0}},"steps":{steps}}}"#)).is_err());
        }
    }
}
