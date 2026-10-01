use serde::Deserialize;
use serde_json::{Value, json};
use std::collections::HashMap;

#[derive(Deserialize)]
struct Customer {
    #[serde(rename = "yearsWithMHPCO")]
    years: i64,
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
struct Damage {
    #[serde(rename = "itemType")]
    kind: String,
    amount: i64,
}

#[derive(Deserialize)]
struct Incident {
    #[serde(rename = "cause")]
    _cause: String,
    damages: Vec<Damage>,
}

#[derive(Deserialize)]
#[serde(tag = "op", rename_all = "lowercase")]
enum Step {
    Quote { items: Vec<Item> },
    Claim { policy: usize, incident: Incident },
}

#[derive(Deserialize)]
struct Scenario {
    customer: Customer,
    steps: Vec<Step>,
}

struct Policy {
    items: Vec<Item>,
    remaining_cap: i64,
}

fn price(kind: &str) -> Result<(i64, i64), String> {
    match kind {
        "sword" => Ok((1000, 100)),
        "amulet" => Ok((600, 60)),
        "staff" => Ok((800, 80)),
        "potion" => Ok((400, 40)),
        "rune" | "moonstone" => Ok((250, 25)),
        other => Err(format!("unknown item type: {other}")),
    }
}

fn is_component(kind: &str) -> bool {
    matches!(kind, "rune" | "moonstone")
}

// Building blocks replace the base premium only when there are exactly three of a type.
fn base_premiums(items: &[Item]) -> Result<Vec<i64>, String> {
    let mut counts = HashMap::new();
    for item in items {
        price(&item.kind)?;
        *counts.entry(item.kind.as_str()).or_insert(0usize) += 1;
    }
    items.iter().map(|item| {
        let base = price(&item.kind)?.1;
        Ok(if is_component(&item.kind) && counts[&item.kind.as_str()] == 3 { 20 } else { base })
    }).collect()
}

// Work in twentieths of a G: each percentage of a 25 G component is exact.
fn premium(items: &[Item], years: i64, prior_contracts: usize) -> Result<i64, String> {
    let bases = base_premiums(items)?;
    let base: i64 = bases.iter().sum();
    let curse: i64 = items.iter().zip(&bases).filter(|(item, _)| item.cursed).map(|(_, b)| b * 10).sum();
    let enchant: i64 = items.iter().zip(&bases).filter(|(item, _)| item.enchantment >= 5).map(|(_, b)| b * 6).sum();
    let loyalty = if years >= 2 { base * 4 } else { 0 };
    let followup = if prior_contracts > 0 { base * 3 } else { 0 };
    let twentieths = base * 20 + curse + enchant - loyalty + base * 2 - followup + 100;
    Ok((twentieths + 19).div_euclid(20))
}

fn insurance_sum(items: &[Item]) -> Result<i64, String> {
    items.iter().try_fold(0, |sum, item| Ok(sum + price(&item.kind)?.0))
}

// Preserve half-G fractions until the total claim payout is rounded down.
fn reimbursement_after_deductible_in_half_g(item: &Item, damage_amount: i64) -> i64 {
    let reimbursed_twice = if item.enchantment >= 8 { damage_amount } else { damage_amount * 2 };
    (reimbursed_twice - 200).max(0)
}

fn claim(policy: &mut Policy, incident: Incident) -> Result<Value, String> {
    let mut used = vec![false; policy.items.len()];
    let mut half_g = 0i64;
    for damage in incident.damages {
        if damage.amount < 0 {
            return Err("negative damage amount".into());
        }
        price(&damage.kind)?;
        let index = policy.items.iter().enumerate().position(|(i, item)| !used[i] && item.kind == damage.kind)
            .ok_or_else(|| format!("item not insured or too many damages: {}", damage.kind))?;
        used[index] = true;
        half_g += reimbursement_after_deductible_in_half_g(&policy.items[index], damage.amount);
    }
    let payout = (half_g / 2).min(policy.remaining_cap);
    policy.remaining_cap -= payout;
    Ok(json!({"payout": payout, "remainingCap": policy.remaining_cap}))
}

pub fn run(input: &Value) -> Result<Value, String> {
    let scenario: Scenario = serde_json::from_value(input.clone()).map_err(|err| err.to_string())?;
    let mut policies: HashMap<usize, Policy> = HashMap::new();
    let mut results = Vec::new();
    let mut contracts = 0;
    for (index, step) in scenario.steps.into_iter().enumerate() {
        match step {
            Step::Quote { items } => {
                let amount = premium(&items, scenario.customer.years, contracts)?;
                let cap = insurance_sum(&items)? * 2;
                policies.insert(index, Policy { items, remaining_cap: cap });
                results.push(json!({"premium": amount}));
                contracts += 1;
            }
            Step::Claim { policy, incident } => {
                let policy = policies.get_mut(&policy).ok_or("policy must refer to an earlier quote")?;
                results.push(claim(policy, incident)?);
            }
        }
    }
    Ok(json!({"results": results}))
}
