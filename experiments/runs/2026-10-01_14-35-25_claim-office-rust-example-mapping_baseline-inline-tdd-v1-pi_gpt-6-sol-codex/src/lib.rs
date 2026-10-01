use serde::Deserialize;
use serde_json::{json, Value};
use std::collections::HashMap;

#[derive(Deserialize)]
struct Customer {
    #[serde(rename = "yearsWithMHPCO")]
    years_with_mhpco: i64,
}

#[derive(Deserialize)]
struct Scenario {
    customer: Customer,
    steps: Vec<Step>,
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

fn quote(items: Vec<Item>, years: i64, follow_up: bool) -> Result<(i64, Policy), String> {
    let mut counts = HashMap::new();
    let mut cap = 0;
    for item in &items {
        cap += 2 * price(&item.kind)?.1;
        *counts.entry(item.kind.as_str()).or_insert(0) += 1;
    }
    let mut base = 0;
    let mut surcharge = 0;
    for item in &items {
        let mut item_base = price(&item.kind)?.0;
        if matches!(item.kind.as_str(), "rune" | "moonstone") && counts[item.kind.as_str()] == 3 {
            item_base = 20;
        }
        base += item_base;
        if item.cursed {
            surcharge += item_base * 10;
        }
        if item.enchantment >= 5 {
            surcharge += item_base * 6;
        }
    }
    let mut twentieths = base * 20 + surcharge + base * 2;
    if years >= 2 {
        twentieths -= base * 4;
    }
    if follow_up {
        twentieths -= base * 3;
    }
    // The processing fee is applied last. Integer division rounds premiums upward.
    let premium = (twentieths + 100 + 19) / 20;
    Ok((premium, Policy { items, remaining_cap: cap }))
}

fn claim(policy: &mut Policy, incident: Incident) -> Result<i64, String> {
    let mut used = vec![false; policy.items.len()];
    let mut payout_halves = 0;
    for damage in incident.damages {
        if damage.amount < 0 {
            return Err("negative damage amount".into());
        }
        let index = policy.items.iter().enumerate().position(|(i, item)| {
            !used[i] && item.kind == damage.item_type
        }).ok_or_else(|| format!("uninsured or excess damage item: {}", damage.item_type))?;
        used[index] = true;
        let item = &policy.items[index];
        let reimbursed_halves = if item.enchantment >= 8 {
            damage.amount
        } else {
            // Dragon material and ordinary items both receive full reimbursement.
            damage.amount * 2
        };
        payout_halves += (reimbursed_halves - 200).max(0);
    }
    let payout = (payout_halves / 2).min(policy.remaining_cap);
    policy.remaining_cap -= payout;
    Ok(payout)
}

/// Process one scenario atomically: errors produce no partial results.
pub fn process(input: Value) -> Result<Value, String> {
    let scenario: Scenario = serde_json::from_value(input).map_err(|e| e.to_string())?;
    let mut policies: Vec<Option<Policy>> = Vec::new();
    let mut results = Vec::new();
    let mut quotes = 0;
    for step in scenario.steps {
        match step {
            Step::Quote { items } => {
                let (premium, policy) = quote(items, scenario.customer.years_with_mhpco, quotes > 0)?;
                quotes += 1;
                policies.push(Some(policy));
                results.push(json!({"premium": premium}));
            }
            Step::Claim { policy, incident } => {
                let selected = policies.get_mut(policy).and_then(Option::as_mut)
                    .ok_or_else(|| format!("invalid policy step index: {policy}"))?;
                let payout = claim(selected, incident)?;
                results.push(json!({"payout": payout, "remainingCap": selected.remaining_cap}));
                policies.push(None);
            }
        }
    }
    Ok(json!({"results": results}))
}

#[cfg(test)]
mod tests {
    use serde_json::{json, Value};

    fn check(input: Value, expected: Value) {
        assert_eq!(super::process(input).unwrap(), expected);
    }

    #[test]
    fn basic_price_list_and_empty_policy() {
        check(json!({"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":[]},
            {"op":"quote","items":[{"type":"sword"}]},
            {"op":"quote","items":[{"type":"amulet"}]},
            {"op":"quote","items":[{"type":"staff"}]},
            {"op":"quote","items":[{"type":"potion"}]}
        ]}), json!({"results":[{"premium":5},{"premium":100},{"premium":62},{"premium":81},{"premium":43}]}));
    }

    #[test]
    fn component_blocks_are_exact_and_type_specific() {
        check(json!({"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":[{"type":"rune"},{"type":"rune"}]},
            {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"}]},
            {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]},
            {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"moonstone"}]},
            {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}]}
        ]}), json!({"results":[{"premium":60},{"premium":62},{"premium":100},{"premium":77},{"premium":119}]}));
    }

    #[test]
    fn modifiers_apply_to_item_or_policy_base_as_appropriate() {
        check(json!({"customer":{"yearsWithMHPCO":2},"steps":[
            {"op":"quote","items":[{"type":"sword","cursed":true},{"type":"amulet"}]},
            {"op":"quote","items":[{"type":"sword","cursed":true,"enchantment":5}]},
            {"op":"quote","items":[{"type":"sword","enchantment":4}]}
        ]}), json!({"results":[{"premium":199},{"premium":160},{"premium":80}]}));
    }

    #[test]
    fn newcomer_and_veteran_examples() {
        check(json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","cursed":true,"enchantment":3}]}]}), json!({"results":[{"premium":165}]}));
        check(json!({"customer":{"yearsWithMHPCO":3},"steps":[
            {"op":"quote","items":[]},
            {"op":"quote","items":[{"type":"sword","cursed":true,"enchantment":7}]}
        ]}), json!({"results":[{"premium":5},{"premium":160}]}));
    }

    #[test]
    fn claims_deduct_each_damage_and_use_enchantment_before_dragon() {
        check(json!({"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":9},{"type":"amulet","material":"dragon"},{"type":"rune"}]},
            {"op":"claim","policy":0,"incident":{"cause":"dragon attack","damages":[{"itemType":"sword","amount":1000},{"itemType":"amulet","amount":300},{"itemType":"rune","amount":200}]}}
        ]}), json!({"results":[{"premium":239},{"payout":700,"remainingCap":3000}]}));
    }

    #[test]
    fn identical_items_are_distinct_and_caps_are_consumed() {
        check(json!({"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":[{"type":"sword"},{"type":"sword"}]},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500},{"itemType":"sword","amount":1500}]}},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}}
        ]}), json!({"results":[{"premium":225},{"payout":2800,"remainingCap":1200},{"payout":1200,"remainingCap":0},{"payout":0,"remainingCap":0}]}));
    }

    #[test]
    fn cap_uses_insurance_value_and_persists_across_claims() {
        check(json!({"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":[{"type":"sword"}]},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}}
        ]}), json!({"results":[{"premium":115},{"payout":1400,"remainingCap":600},{"payout":600,"remainingCap":0}]}));
    }

    #[test]
    fn components_insure_at_full_value_even_when_block_discount_applies() {
        check(json!({"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":[{"type":"sword"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"rune","amount":500}]}}
        ]}), json!({"results":[{"premium":181},{"payout":400,"remainingCap":3100}]}));
        let runes = vec![json!({"type":"rune"}); 7];
        check(json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":runes}]}),
            json!({"results":[{"premium":198}]}));
    }

    #[test]
    fn fractional_payout_rounds_down_only_at_end() {
        check(json!({"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":[{"type":"sword","enchantment":8},{"type":"amulet","enchantment":8}]},
            {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":701},{"itemType":"amulet","amount":702}]}}
        ]}), json!({"results":[{"premium":229},{"payout":501,"remainingCap":2699}]}));
    }

    #[test]
    fn rejects_invalid_items_and_damages() {
        for steps in [
            json!([{"op":"quote","items":[{"type":"broomstick"}]}]),
            json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}]),
            json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":20},{"itemType":"sword","amount":30}]}}]),
            json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":-200}]}}]),
        ] {
            assert!(super::process(json!({"customer":{"yearsWithMHPCO":0},"steps":steps})).is_err());
        }
    }
}
