use serde_json::{Value, json};
use std::collections::HashMap;

/// Insurance value and ordinary base premium from the MHPCO price list.
fn item_price(kind: &str) -> Result<(i64, i64), String> {
    match kind {
        "sword" => Ok((1000, 100)),
        "amulet" => Ok((600, 60)),
        "staff" => Ok((800, 80)),
        "potion" => Ok((400, 40)),
        "rune" | "moonstone" => Ok((250, 25)),
        _ => Err(format!("unknown item type: {kind}")),
    }
}

fn item_kind<'a>(item: &'a Value, key: &str) -> Result<&'a str, String> {
    item[key].as_str().ok_or_else(|| format!("missing {key}"))
}

/// A three-of-a-kind component block changes its premium, never its insured value.
fn component_base_premium(items: &[Value]) -> i64 {
    ["rune", "moonstone"].into_iter().map(|kind| {
        let count = items.iter().filter(|item| item["type"] == kind).count() as i64;
        if count == 3 { 60 } else { count * 25 }
    }).sum()
}

/// Item-specific risks are charged against the affected item's undiscounted base.
/// Fractional G are retained by calculating in hundredths of a G.
fn risk_surcharge_hundredths(items: &[Value]) -> Result<i64, String> {
    items.iter().try_fold(0, |total, item| {
        let (_, base) = item_price(item_kind(item, "type")?)?;
        Ok(total + if item["cursed"] == true { base * 50 } else { 0 }
            + if item["enchantment"].as_i64().is_some_and(|level| level >= 5) { base * 30 } else { 0 })
    })
}

/// Customer modifiers affect the policy base, not item-specific risks.
fn customer_adjustment_hundredths(base: i64, years: i64, earlier_quotes: usize) -> i64 {
    base * (10 - if years >= 2 { 20 } else { 0 } - if earlier_quotes > 0 { 15 } else { 0 })
}

fn quote_premium(items: &[Value], years: i64, earlier_quotes: usize) -> Result<i64, String> {
    let mut base = component_base_premium(items);
    for item in items {
        let kind = item_kind(item, "type")?;
        let (_, price) = item_price(kind)?;
        if kind != "rune" && kind != "moonstone" { base += price; }
    }
    let hundredths = base * 100 + risk_surcharge_hundredths(items)?
        + customer_adjustment_hundredths(base, years, earlier_quotes) + 500;
    Ok((hundredths + 99) / 100)
}

struct Policy {
    items: Vec<Value>,
    remaining_cap: i64,
}

fn insurance_cap(items: &[Value]) -> Result<i64, String> {
    items.iter().try_fold(0, |sum, item| {
        Ok(sum + 2 * item_price(item_kind(item, "type")?)?.0)
    })
}

/// Enchantment takes precedence over dragon material; deduct once for each damage entry.
/// Tenths are used so the claim is rounded down only after all damages are summed.
fn reimbursable_tenths(item: &Value, amount: i64) -> i64 {
    let percentage = if item["enchantment"].as_i64().is_some_and(|level| level >= 8) {
        5
    } else { 10 };
    (amount * percentage - 1000).max(0)
}

fn claim_payout(policy: &mut Policy, damages: &[Value]) -> Result<i64, String> {
    let mut used: HashMap<&str, usize> = HashMap::new();
    let mut desired_tenths = 0;
    for damage in damages {
        let kind = item_kind(damage, "itemType")?;
        item_price(kind)?;
        let amount = damage["amount"].as_i64().ok_or("invalid damage amount")?;
        if amount < 0 { return Err("negative damage amount".into()); }
        let occurrence = used.entry(kind).or_default();
        let item = policy.items.iter().filter(|item| item["type"] == kind)
            .nth(*occurrence).ok_or_else(|| format!("item not insured or too many damages: {kind}"))?;
        *occurrence += 1;
        desired_tenths += reimbursable_tenths(item, amount);
    }
    let payout = (desired_tenths / 10).min(policy.remaining_cap);
    policy.remaining_cap -= payout;
    Ok(payout)
}

/// Execute steps in sequence, keeping the policy's cap across claims.
pub fn process(input: &Value) -> Result<Value, String> {
    let steps = input["steps"].as_array().ok_or("missing steps")?;
    let years = input["customer"]["yearsWithMHPCO"].as_i64().ok_or("missing yearsWithMHPCO")?;
    let mut results = Vec::new();
    let mut policies: HashMap<usize, Policy> = HashMap::new();
    for (index, step) in steps.iter().enumerate() {
        match item_kind(step, "op")? {
            "quote" => {
                let items = step["items"].as_array().ok_or("missing items")?;
                let premium = quote_premium(items, years, policies.len())?;
                let cap = insurance_cap(items)?;
                policies.insert(index, Policy { items: items.clone(), remaining_cap: cap });
                results.push(json!({"premium":premium}));
            }
            "claim" => {
                let policy_index = step["policy"].as_u64().ok_or("invalid policy index")? as usize;
                let policy = policies.get_mut(&policy_index).ok_or("policy does not reference a prior quote")?;
                let damages = step["incident"]["damages"].as_array().ok_or("missing damages")?;
                let payout = claim_payout(policy, damages)?;
                results.push(json!({"payout":payout,"remainingCap":policy.remaining_cap}));
            }
            other => return Err(format!("unknown operation: {other}")),
        }
    }
    Ok(json!({"results":results}))
}
