use serde_json::{Value, json};

fn base_premium(item: &Value) -> i64 {
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

fn curse_surcharge_tenths(items: &[Value]) -> i64 {
    items.iter().filter(|item| item["cursed"] == true).map(base_premium).sum::<i64>() * 5
}

fn enchantment_surcharge_tenths(items: &[Value]) -> i64 {
    items.iter().filter(|item| item["enchantment"].as_i64().is_some_and(|level| level >= 5))
        .map(base_premium).sum::<i64>() * 3
}

fn loyalty_discount_tenths(base: i64, years: i64) -> i64 {
    if years >= 2 { base * 2 } else { 0 }
}

fn follow_up_discount_hundredths(base: i64, prior_quotes: usize) -> i64 {
    if prior_quotes > 0 { base * 15 } else { 0 }
}

fn quote_premium(items: &Value, years: i64, prior_quotes: usize) -> i64 {
    let entries = items.as_array();
    let mut base: i64 = entries.into_iter().flatten().map(base_premium).sum();
    base -= entries.map_or(0, |list| component_block_discount(list));
    let curse_tenths = entries.map_or(0, |list| curse_surcharge_tenths(list));
    let enchantment_tenths = entries.map_or(0, |list| enchantment_surcharge_tenths(list));
    let loyalty_tenths = loyalty_discount_tenths(base, years);
    let follow_up_hundredths = follow_up_discount_hundredths(base, prior_quotes);
    (base * 110 + (curse_tenths + enchantment_tenths - loyalty_tenths) * 10 - follow_up_hundredths + 99) / 100 + 5
}

fn insurance_value(item: &Value) -> i64 {
    match item["type"].as_str() {
        Some("sword") => 1000,
        Some("amulet") => 600,
        Some("staff") => 800,
        Some("potion") => 400,
        Some("rune" | "moonstone") => 250,
        _ => 0,
    }
}

fn damage_reimbursement(item: &Value, amount: i64) -> i64 {
    let high_enchantment = item["enchantment"].as_i64().is_some_and(|level| level >= 8);
    let eligible_twice = if high_enchantment { amount } else { amount * 2 };
    (eligible_twice - 200).max(0)
}

fn incident_reimbursement(items: &[Value], damages: &Value) -> Result<i64, String> {
    let mut used = vec![false; items.len()];
    let mut desired = 0;
    for damage in damages.as_array().ok_or("missing damages")? {
        let position = items.iter().enumerate().position(|(i, item)| !used[i] && item["type"] == damage["itemType"]).ok_or("uninsured damage")?;
        used[position] = true;
        let amount = damage["amount"].as_i64().ok_or("missing amount")?;
        if amount < 0 {
            return Err("negative damage amount".into());
        }
        desired += damage_reimbursement(&items[position], amount);
    }
    Ok(desired)
}

fn validated_items(step: &Value) -> Result<&[Value], String> {
    let items = step["items"].as_array().ok_or("missing items")?;
    if items.iter().any(|item| base_premium(item) == 0) {
        return Err("unknown item type".into());
    }
    Ok(items)
}

pub fn process(input: &Value) -> Result<Value, String> {
    let steps = input["steps"].as_array().ok_or("missing steps")?;
    let mut results = Vec::new();
    let mut prior_quotes = 0;
    let mut policies: Vec<(usize, i64, Vec<Value>)> = Vec::new();
    for (index, step) in steps.iter().enumerate() {
        if step["op"] == "quote" {
            validated_items(step)?;
            let premium = quote_premium(&step["items"], input["customer"]["yearsWithMHPCO"].as_i64().unwrap_or(0), prior_quotes);
            results.push(json!({"premium":premium}));
            prior_quotes += 1;
            let sum: i64 = step["items"].as_array().into_iter().flatten().map(insurance_value).sum();
            policies.push((index, sum * 2, step["items"].as_array().cloned().unwrap_or_default()));
        } else if step["op"] == "claim" {
            let policy_index = step["policy"].as_u64().ok_or("missing policy")? as usize;
            let (_, remaining, items) = policies.iter_mut().find(|(id, _, _)| *id == policy_index).ok_or("unknown policy")?;
            let desired = incident_reimbursement(items, &step["incident"]["damages"])?;
            let payout = (desired / 2).min(*remaining);
            *remaining -= payout;
            results.push(json!({"payout":payout,"remainingCap":*remaining}));
        }
    }
    Ok(json!({"results":results}))
}
