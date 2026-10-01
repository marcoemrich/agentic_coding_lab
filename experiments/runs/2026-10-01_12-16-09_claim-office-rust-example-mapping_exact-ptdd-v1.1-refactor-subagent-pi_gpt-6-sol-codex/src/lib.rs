use serde_json::{Value, json};

struct PriceListEntry {
    insurance_value: i64,
    base_premium: i64,
}

fn price_list_entry(kind: &str) -> Result<PriceListEntry, String> {
    let (insurance_value, base_premium) = match kind {
        "sword" => (1000, 100),
        "amulet" => (600, 60),
        "staff" => (800, 80),
        "potion" => (400, 40),
        "rune" | "moonstone" => (250, 25),
        _ => return Err(format!("unknown item type: {kind}")),
    };
    Ok(PriceListEntry { insurance_value, base_premium })
}

fn item_type(item: &Value) -> Result<&str, String> {
    item["type"].as_str().ok_or_else(|| "missing item type".to_string())
}

// Premium arithmetic is in tenths of a G until the final rounding.
fn item_risk_surcharge_tenths(item: &Value, base_premium: i64) -> i64 {
    let mut surcharge = 0;
    if item["cursed"] == true { surcharge += base_premium * 5; }
    if item["enchantment"].as_i64().is_some_and(|level| level >= 5) {
        surcharge += base_premium * 3;
    }
    surcharge
}

fn loyalty_discount_tenths(base: i64, years: i64) -> i64 {
    if years >= 2 { base * 2 } else { 0 }
}

fn policy_adjustments_tenths(base: i64, years: i64, previous_quotes: usize) -> i64 {
    let first_insurance_surcharge = base;
    let followup_discount = if previous_quotes > 0 { base * 15 / 10 } else { 0 };
    first_insurance_surcharge - loyalty_discount_tenths(base, years) - followup_discount
}

fn component_block_discount(items: &[Value]) -> i64 {
    let mut discount = 0;
    for kind in ["rune", "moonstone"] {
        if items.iter().filter(|item| item["type"] == kind).count() == 3 {
            discount += 15;
        }
    }
    discount
}

fn quote_premium(items: &[Value], years: i64, previous_quotes: usize) -> Result<i64, String> {
    let mut base = 0;
    let mut risk = 0;
    for item in items {
        let price = price_list_entry(item_type(item)?)?.base_premium;
        base += price;
        risk += item_risk_surcharge_tenths(item, price);
    }
    base -= component_block_discount(items);
    let tenths = base * 10 + policy_adjustments_tenths(base, years, previous_quotes) + risk + 50;
    Ok((tenths + 9) / 10)
}

struct Policy {
    items: Vec<Value>,
    remaining_cap: i64,
}

impl Policy {
    fn insure(items: &[Value]) -> Result<Self, String> {
        let insurance_sum = items.iter().try_fold(0, |total, item| {
            price_list_entry(item_type(item)?).map(|entry| total + entry.insurance_value)
        })?;
        Ok(Self { items: items.to_vec(), remaining_cap: insurance_sum * 2 })
    }
}

// Twice the payable amount preserves half-G fractions until final payout rounding.
fn damage_event_payout_twice(item: &Value, amount: i64) -> i64 {
    let reimbursement = if item["enchantment"].as_i64().is_some_and(|level| level >= 8) {
        amount
    } else {
        // Ordinary and dragon-material items are reimbursed in full.
        amount * 2
    };
    (reimbursement - 200).max(0)
}

fn claim_payout(policy: &mut Policy, damages: &[Value]) -> Result<i64, String> {
    let mut available = policy.items.clone();
    let mut twice_payout = 0;
    for damage in damages {
        let amount = damage["amount"].as_i64().ok_or("missing damage amount")?;
        if amount < 0 { return Err("negative damage amount".to_string()); }
        let kind = damage["itemType"].as_str().ok_or("missing damage itemType")?;
        let position = available.iter().position(|item| item["type"] == kind)
            .ok_or_else(|| format!("uninsured damage item: {kind}"))?;
        let item = available.remove(position);
        twice_payout += damage_event_payout_twice(&item, amount);
    }
    let payout = (twice_payout / 2).min(policy.remaining_cap);
    policy.remaining_cap -= payout;
    Ok(payout)
}

pub fn scenario(input: &Value) -> Result<Value, String> {
    let steps = input["steps"].as_array().ok_or("missing steps")?;
    let years = input["customer"]["yearsWithMHPCO"].as_i64().ok_or("missing yearsWithMHPCO")?;
    let mut results = Vec::new();
    let mut policies: Vec<Option<Policy>> = Vec::new();
    let mut previous_quotes = 0;
    for step in steps {
        match step["op"].as_str().ok_or("missing op")? {
            "quote" => {
                let items = step["items"].as_array().ok_or("missing items")?;
                let premium = quote_premium(items, years, previous_quotes)?;
                policies.push(Some(Policy::insure(items)?));
                previous_quotes += 1;
                results.push(json!({"premium":premium}));
            }
            "claim" => {
                let index = step["policy"].as_u64().ok_or("missing policy")? as usize;
                let policy = policies.get_mut(index).and_then(Option::as_mut)
                    .ok_or("policy does not refer to an earlier quote")?;
                let damages = step["incident"]["damages"].as_array().ok_or("missing damages")?;
                let payout = claim_payout(policy, damages)?;
                results.push(json!({"payout":payout,"remainingCap":policy.remaining_cap}));
                policies.push(None);
            }
            other => return Err(format!("unknown operation: {other}")),
        }
    }
    Ok(json!({"results":results}))
}
