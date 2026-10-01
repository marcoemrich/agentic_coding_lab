use crate::money::{CENTS, round_up};

#[derive(Default)]
pub struct Item {
    pub kind: String,
    pub material: String,
    pub enchantment: i64,
    pub cursed: bool,
}

/// A quoted policy: what the customer pays, and what the MHPCO is on the hook
/// for in total across all claims against it.
#[derive(Debug)]
pub struct Policy {
    pub premium: i64,
    pub cap: i64,
}

const COMPONENT_PREMIUM: i64 = 25;
const COMPONENT_VALUE: i64 = 250;
const BLOCK_PREMIUM: i64 = 60;

fn is_component(kind: &str) -> bool {
    matches!(kind, "rune" | "moonstone")
}

fn insurance_value(kind: &str) -> Option<i64> {
    match kind {
        "sword" => Some(1000),
        "amulet" => Some(600),
        "staff" => Some(800),
        "potion" => Some(400),
        _ if is_component(kind) => Some(COMPONENT_VALUE),
        _ => None,
    }
}

fn unknown_item(kind: &str) -> String {
    format!("unknown item type: {kind}")
}

fn base_premium(kind: &str) -> Option<i64> {
    match kind {
        "sword" => Some(100),
        "amulet" => Some(60),
        "staff" => Some(80),
        "potion" => Some(40),
        _ => None,
    }
}

/// A group of `count` alike components costs the block price if it is exactly
/// a block of three, otherwise the per-component price.
fn component_group_premium(count: usize) -> i64 {
    if count == 3 {
        BLOCK_PREMIUM
    } else {
        COMPONENT_PREMIUM * count as i64
    }
}

/// Base premium of every component in the policy, with alike components
/// grouped so the block discount can apply.
fn components_base(items: &[Item]) -> i64 {
    let mut kinds: Vec<&str> = items
        .iter()
        .map(|i| i.kind.as_str())
        .filter(|k| is_component(k))
        .collect();
    kinds.sort_unstable();
    kinds
        .chunk_by(|a, b| a == b)
        .map(|group| component_group_premium(group.len()))
        .sum()
}

/// Surcharges a single item adds on top of its own base premium.
fn item_surcharges(item: &Item, base: i64) -> i64 {
    let mut extra = 0;
    if item.cursed {
        extra += base * 50 / 100;
    }
    if item.enchantment >= 5 {
        extra += base * 30 / 100;
    }
    extra
}

pub fn try_quote(years: u32, prior_contracts: u32, items: &[Item]) -> Result<Policy, String> {
    let mut policy_base = 0;
    let mut total = 0;
    for item in items.iter().filter(|i| !is_component(&i.kind)) {
        let base = base_premium(&item.kind).ok_or_else(|| unknown_item(&item.kind))? * CENTS;
        policy_base += base;
        total += base + item_surcharges(item, base);
    }
    let components = components_base(items) * CENTS;
    policy_base += components;
    total += components;
    if years >= 2 {
        total -= policy_base * 20 / 100;
    }
    total += policy_base / 10;
    if prior_contracts > 0 {
        total -= policy_base * 15 / 100;
    }
    let insurance_sum: i64 = items
        .iter()
        .map(|i| insurance_value(&i.kind).ok_or_else(|| unknown_item(&i.kind)))
        .sum::<Result<i64, String>>()?;
    Ok(Policy {
        premium: round_up(total) + 5,
        cap: 2 * insurance_sum,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn quote_premium(years: u32, prior: u32, items: &[Item]) -> i64 {
        try_quote(years, prior, items).expect("items should be insurable").premium
    }

    fn item(kind: &str) -> Item {
        Item { kind: kind.to_string(), ..Item::default() }
    }

    fn cursed_sword(enchantment: i64) -> Item {
        Item {
            kind: "sword".to_string(),
            material: "steel".to_string(),
            enchantment,
            cursed: true,
        }
    }

    #[test]
    fn the_cap_is_twice_the_sum_of_the_items_insurance_values() {
        let policy = try_quote(0, 0, &[item("sword"), item("amulet")]).unwrap();
        assert_eq!(policy.cap, 3200);

        // the block discount affects the premium only, not the insurance sum
        let mut with_block = vec![item("sword")];
        with_block.extend(components("rune", 3));
        assert_eq!(try_quote(0, 0, &with_block).unwrap().cap, 3500);

        // premium modifiers do not raise the cap either
        let cursed = try_quote(0, 0, &[cursed_sword(3)]).unwrap();
        assert_eq!(cursed.premium, 165);
        assert_eq!(cursed.cap, 2000);
    }

    #[test]
    fn an_unknown_item_type_is_rejected() {
        let err = try_quote(0, 0, &[item("broomstick")]).unwrap_err();
        assert!(err.contains("broomstick"), "error should name the item: {err}");
    }

    #[test]
    fn empty_item_list_costs_only_the_processing_fee() {
        assert_eq!(quote_premium(0, 0, &[]), 5);
    }

    #[test]
    fn plain_item_base_premiums_follow_the_price_list() {
        // fee 5 + first-insurance surcharge 10% of base
        assert_eq!(quote_premium(0, 0, &[item("sword")]), 115);
        assert_eq!(quote_premium(0, 0, &[item("amulet")]), 71);
        assert_eq!(quote_premium(0, 0, &[item("staff")]), 93);
        assert_eq!(quote_premium(0, 0, &[item("potion")]), 49);
    }

    fn components(kind: &str, count: usize) -> Vec<Item> {
        (0..count).map(|_| item(kind)).collect()
    }

    /// Base premium only: no customer history, so just the 10% first
    /// insurance surcharge and the 5 G fee on top.
    fn base_only(items: &[Item]) -> i64 {
        quote_premium(0, 0, items)
    }

    #[test]
    fn a_block_of_three_alike_components_is_cheaper() {
        assert_eq!(base_only(&components("rune", 2)), 60); // 50 + 5 + 5
        assert_eq!(base_only(&components("rune", 3)), 71); // 60 + 6 + 5
        assert_eq!(base_only(&components("rune", 4)), 115); // 100 + 10 + 5
        assert_eq!(base_only(&components("rune", 7)), 198); // 175 + 17.5 -> 192.5 + 5
    }

    #[test]
    fn blocks_require_components_of_the_same_type() {
        let mut mixed = components("rune", 2);
        mixed.extend(components("moonstone", 1));
        assert_eq!(base_only(&mixed), 88); // 75 + 7.5 -> 82.5 + 5

        let mut two_blocks = components("rune", 3);
        two_blocks.extend(components("moonstone", 3));
        assert_eq!(base_only(&two_blocks), 137); // 120 + 12 + 5
    }

    #[test]
    fn item_modifiers_apply_only_to_the_affected_items_base() {
        // base 160 + 50 curse on the sword only + 16 first insurance + 5 fee
        let premium = quote_premium(0, 0, &[cursed_sword(3), item("amulet")]);
        assert_eq!(premium, 231);
    }

    #[test]
    fn loyalty_applies_from_exactly_two_years() {
        assert_eq!(quote_premium(1, 0, &[item("sword")]), 115);
        assert_eq!(quote_premium(2, 0, &[item("sword")]), 95);
    }

    #[test]
    fn high_enchantment_applies_from_exactly_five() {
        let ench = |n| Item { kind: "sword".to_string(), enchantment: n, ..Item::default() };
        assert_eq!(quote_premium(0, 0, &[ench(4)]), 115);
        assert_eq!(quote_premium(0, 0, &[ench(5)]), 145);
        // cursed and highly enchanted stack
        assert_eq!(quote_premium(0, 0, &[cursed_sword(5)]), 195);
    }

    #[test]
    fn newcomer_with_a_cursed_sword() {
        // 100 base + 50 curse + 10 first insurance + 5 fee
        assert_eq!(quote_premium(0, 0, &[cursed_sword(3)]), 165);
    }

    #[test]
    fn long_standing_customers_second_contract() {
        // 100 base + 50 curse + 30 high ench - 20 loyalty + 10 first - 15 follow-up + 5 fee
        assert_eq!(quote_premium(3, 1, &[cursed_sword(7)]), 160);
    }
}
