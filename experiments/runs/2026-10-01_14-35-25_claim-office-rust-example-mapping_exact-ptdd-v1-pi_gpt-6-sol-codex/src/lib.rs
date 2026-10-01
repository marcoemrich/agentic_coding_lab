use serde_json::{Value, json};

fn item_values(kind: &str) -> Result<(i64, i64), String> {
    match kind {
        "sword" => Ok((1000, 100)),
        "amulet" => Ok((600, 60)),
        "staff" => Ok((800, 80)),
        "potion" => Ok((400, 40)),
        "rune" | "moonstone" => Ok((250, 25)),
        _ => Err(format!("unknown item type: {kind}")),
    }
}

fn kind(item: &Value) -> Result<&str, String> {
    item["type"].as_str().ok_or_else(|| "missing item type".to_string())
}

// A block changes premium only; its three components keep their individual insured values.
fn policy_base(items: &[Value]) -> Result<i64, String> {
    let mut base = 0;
    for item in items {
        base += item_values(kind(item)?)?.1;
    }
    for component in ["rune", "moonstone"] {
        if items.iter().filter(|item| item["type"] == component).count() == 3 {
            base -= 15;
        }
    }
    Ok(base)
}

fn item_risk_surcharge(items: &[Value]) -> Result<i64, String> {
    let mut tenths = 0;
    for item in items {
        let item_base = item_values(kind(item)?)?.1;
        if item["cursed"] == true {
            tenths += item_base * 5;
        }
        if item["enchantment"].as_i64().is_some_and(|level| level >= 5) {
            tenths += item_base * 3;
        }
    }
    Ok(tenths)
}

fn quote_premium(items: &[Value], years: i64, previous_quotes: usize) -> Result<i64, String> {
    let base = policy_base(items)?;
    // Tenths preserve every fractional G until the final rounding in the office's favor.
    let mut tenths = base * 10 + item_risk_surcharge(items)?;
    if years >= 2 {
        tenths -= base * 2;
    }
    tenths += base; // Each quoted item is a first insurance, regardless of contract history.
    if previous_quotes > 0 {
        tenths -= base * 15 / 10;
    }
    Ok((tenths + 50 + 9) / 10)
}

struct Policy {
    items: Vec<Value>,
    remaining_cap: i64,
}

fn open_policy(items: &[Value]) -> Result<Policy, String> {
    let mut sum = 0;
    for item in items {
        sum += item_values(kind(item)?)?.0;
    }
    Ok(Policy { items: items.to_vec(), remaining_cap: 2 * sum })
}

fn reimbursed_halves(item: &Value, amount: i64) -> i64 {
    // The high-enchantment clause takes precedence over dragon material.
    if item["enchantment"].as_i64().is_some_and(|level| level >= 8) {
        amount
    } else {
        amount * 2
    }
}

fn settle_claim(policy: &mut Policy, incident: &Value) -> Result<Value, String> {
    let damages = incident["damages"].as_array().ok_or("missing damages")?;
    let mut available = policy.items.clone();
    let mut payout_halves = 0;
    for damage in damages {
        let damage_kind = damage["itemType"].as_str().ok_or("missing itemType")?;
        item_values(damage_kind)?;
        let amount = damage["amount"].as_i64().ok_or("missing damage amount")?;
        if amount < 0 {
            return Err("negative damage amount".to_string());
        }
        let index = available.iter().position(|item| item["type"] == damage_kind)
            .ok_or_else(|| format!("uninsured damage: {damage_kind}"))?;
        let item = available.remove(index);
        payout_halves += (reimbursed_halves(&item, amount) - 200).max(0);
    }
    let desired = payout_halves / 2; // Round only the final payout down.
    let payout = desired.min(policy.remaining_cap);
    policy.remaining_cap -= payout;
    Ok(json!({"payout":payout,"remainingCap":policy.remaining_cap}))
}

pub fn process(scenario: &Value) -> Result<Value, String> {
    let years = scenario["customer"]["yearsWithMHPCO"].as_i64().ok_or("missing yearsWithMHPCO")?;
    let steps = scenario["steps"].as_array().ok_or("missing steps")?;
    let mut policies: Vec<Option<Policy>> = Vec::new();
    let mut results = Vec::new();
    let mut previous_quotes = 0;
    for step in steps {
        match step["op"].as_str() {
            Some("quote") => {
                let items = step["items"].as_array().ok_or("missing items")?;
                let premium = quote_premium(items, years, previous_quotes)?;
                policies.push(Some(open_policy(items)?));
                previous_quotes += 1;
                results.push(json!({"premium":premium}));
            }
            Some("claim") => {
                let index = step["policy"].as_u64().ok_or("invalid policy index")? as usize;
                let policy = policies.get_mut(index).and_then(Option::as_mut).ok_or("unknown policy")?;
                let result = settle_claim(policy, &step["incident"])?;
                policies.push(None);
                results.push(result);
            }
            _ => return Err("unknown operation".to_string()),
        }
    }
    Ok(json!({"results":results}))
}
