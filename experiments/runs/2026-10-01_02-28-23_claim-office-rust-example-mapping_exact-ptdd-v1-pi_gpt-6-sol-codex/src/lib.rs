use serde_json::{Value, json};

fn item_base(item: &Value) -> i64 {
    match item["type"].as_str() {
        Some("sword") => 100,
        Some("amulet") => 60,
        Some("staff") => 80,
        Some("potion") => 40,
        Some("rune" | "moonstone") => 25,
        _ => 0,
    }
}

fn component_block_discount(items: &[Value]) -> i64 {
    ["rune", "moonstone"].iter().map(|kind| {
        if items.iter().filter(|item| item["type"] == *kind).count() == 3 { 15 } else { 0 }
    }).sum()
}

fn curse_surcharge_base(items: &[Value]) -> i64 {
    items.iter().filter(|item| item["cursed"] == true).map(item_base).sum()
}

fn enchantment_surcharge_base(items: &[Value]) -> i64 {
    items.iter().filter(|item| item["enchantment"].as_i64().is_some_and(|level| level >= 5)).map(item_base).sum()
}

fn loyalty_discount(base: i64, years: i64) -> i64 {
    if years >= 2 { base * 2 } else { 0 }
}

fn followup_discount(base: i64, followup: bool) -> i64 {
    if followup { base * 15 } else { 0 }
}

fn quote_premium(step: &Value, years: i64, followup: bool) -> i64 {
    let items = step["items"].as_array();
    let mut base: i64 = items.into_iter().flatten().map(item_base).sum();
    base -= items.map_or(0, |items| component_block_discount(items));
    let curse_base = items.map_or(0, |items| curse_surcharge_base(items));
    let enchantment_base = items.map_or(0, |items| enchantment_surcharge_base(items));
    let loyalty = loyalty_discount(base, years);
    let followup_discount = followup_discount(base, followup);
    (base * 110 + curse_base * 50 + enchantment_base * 30 - loyalty * 10 - followup_discount + 99) / 100 + 5
}

fn validate_items(step: &Value) -> Result<(), String> {
    for item in step["items"].as_array().ok_or("missing items")? {
        if item_base(item) == 0 {
            return Err(format!("unknown item type: {}", item["type"]));
        }
    }
    Ok(())
}

fn item_value(item: &Value) -> i64 {
    match item["type"].as_str() {
        Some("sword") => 1000,
        Some("amulet") => 600,
        Some("staff") => 800,
        Some("potion") => 400,
        Some("rune" | "moonstone") => 250,
        _ => 0,
    }
}

struct Policy {
    items: Vec<Value>,
    remaining_cap: i64,
}

fn insured_items_for_damages<'a>(items: &'a [Value], damages: &[Value]) -> Result<Vec<&'a Value>, String> {
    let mut used = vec![false; items.len()];
    let mut matched = Vec::new();
    for damage in damages {
        let position = items.iter().enumerate().position(|(index, item)| {
            !used[index] && item["type"] == damage["itemType"]
        }).ok_or_else(|| format!("uninsured damage item: {}", damage["itemType"]))?;
        used[position] = true;
        matched.push(&items[position]);
    }
    Ok(matched)
}

fn reimbursable_halves(item: &Value, amount: i64) -> i64 {
    let reimbursed = if item["enchantment"].as_i64().is_some_and(|level| level >= 8) {
        amount
    } else {
        amount * 2
    };
    (reimbursed - 200).max(0)
}

fn settle_claim(step: &Value, policies: &mut [Option<Policy>]) -> Result<Value, String> {
    let index = step["policy"].as_u64().ok_or("invalid policy index")? as usize;
    let policy = policies.get_mut(index).and_then(Option::as_mut).ok_or("policy not found")?;
    let damages = step["incident"]["damages"].as_array().ok_or("missing damages")?;
    let insured = insured_items_for_damages(&policy.items, damages)?;
    let mut desired = 0;
    for (damage, item) in damages.iter().zip(insured) {
        let amount = damage["amount"].as_i64().ok_or("invalid damage amount")?;
        if amount < 0 {
            return Err("negative damage amount".into());
        }
        desired += reimbursable_halves(item, amount);
    }
    let payout = (desired / 2).min(policy.remaining_cap);
    policy.remaining_cap -= payout;
    Ok(json!({"payout":payout,"remainingCap":policy.remaining_cap}))
}

pub fn process(scenario: &Value) -> Result<Value, String> {
    let steps = scenario["steps"].as_array().ok_or("missing steps")?;
    let mut results = Vec::new();
    let mut quote_count = 0;
    let mut policies: Vec<Option<Policy>> = Vec::new();
    for step in steps {
        if step["op"] == "quote" {
            validate_items(step)?;
            let premium = quote_premium(step, scenario["customer"]["yearsWithMHPCO"].as_i64().unwrap_or(0), quote_count > 0);
            quote_count += 1;
            let items = step["items"].as_array().ok_or("missing items")?.clone();
            let remaining_cap = items.iter().map(item_value).sum::<i64>() * 2;
            policies.push(Some(Policy { items, remaining_cap }));
            results.push(json!({"premium":premium}));
        } else if step["op"] == "claim" {
            results.push(settle_claim(step, &mut policies)?);
            policies.push(None);
        } else {
            return Err("unknown operation".into());
        }
    }
    Ok(json!({"results":results}))
}
