use serde_json::{Value, json};

fn item_price(kind: &str) -> Result<(i64, i64), String> {
    match kind {
        "sword" => Ok((100, 1000)),
        "amulet" => Ok((60, 600)),
        "staff" => Ok((80, 800)),
        "potion" => Ok((40, 400)),
        "rune" | "moonstone" => Ok((25, 250)),
        _ => Err(format!("unknown item type: {kind}")),
    }
}

fn kind(item: &Value) -> Result<&str, String> {
    item["type"].as_str().ok_or_else(|| "missing item type".to_owned())
}

fn policy_base(items: &[Value]) -> Result<i64, String> {
    let mut base = 0;
    for item in items {
        base += item_price(kind(item)?)?.0;
    }
    for component in ["rune", "moonstone"] {
        if items.iter().filter(|item| item["type"] == component).count() == 3 {
            base -= 15;
        }
    }
    Ok(base)
}

fn insurance_sum(items: &[Value]) -> Result<i64, String> {
    items.iter().try_fold(0, |sum, item| {
        Ok(sum + item_price(kind(item)?)?.1)
    })
}

fn quote_premium(items: &[Value], years: i64, prior_contracts: usize) -> Result<i64, String> {
    let base = policy_base(items)?;
    let mut hundredths = base * 100;
    for item in items {
        let item_base = item_price(kind(item)?)?.0;
        if item["cursed"] == true { hundredths += item_base * 50; }
        if item["enchantment"].as_i64().is_some_and(|level| level >= 5) {
            hundredths += item_base * 30;
        }
    }
    // All policy modifiers use the unmodified policy base, not a running total.
    hundredths += base * 10;
    if years >= 2 { hundredths -= base * 20; }
    if prior_contracts > 0 { hundredths -= base * 15; }
    Ok((hundredths + 99).div_euclid(100) + 5)
}

struct Policy {
    items: Vec<Value>,
    remaining_cap: i64,
}

fn damage_reimbursement_halves(item: &Value, amount: i64) -> i64 {
    let reimbursement_halves = if item["enchantment"].as_i64().is_some_and(|level| level >= 8) {
        amount
    } else {
        amount * 2
    };
    (reimbursement_halves - 200).max(0)
}

fn claim(policy: &mut Policy, damages: &[Value]) -> Result<Value, String> {
    let mut used = std::collections::HashMap::<&str, usize>::new();
    let mut payout_halves = 0_i64;
    for damage in damages {
        let item_type = damage["itemType"].as_str().ok_or("missing damage itemType")?;
        item_price(item_type)?;
        let amount = damage["amount"].as_i64().ok_or("missing damage amount")?;
        if amount < 0 { return Err("negative damage amount".into()); }
        let index = used.entry(item_type).or_default();
        let item = policy.items.iter().filter(|item| item["type"] == item_type)
            .nth(*index).ok_or_else(|| format!("uninsured damage item: {item_type}"))?;
        *index += 1;
        payout_halves += damage_reimbursement_halves(item, amount);
    }
    let payout = (payout_halves / 2).min(policy.remaining_cap);
    policy.remaining_cap -= payout;
    Ok(json!({"payout":payout,"remainingCap":policy.remaining_cap}))
}

pub fn run(input: &Value) -> Result<Value, String> {
    let years = input["customer"]["yearsWithMHPCO"].as_i64().ok_or("missing yearsWithMHPCO")?;
    let steps = input["steps"].as_array().ok_or("missing steps")?;
    let mut policies: Vec<Option<Policy>> = Vec::new();
    let mut results = Vec::new();
    let mut contracts = 0;
    for step in steps {
        match step["op"].as_str() {
            Some("quote") => {
                let items = step["items"].as_array().ok_or("missing items")?;
                let premium = quote_premium(items, years, contracts)?;
                let sum = insurance_sum(items)?;
                policies.push(Some(Policy { items: items.clone(), remaining_cap: 2 * sum }));
                results.push(json!({"premium":premium}));
                contracts += 1;
            }
            Some("claim") => {
                let index = step["policy"].as_u64().ok_or("invalid policy index")? as usize;
                let policy = policies.get_mut(index).and_then(Option::as_mut).ok_or("unknown policy")?;
                let damages = step["incident"]["damages"].as_array().ok_or("missing damages")?;
                results.push(claim(policy, damages)?);
                policies.push(None);
            }
            _ => return Err("unknown operation".into()),
        }
    }
    Ok(json!({"results":results}))
}
