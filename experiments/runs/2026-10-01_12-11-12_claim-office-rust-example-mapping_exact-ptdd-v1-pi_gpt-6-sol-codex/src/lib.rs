use serde_json::{Value, json};

struct Policy {
    items: Vec<Value>,
    remaining_cap: i64,
}

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

fn component_block_discount(items: &[Value]) -> i64 {
    ["rune", "moonstone"].iter().map(|kind| {
        if items.iter().filter(|item| item["type"] == *kind).count() == 3 { 15 } else { 0 }
    }).sum()
}

fn item_risk(item: &Value, base: i64) -> i64 {
    let mut percent = 0;
    if item["cursed"] == true { percent += 50; }
    if item["enchantment"].as_i64().is_some_and(|level| level >= 5) { percent += 30; }
    base * percent
}

fn contract_adjustment(base: i64, years: i64, previous_quotes: usize) -> i64 {
    let mut percent = 10; // Every quoted item is a first insurance.
    if years >= 2 { percent -= 20; }
    if previous_quotes > 0 { percent -= 15; }
    base * percent
}

fn quote(items: &[Value], years: i64, previous_quotes: usize) -> Result<(i64, i64), String> {
    let mut base = 0;
    let mut risk = 0;
    let mut value = 0;
    for item in items {
        let kind = item["type"].as_str().ok_or("missing item type")?;
        let (price, insured_value) = item_price(kind)?;
        base += price;
        value += insured_value;
        risk += item_risk(item, price);
    }
    base -= component_block_discount(items);
    // Integer hundredths preserve fractions until the last upward rounding.
    let hundredths = base * 100 + risk + contract_adjustment(base, years, previous_quotes);
    Ok(((hundredths + 99).div_euclid(100) + 5, value * 2))
}

fn reimbursement(item: &Value, amount: i64) -> i64 {
    // The high-enchantment limitation takes precedence over dragon material.
    let numerator = if item["enchantment"].as_i64().is_some_and(|level| level >= 8) {
        amount
    } else {
        amount * 2
    };
    (numerator - 200).max(0)
}

fn settle_claim(policy: &mut Policy, damages: &[Value]) -> Result<(i64, i64), String> {
    let mut used = vec![false; policy.items.len()];
    let mut twice_desired = 0;
    for damage in damages {
        let kind = damage["itemType"].as_str().ok_or("missing damage itemType")?;
        item_price(kind)?;
        let amount = damage["amount"].as_i64().ok_or("missing damage amount")?;
        if amount < 0 { return Err("negative damage amount".into()); }
        let index = policy.items.iter().enumerate()
            .position(|(index, item)| !used[index] && item["type"] == kind)
            .ok_or_else(|| format!("damage to uninsured item: {kind}"))?;
        used[index] = true;
        twice_desired += reimbursement(&policy.items[index], amount);
    }
    let payout = (twice_desired / 2).min(policy.remaining_cap);
    policy.remaining_cap -= payout;
    Ok((payout, policy.remaining_cap))
}

pub fn run(scenario: &Value) -> Result<Value, String> {
    let years = scenario["customer"]["yearsWithMHPCO"].as_i64().ok_or("missing yearsWithMHPCO")?;
    let steps = scenario["steps"].as_array().ok_or("missing steps")?;
    let mut policies: Vec<Option<Policy>> = Vec::new();
    let mut quote_count = 0;
    let mut results = Vec::new();
    for step in steps {
        match step["op"].as_str() {
            Some("quote") => {
                let items = step["items"].as_array().ok_or("missing items")?;
                let (premium, remaining_cap) = quote(items, years, quote_count)?;
                quote_count += 1;
                policies.push(Some(Policy { items: items.clone(), remaining_cap }));
                results.push(json!({"premium":premium}));
            }
            Some("claim") => {
                let index = step["policy"].as_u64().ok_or("invalid policy index")? as usize;
                let policy = policies.get_mut(index).and_then(Option::as_mut)
                    .ok_or("policy must reference an earlier quote")?;
                let damages = step["incident"]["damages"].as_array().ok_or("missing damages")?;
                let (payout, remaining_cap) = settle_claim(policy, damages)?;
                policies.push(None);
                results.push(json!({"payout":payout,"remainingCap":remaining_cap}));
            }
            _ => return Err("unknown operation".into()),
        }
    }
    Ok(json!({"results":results}))
}
