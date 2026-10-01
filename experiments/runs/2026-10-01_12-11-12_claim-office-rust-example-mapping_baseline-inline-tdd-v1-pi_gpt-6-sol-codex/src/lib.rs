use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct Customer {
    #[serde(rename = "yearsWithMHPCO")]
    years_with_mhpco: i64,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Item {
    #[serde(rename = "type")]
    kind: String,
    // Dragon material receives the same full reimbursement as ordinary material;
    // only enchantment >= 8 overrides that default.
    #[serde(default)]
    #[allow(dead_code)]
    material: Option<String>,
    #[serde(default)]
    enchantment: Option<i64>,
    #[serde(default)]
    cursed: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Damage {
    item_type: String,
    amount: i64,
}

#[derive(Debug, Deserialize)]
pub struct Incident {
    #[allow(dead_code)]
    cause: String,
    damages: Vec<Damage>,
}

#[derive(Debug, Deserialize)]
#[serde(tag = "op", rename_all = "lowercase")]
pub enum Step {
    Quote { items: Vec<Item> },
    Claim { policy: usize, incident: Incident },
}

#[derive(Debug, Deserialize)]
pub struct Scenario {
    customer: Customer,
    steps: Vec<Step>,
}

#[derive(Debug, Serialize, PartialEq, Eq)]
#[serde(untagged)]
pub enum ResultEntry {
    Quote { premium: i64 },
    Claim { payout: i64, #[serde(rename = "remainingCap")] remaining_cap: i64 },
}

#[derive(Debug, Serialize, PartialEq, Eq)]
pub struct Output {
    pub results: Vec<ResultEntry>,
}

fn base_premium(kind: &str) -> Result<i64, String> {
    match kind {
        "sword" => Ok(100),
        "amulet" => Ok(60),
        "staff" => Ok(80),
        "potion" => Ok(40),
        "rune" | "moonstone" => Ok(25),
        _ => Err(format!("unknown item type: {kind}")),
    }
}

fn quote_premium(items: &[Item], years: i64, follow_up: bool) -> Result<i64, String> {
    let mut base = 0;
    let mut surcharges = 0;
    for item in items {
        let price = base_premium(&item.kind)?;
        base += price;
        if item.cursed {
            surcharges += 50 * price;
        }
        if item.enchantment.unwrap_or(0) >= 5 {
            surcharges += 30 * price;
        }
    }
    for kind in ["rune", "moonstone"] {
        if items.iter().filter(|item| item.kind == kind).count() == 3 {
            base -= 15;
        }
    }
    let multiplier = 100 + 10 - if years >= 2 { 20 } else { 0 } - if follow_up { 15 } else { 0 };
    Ok((base * multiplier + surcharges + 99) / 100 + 5)
}

struct Policy {
    items: Vec<Item>,
    remaining_cap: i64,
}

fn insurance_value(kind: &str) -> Result<i64, String> {
    Ok(base_premium(kind)? * 10)
}

fn claim(policy: &mut Policy, incident: Incident) -> Result<ResultEntry, String> {
    let mut used = vec![false; policy.items.len()];
    let mut payout_twice = 0;
    for damage in incident.damages {
        if damage.amount < 0 {
            return Err("negative damage amount".into());
        }
        let index = policy.items.iter().enumerate()
            .position(|(index, item)| !used[index] && item.kind == damage.item_type)
            .ok_or_else(|| format!("uninsured or excess damage item: {}", damage.item_type))?;
        used[index] = true;
        let item = &policy.items[index];
        let reimbursed_twice = if item.enchantment.unwrap_or(0) >= 8 {
            damage.amount
        } else {
            damage.amount * 2
        };
        payout_twice += (reimbursed_twice - 200).max(0);
    }
    let payout = (payout_twice / 2).min(policy.remaining_cap);
    policy.remaining_cap -= payout;
    Ok(ResultEntry::Claim { payout, remaining_cap: policy.remaining_cap })
}

pub fn run(scenario: Scenario) -> Result<Output, String> {
    let mut results = Vec::new();
    let mut policies: Vec<Option<Policy>> = Vec::new();
    let mut quotes = 0;
    for step in scenario.steps {
        let result = match step {
            Step::Quote { items } => {
                let premium = quote_premium(&items, scenario.customer.years_with_mhpco, quotes > 0)?;
                let cap = items.iter().map(|item| insurance_value(&item.kind)).collect::<Result<Vec<_>, _>>()?.iter().sum::<i64>() * 2;
                policies.push(Some(Policy { items, remaining_cap: cap }));
                quotes += 1;
                ResultEntry::Quote { premium }
            }
            Step::Claim { policy, incident } => {
                let policy = policies.get_mut(policy).and_then(Option::as_mut)
                    .ok_or_else(|| format!("invalid policy index: {policy}"))?;
                let result = claim(policy, incident)?;
                policies.push(None);
                result
            }
        };
        results.push(result);
    }
    Ok(Output { results })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn scenario(input: &str) -> Result<Output, String> {
        run(serde_json::from_str(input).unwrap())
    }

    #[test]
    fn component_blocks_require_exactly_three_of_one_type() {
        for (types, expected) in [
            (vec!["rune"; 2], 60),
            (vec!["rune"; 3], 71),
            (vec!["rune"; 4], 115),
            (vec!["rune"; 7], 198),
            (vec!["rune", "rune", "moonstone"], 88),
            (vec!["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"], 137),
        ] {
            let items: Vec<_> = types.into_iter().map(|kind| serde_json::json!({"type":kind})).collect();
            let input = serde_json::json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":items}]});
            assert_eq!(run(serde_json::from_value(input).unwrap()).unwrap().results, vec![ResultEntry::Quote { premium: expected }]);
        }
    }

    #[test]
    fn modifiers_stack_on_item_and_policy_bases() {
        let result = scenario(r#"{"customer":{"yearsWithMHPCO":3},"steps":[{"op":"quote","items":[{"type":"sword","cursed":true},{"type":"amulet"}]},{"op":"quote","items":[{"type":"sword","cursed":true,"enchantment":7}]}]}"#).unwrap();
        assert_eq!(result.results, vec![ResultEntry::Quote { premium: 199 }, ResultEntry::Quote { premium: 160 }]);
    }

    #[test]
    fn claims_deduct_per_item_and_exhaust_policy_cap() {
        let output = scenario(r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"},{"type":"amulet"}]},{"op":"claim","policy":0,"incident":{"cause":"dragon attack","damages":[{"itemType":"sword","amount":500},{"itemType":"amulet","amount":300}]}},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":3000}]}},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":200}]}}]}"#).unwrap();
        assert_eq!(output.results, vec![ResultEntry::Quote { premium: 181 }, ResultEntry::Claim { payout: 600, remaining_cap: 2600 }, ResultEntry::Claim { payout: 2600, remaining_cap: 0 }, ResultEntry::Claim { payout: 0, remaining_cap: 0 }]);
    }

    #[test]
    fn high_enchantment_precedes_dragon_material_and_deductible() {
        let output = scenario(r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":8},{"type":"sword","material":"dragon","enchantment":5},{"type":"rune"}]},{"op":"claim","policy":0,"incident":{"cause":"storm","damages":[{"itemType":"sword","amount":1000},{"itemType":"sword","amount":800},{"itemType":"rune","amount":200}]}}]}"#).unwrap();
        assert_eq!(output.results[1], ResultEntry::Claim { payout: 1200, remaining_cap: 3300 });
    }

    #[test]
    fn rejects_uninsured_excess_and_negative_damage() {
        for damages in [r#"[{"itemType":"amulet","amount":200}]"#, r#"[{"itemType":"sword","amount":200},{"itemType":"sword","amount":300}]"#, r#"[{"itemType":"sword","amount":-200}]"#] {
            let input = format!(r#"{{"customer":{{"yearsWithMHPCO":0}},"steps":[{{"op":"quote","items":[{{"type":"sword"}}]}},{{"op":"claim","policy":0,"incident":{{"cause":"fire","damages":{damages}}}}}]}}"#);
            assert!(scenario(&input).is_err(), "{damages}");
        }
        assert!(scenario(r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"broomstick"}]}]}"#).is_err());
    }

    #[test]
    fn thresholds_rounding_and_separate_policies() {
        let output = scenario(r#"{"customer":{"yearsWithMHPCO":2},"steps":[{"op":"quote","items":[{"type":"rune","cursed":true},{"type":"sword","enchantment":4}]},{"op":"quote","items":[{"type":"sword","enchantment":5,"cursed":true}]},{"op":"claim","policy":1,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1001}]}},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"rune","amount":100}]}},{"op":"claim","policy":1,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1000}]}}]}"#).unwrap();
        assert_eq!(output.results, vec![ResultEntry::Quote { premium: 130 }, ResultEntry::Quote { premium: 160 }, ResultEntry::Claim { payout: 901, remaining_cap: 1099 }, ResultEntry::Claim { payout: 0, remaining_cap: 2500 }, ResultEntry::Claim { payout: 900, remaining_cap: 199 }]);
    }

    #[test]
    fn cap_is_based_on_insurance_value_not_premium() {
        let output = scenario(r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","cursed":true}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}},{"op":"claim","policy":0,"incident":{"cause":"flood","damages":[{"itemType":"sword","amount":1500}]}}]}"#).unwrap();
        assert_eq!(output.results, vec![ResultEntry::Quote { premium: 165 }, ResultEntry::Claim { payout: 1400, remaining_cap: 600 }, ResultEntry::Claim { payout: 600, remaining_cap: 0 }]);
    }

    #[test]
    fn half_gold_payout_rounds_down() {
        let output = scenario(r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":9}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":901}]}}]}"#).unwrap();
        assert_eq!(output.results[1], ResultEntry::Claim { payout: 350, remaining_cap: 1650 });
    }

    #[test]
    fn payout_fractions_round_down_only_after_aggregation() {
        let output = scenario(r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","enchantment":8},{"type":"sword","enchantment":8}]},{"op":"claim","policy":0,"incident":{"cause":"rain","damages":[{"itemType":"sword","amount":801},{"itemType":"sword","amount":801}]}}]}"#).unwrap();
        assert_eq!(output.results[1], ResultEntry::Claim { payout: 601, remaining_cap: 3399 });
    }

    #[test]
    fn basic_quote_and_empty_quote() {
        let result = scenario(r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"quote","items":[]},{"op":"quote","items":[{"type":"amulet"},{"type":"staff"},{"type":"potion"}]}]}"#).unwrap();
        assert_eq!(result.results, vec![ResultEntry::Quote { premium: 115 }, ResultEntry::Quote { premium: 5 }, ResultEntry::Quote { premium: 176 }]);
    }
}
