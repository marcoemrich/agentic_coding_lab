use serde_json::{Value, json};
use std::collections::HashMap;

const PROCESSING_FEE: i128 = 5;
const DEDUCTIBLE: i128 = 100;

fn catalogue(kind: &str) -> Result<(i128, i128), String> {
    match kind {
        "sword" => Ok((1000, 100)),
        "amulet" => Ok((600, 60)),
        "staff" => Ok((800, 80)),
        "potion" => Ok((400, 40)),
        "rune" | "moonstone" => Ok((250, 25)),
        _ => Err(format!("unknown item type: {kind}")),
    }
}

fn item_type(item: &Value) -> Result<&str, String> {
    item["type"].as_str().ok_or_else(|| "missing item type".to_owned())
}

fn base_premium(items: &[Value]) -> Result<i128, String> {
    let mut total = 0;
    let mut counts = HashMap::<&str, usize>::new();
    for item in items {
        let kind = item_type(item)?;
        total += catalogue(kind)?.1;
        if matches!(kind, "rune" | "moonstone") {
            *counts.entry(kind).or_default() += 1;
        }
    }
    for count in counts.values() {
        if *count == 3 {
            total -= 15; // 3 components at 25 G are offered for 60 G.
        }
    }
    Ok(total)
}

fn policy_cap(items: &[Value]) -> Result<i128, String> {
    let insurance_sum: i128 = items.iter().map(|item| Ok(catalogue(item_type(item)?)?.0)).sum::<Result<_, String>>()?;
    Ok(insurance_sum * 2)
}

fn item_risk_surcharge_hundredths(items: &[Value]) -> Result<i128, String> {
    let mut surcharge = 0;
    for item in items {
        let item_base = catalogue(item_type(item)?)?.1;
        if item["cursed"].as_bool() == Some(true) {
            surcharge += item_base * 50;
        }
        if item["enchantment"].as_i64().is_some_and(|level| level >= 5) {
            surcharge += item_base * 30;
        }
    }
    Ok(surcharge)
}

// Monetary hundredths preserve fractional intermediate amounts until the final rounding.
fn quote_premium(items: &[Value], years: i64, previous_quotes: usize) -> Result<i64, String> {
    let base = base_premium(items)?;
    let mut hundredths = base * 100 + item_risk_surcharge_hundredths(items)?;
    if years >= 2 {
        hundredths -= base * 20;
    }
    hundredths += base * 10; // Each quoted item is a first insurance.
    if previous_quotes > 0 {
        hundredths -= base * 15;
    }
    let premium = (hundredths + PROCESSING_FEE * 100 + 99).div_euclid(100);
    i64::try_from(premium).map_err(|_| "premium out of range".to_owned())
}

fn reimbursement(item: &Value, amount: i128) -> i128 {
    let hundredths = if item["enchantment"].as_i64().is_some_and(|level| level >= 8) {
        amount * 50
    } else {
        // Dragon material receives full reimbursement, as do ordinary items.
        amount * 100
    };
    (hundredths - DEDUCTIBLE * 100).max(0)
}

fn claim_payout(items: &[Value], damages: &[Value], available: i128) -> Result<(i64, i64), String> {
    let mut used = vec![false; items.len()];
    let mut total_hundredths = 0;
    for damage in damages {
        let kind = damage["itemType"].as_str().ok_or("missing damaged item type")?;
        catalogue(kind)?;
        let amount = damage["amount"].as_i64().ok_or("missing damage amount")?;
        if amount < 0 {
            return Err("negative damage amount".to_owned());
        }
        let index = items.iter().enumerate().position(|(index, item)| {
            !used[index] && item["type"].as_str() == Some(kind)
        }).ok_or_else(|| format!("damage exceeds insured {kind} items"))?;
        used[index] = true;
        total_hundredths += reimbursement(&items[index], i128::from(amount));
    }
    let desired = total_hundredths.div_euclid(100);
    let payout = desired.min(available);
    Ok((i64::try_from(payout).map_err(|_| "payout out of range")?,
        i64::try_from(available - payout).map_err(|_| "cap out of range")?))
}

struct Policy {
    items: Vec<Value>,
    remaining: i128,
}

fn steps(input: &Value) -> Result<Value, String> {
    let years = input["customer"]["yearsWithMHPCO"].as_i64().ok_or("missing yearsWithMHPCO")?;
    let steps = input["steps"].as_array().ok_or("missing steps")?;
    let mut policies = HashMap::<usize, Policy>::new();
    let mut quotes = 0;
    let mut results = Vec::with_capacity(steps.len());
    for (index, step) in steps.iter().enumerate() {
        match step["op"].as_str() {
            Some("quote") => {
                let items = step["items"].as_array().ok_or("missing items")?;
                let premium = quote_premium(items, years, quotes)?;
                policies.insert(index, Policy { items: items.clone(), remaining: policy_cap(items)? });
                quotes += 1;
                results.push(json!({"premium":premium}));
            }
            Some("claim") => {
                let index = step["policy"].as_u64().ok_or("invalid policy index")?;
                let policy = policies.get_mut(&usize::try_from(index).map_err(|_| "invalid policy index")?)
                    .ok_or("policy not found")?;
                let damages = step["incident"]["damages"].as_array().ok_or("missing damages")?;
                let (payout, remaining) = claim_payout(&policy.items, damages, policy.remaining)?;
                policy.remaining = i128::from(remaining);
                results.push(json!({"payout":payout,"remainingCap":remaining}));
            }
            _ => return Err("unknown operation".to_owned()),
        }
    }
    Ok(json!({"results":results}))
}

pub fn scenario(input: &Value) -> Result<Value, String> {
    steps(input)
}
