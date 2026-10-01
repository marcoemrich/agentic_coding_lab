use serde_json::{Value, json};

#[derive(Clone)]
struct InsuredItem {
    kind: String,
    enchantment: i64,
    cursed: bool,
}

impl InsuredItem {
    fn from_json(value: &Value) -> Result<Self, String> {
        let kind = value["type"].as_str().ok_or("item type missing")?;
        item_price(kind)?;
        Ok(Self {
            kind: kind.into(),
            enchantment: value["enchantment"].as_i64().unwrap_or(0),
            cursed: value["cursed"].as_bool().unwrap_or(false),
        })
    }
}

// Insurance values and ordinary base premiums are distinct from risk adjustments.
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

fn component_block_discount(items: &[InsuredItem]) -> i64 {
    // Only exactly three components of the same type earn a block discount.
    ["rune", "moonstone"].iter().map(|kind| {
        if items.iter().filter(|item| item.kind == *kind).count() == 3 { 15 } else { 0 }
    }).sum()
}

fn policy_base_premium(items: &[InsuredItem]) -> i64 {
    let ordinary: i64 = items.iter().map(|item| item_price(&item.kind).expect("validated item").1).sum();
    ordinary - component_block_discount(items)
}

// Risk surcharges apply to each affected item's ordinary base premium, not the block price.
fn item_risk_tenths(items: &[InsuredItem]) -> i64 {
    items.iter().map(|item| {
        let base = item_price(&item.kind).expect("validated item").1;
        base * (if item.cursed { 5 } else { 0 } + if item.enchantment >= 5 { 3 } else { 0 })
    }).sum()
}

// Customer adjustments apply to the policy base, while every item is a first insurance.
fn customer_adjustment_tenths(base: i64, years: i64, previous_quotes: usize) -> i64 {
    let loyalty = if years >= 2 { 2 * base } else { 0 };
    let follow_up = if previous_quotes > 0 { 15 * base / 10 } else { 0 };
    base - loyalty - follow_up
}

fn quote_premium(items: &[InsuredItem], years: i64, previous_quotes: usize) -> i64 {
    let base = policy_base_premium(items);
    // Tenths of a G preserve every fractional intermediate amount.
    let tenths = base * 10 + item_risk_tenths(items)
        + customer_adjustment_tenths(base, years, previous_quotes) + 50;
    (tenths + 9).div_euclid(10)
}

// Each damage event bears its own deductible; high enchantment halves reimbursement
// even when the item is made of dragon material. Halves defer payout rounding.
fn damage_payout_halves(item: &InsuredItem, amount: i64) -> i64 {
    let reimbursed_halves = if item.enchantment >= 8 { amount } else { amount * 2 };
    (reimbursed_halves - 200).max(0)
}

struct Damage<'a> {
    kind: &'a str,
    amount: i64,
}

impl<'a> Damage<'a> {
    fn from_json(value: &'a Value) -> Result<Self, String> {
        Ok(Self {
            kind: value["itemType"].as_str().ok_or("damage itemType missing")?,
            amount: value["amount"].as_i64().ok_or("damage amount missing")?,
        })
    }
}

struct Policy {
    items: Vec<InsuredItem>,
    remaining_cap: i64,
}

impl Policy {
    fn new(items: Vec<InsuredItem>) -> Self {
        let insurance_sum: i64 = items.iter().map(|item| item_price(&item.kind).expect("validated item").0).sum();
        Self { items, remaining_cap: 2 * insurance_sum }
    }

    fn pay_up_to_remaining_cap(&mut self, desired: i64) -> i64 {
        let payout = desired.min(self.remaining_cap);
        self.remaining_cap -= payout;
        payout
    }

    fn insured_item_for_damage(&self, used: &[bool], kind: &str) -> Result<usize, String> {
        self.items.iter().enumerate().position(|(index, item)| !used[index] && item.kind == kind)
            .ok_or_else(|| format!("damage to uninsured item: {kind}"))
    }

    fn claim<'a>(&mut self, damages: impl Iterator<Item = Result<Damage<'a>, String>>) -> Result<(i64, i64), String> {
        let mut used = vec![false; self.items.len()];
        let mut total_halves = 0_i64;
        for damage in damages {
            let Damage { kind, amount } = damage?;
            if amount < 0 { return Err("negative damage amount".into()); }
            let index = self.insured_item_for_damage(&used, kind)?;
            used[index] = true;
            total_halves += damage_payout_halves(&self.items[index], amount);
        }
        let desired = total_halves.div_euclid(2);
        let payout = self.pay_up_to_remaining_cap(desired);
        Ok((payout, self.remaining_cap))
    }
}

/// Process all steps in order; errors abort the entire scenario.
pub fn process(input: Value) -> Result<Value, String> {
    let years = input["customer"]["yearsWithMHPCO"].as_i64().ok_or("yearsWithMHPCO missing")?;
    let steps = input["steps"].as_array().ok_or("steps missing")?;
    let mut policies: Vec<Option<Policy>> = Vec::new();
    let mut results = Vec::new();
    let mut quotes = 0;
    for step in steps {
        match step["op"].as_str() {
            Some("quote") => {
                let items: Vec<_> = step["items"].as_array().ok_or("items missing")?
                    .iter().map(InsuredItem::from_json).collect::<Result<_, _>>()?;
                let premium = quote_premium(&items, years, quotes);
                quotes += 1;
                results.push(json!({"premium": premium}));
                policies.push(Some(Policy::new(items)));
            }
            Some("claim") => {
                let index = step["policy"].as_u64().ok_or("policy index missing")? as usize;
                let damages = step["incident"]["damages"].as_array().ok_or("damages missing")?;
                let policy = policies.get_mut(index).and_then(Option::as_mut).ok_or("policy must refer to an earlier quote")?;
                let (payout, remaining_cap) = policy.claim(damages.iter().map(Damage::from_json))?;
                results.push(json!({"payout": payout, "remainingCap": remaining_cap}));
                policies.push(None);
            }
            _ => return Err("unknown operation".into()),
        }
    }
    Ok(json!({"results": results}))
}
