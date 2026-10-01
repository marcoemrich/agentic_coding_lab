use std::collections::HashMap;

/// Added to every premium, whatever the policy contains.
const PROCESSING_FEE: u64 = 5;

/// Charged once per component, uniformly for every component type.
const COMPONENT_BASE_PREMIUM: u64 = 25;

/// Components alike in type are offered as a building block at this premium.
const BUILDING_BLOCK_BASE_PREMIUM: u64 = 60;

/// A cursed item adds this percentage of its base premium as risk surcharge.
const CURSE_PERCENT: u64 = 50;

/// A highly enchanted item adds this percentage of its base premium as risk
/// surcharge.
const HIGH_ENCHANTMENT_PERCENT: u64 = 30;

/// An item counts as highly enchanted from this enchantment level upwards.
const HIGH_ENCHANTMENT_LEVEL: u64 = 5;

/// Every quote treats each item as a first insurance, surcharged by this
/// percentage of the policy base premium.
const FIRST_INSURANCE_PERCENT: u64 = 10;

/// A building block is offered for exactly this many alike components.
const BUILDING_BLOCK_SIZE: usize = 3;

/// The kind of magical item the MHPCO insures.
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
pub enum ItemType {
    Sword,
    Amulet,
    Staff,
    Potion,
    Rune,
    Moonstone,
}

/// An item a customer wishes to insure. The MHPCO's price list describes an
/// item purely by its properties, so an item is a value: two items with the
/// same type, curse and enchantment are the same item to the office.
#[derive(Clone, Copy)]
pub struct Item {
    pub item_type: ItemType,
    /// A cursed item carries a risk surcharge.
    pub cursed: bool,
    /// How strongly the item is enchanted. A highly enchanted item carries a
    /// risk surcharge; a component has no enchantment.
    pub enchantment: u64,
}

/// Computes the premium in whole G for the items a customer wishes to insure.
/// The MHPCO charges the policy base premium, adjusts it by the item-scoped
/// and the policy-scoped modifiers, and adds the processing fee at the very end.
pub fn quote(items: &[Item]) -> u64 {
    let base = policy_base_premium(items);
    base + item_surcharges(items) + policy_surcharges(base) + PROCESSING_FEE
}

/// The modifiers the MHPCO applies to the base premium of an individual
/// affected item, summed over the policy.
fn item_surcharges(items: &[Item]) -> u64 {
    items.iter().map(risk_surcharge).sum()
}

/// The modifiers the MHPCO applies to the policy base premium as a whole.
/// Every quote treats each item as a first insurance, whatever the customer's
/// history, so the initial assessment surcharge is charged on every policy.
///
/// Every example so far divides exactly. The MHPCO keeps intermediate amounts
/// as fractions and rounds only the final premium, so a modifier whose
/// percentage does not divide evenly needs a fractional amount here rather
/// than this truncating division.
fn policy_surcharges(policy_base: u64) -> u64 {
    policy_base * FIRST_INSURANCE_PERCENT / 100
}

/// The risk surcharge in G an item adds to its own base premium. The MHPCO
/// lists its risks one by one and charges every risk an item carries, so the
/// surcharges of all applicable risks stack.
///
/// Every rate so far divides the base premium exactly. The MHPCO keeps
/// intermediate amounts as fractions and rounds only the final premium, so a
/// rate that does not divide evenly needs a fractional amount per risk rather
/// than this truncating division.
fn risk_surcharge(item: &Item) -> u64 {
    curse_surcharge(item) + high_enchantment_surcharge(item)
}

/// What the MHPCO adds for a cursed item: a percentage of what the item would
/// otherwise cost.
fn curse_surcharge(item: &Item) -> u64 {
    if item.cursed {
        item_base_premium(item) * CURSE_PERCENT / 100
    } else {
        0
    }
}

/// What the MHPCO adds for a highly enchanted item: a percentage of what the
/// item would otherwise cost.
fn high_enchantment_surcharge(item: &Item) -> u64 {
    if is_highly_enchanted(item) {
        item_base_premium(item) * HIGH_ENCHANTMENT_PERCENT / 100
    } else {
        0
    }
}

/// An item counts as highly enchanted from the threshold enchantment level
/// upwards: the MHPCO reads its thresholds inclusively.
fn is_highly_enchanted(item: &Item) -> bool {
    item.enchantment >= HIGH_ENCHANTMENT_LEVEL
}

/// The policy base premium in G: the sum of all item base premiums, before
/// any modifier is applied. Main items are priced one by one; components are
/// priced by set of alike components, so that a building block can apply.
pub fn policy_base_premium(items: &[Item]) -> u64 {
    let main_items: u64 = items
        .iter()
        .filter(|item| !is_component(item.item_type))
        .map(item_base_premium)
        .sum();
    main_items + components_base_premium(items)
}

/// The base premium in G for every component on the policy: the MHPCO prices
/// each set of components alike in type on its own.
fn components_base_premium(items: &[Item]) -> u64 {
    alike_component_counts(items)
        .into_values()
        .map(alike_base_premium)
        .sum()
}

/// How many components the policy carries in each set of alike components.
/// Components count as alike when they are of exactly the same type: a rune
/// and a moonstone are never alike, however similar they look.
fn alike_component_counts(items: &[Item]) -> HashMap<ItemType, usize> {
    let mut counts: HashMap<ItemType, usize> = HashMap::new();
    for item in items.iter().filter(|item| is_component(item.item_type)) {
        *counts.entry(item.item_type).or_default() += 1;
    }
    counts
}

/// The base premium in G for one set of components alike in type: the MHPCO
/// offers a building block wherever the customer brings exactly three.
fn alike_base_premium(alike: usize) -> u64 {
    if alike == BUILDING_BLOCK_SIZE {
        BUILDING_BLOCK_BASE_PREMIUM
    } else {
        alike as u64 * COMPONENT_BASE_PREMIUM
    }
}

/// Components, such as runes and moonstones, are the items the MHPCO prices
/// uniformly and offers as building blocks.
fn is_component(item_type: ItemType) -> bool {
    matches!(item_type, ItemType::Rune | ItemType::Moonstone)
}

/// What the MHPCO charges for one item on its own, straight from the price
/// list. A component priced inside a building block is charged by the group
/// instead, through `components_base_premium`.
fn item_base_premium(item: &Item) -> u64 {
    match item.item_type {
        ItemType::Sword => 100,
        ItemType::Amulet => 60,
        ItemType::Staff => 80,
        ItemType::Potion => 40,
        ItemType::Rune | ItemType::Moonstone => COMPONENT_BASE_PREMIUM,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// A plain item of the given type: no material, enchantment or curse yet.
    fn item(item_type: ItemType) -> Item {
        Item { item_type, cursed: false, enchantment: 0 }
    }

    /// The same item, now cursed: the MHPCO's examples describe a curse as a
    /// property laid on an item that is otherwise priced from the price list.
    fn cursed(item: Item) -> Item {
        Item { cursed: true, ..item }
    }

    /// The same item, now enchanted to the given level. The MHPCO's examples
    /// name the level rather than whether the item counts as highly enchanted.
    fn enchanted(item: Item, enchantment: u64) -> Item {
        Item { enchantment, ..item }
    }

    /// A policy covering `count` components alike in type, as the MHPCO's
    /// building-block examples describe them.
    fn alike_components(count: usize, item_type: ItemType) -> Vec<Item> {
        (0..count).map(|_| item(item_type)).collect()
    }

    // --- Edge case: empty policy ---

    #[test]
    fn quote_for_empty_item_list_is_only_the_processing_fee() {
        assert_eq!(quote(&[]), 5);
    }

    // --- Base premiums per main item type (parallel catalogue: each entry
    //     carries independent insurance value and base premium data) ---

    #[test]
    fn the_price_list_charges_100_g_base_premium_for_a_sword() {
        assert_eq!(policy_base_premium(&[item(ItemType::Sword)]), 100);
    }

    #[test]
    fn the_price_list_charges_60_g_base_premium_for_an_amulet() {
        assert_eq!(policy_base_premium(&[item(ItemType::Amulet)]), 60);
    }

    #[test]
    fn the_price_list_charges_80_g_base_premium_for_a_staff() {
        assert_eq!(policy_base_premium(&[item(ItemType::Staff)]), 80);
    }

    #[test]
    fn the_price_list_charges_40_g_base_premium_for_a_potion() {
        assert_eq!(policy_base_premium(&[item(ItemType::Potion)]), 40);
    }

    #[test]
    fn a_rune_is_charged_the_25_g_component_base_premium() {
        assert_eq!(policy_base_premium(&[item(ItemType::Rune)]), 25);
    }

    #[test]
    fn a_moonstone_is_charged_the_25_g_component_base_premium() {
        assert_eq!(policy_base_premium(&[item(ItemType::Moonstone)]), 25);
    }

    #[test]
    fn the_policy_base_premium_sums_the_items_base_premiums() {
        let policy = [item(ItemType::Sword), item(ItemType::Amulet)];
        assert_eq!(policy_base_premium(&policy), 160);
    }

    // --- Building block of 3 alike components ---

    #[test]
    fn two_runes_are_priced_individually() {
        let policy = alike_components(2, ItemType::Rune);
        assert_eq!(policy_base_premium(&policy), 50);
    }

    #[test]
    fn three_alike_runes_form_a_building_block() {
        let policy = alike_components(3, ItemType::Rune);
        assert_eq!(policy_base_premium(&policy), 60);
    }

    #[test]
    fn four_runes_are_priced_individually_because_a_block_needs_exactly_three() {
        let policy = alike_components(4, ItemType::Rune);
        assert_eq!(policy_base_premium(&policy), 100);
    }

    #[test]
    fn seven_runes_are_priced_individually_because_a_block_needs_exactly_three() {
        let policy = alike_components(7, ItemType::Rune);
        assert_eq!(policy_base_premium(&policy), 175);
    }

    #[test]
    fn components_of_different_types_do_not_form_a_block() {
        let mut policy = alike_components(2, ItemType::Rune);
        policy.extend(alike_components(1, ItemType::Moonstone));
        assert_eq!(policy_base_premium(&policy), 75);
    }

    #[test]
    fn each_component_type_forms_its_own_building_block() {
        let mut policy = alike_components(3, ItemType::Rune);
        policy.extend(alike_components(3, ItemType::Moonstone));
        assert_eq!(policy_base_premium(&policy), 120);
    }

    // --- Item-specific modifiers ---

    #[test]
    fn a_cursed_item_adds_a_fifty_percent_risk_surcharge() {
        let cursed_sword = cursed(item(ItemType::Sword));
        // 100 G base + 50 G curse + 10 G first insurance + 5 G fee
        assert_eq!(quote(&[cursed_sword]), 165);
    }

    #[test]
    fn enchantment_of_exactly_five_adds_the_high_enchantment_surcharge() {
        let enchanted_sword = enchanted(item(ItemType::Sword), 5);
        // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
        assert_eq!(quote(&[enchanted_sword]), 145);
    }

    #[test]
    fn enchantment_below_five_adds_no_high_enchantment_surcharge() {
        let sword = enchanted(item(ItemType::Sword), 4);
        // 100 G base + 10 G first insurance + 5 G fee; no enchantment surcharge
        assert_eq!(quote(&[sword]), 115);
    }

    #[test]
    #[ignore = "TODO: cursed sword enchantment 5 -> both curse and high-enchantment surcharges apply"]
    fn a_cursed_highly_enchanted_item_carries_both_surcharges() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: cursed sword (base 100) + plain amulet (base 60) -> 210 G before policy modifiers and fee; curse applies to the cursed item's base premium only"]
    fn item_modifiers_apply_only_to_the_affected_items_base_premium() {
        // Add the observation when this behavior enters Red.
    }

    // --- Policy-wide modifiers ---

    #[test]
    #[ignore = "TODO: customer with exactly 2 years -> 20 % loyalty discount applies"]
    fn exactly_two_years_with_mhpco_earns_the_loyalty_discount() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: customer with 1 year -> no loyalty discount"]
    fn fewer_than_two_years_with_mhpco_earns_no_loyalty_discount() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: first insurance surcharge 10 % of the policy base premium applies to every quote"]
    fn every_quote_carries_the_first_insurance_surcharge() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: the second quote in a scenario gets a 15 % follow-up contract discount; the first does not"]
    fn each_contract_after_the_first_earns_the_follow_up_discount() {
        // Add the observation when this behavior enters Red.
    }

    // --- Rounding ---

    #[test]
    #[ignore = "TODO: premium of 197.5 G -> 198 G (rounded up, in MHPCO's favor)"]
    fn a_fractional_premium_is_rounded_up() {
        // Add the observation when this behavior enters Red.
    }

    // --- Integration examples ---

    #[test]
    #[ignore = "TODO: newcomer (0 years), cursed steel sword enchantment 3 -> premium 165 G"]
    fn newcomer_with_a_cursed_sword_pays_165_g() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: 3-year customer, second quote, cursed sword enchantment 7 -> premium 160 G"]
    fn long_standing_customers_second_contract_pays_160_g() {
        // Add the observation when this behavior enters Red.
    }

    // --- Insurance sum and cap ---

    #[test]
    #[ignore = "TODO: policy with sword + amulet -> insurance sum 1600 G, cap 3200 G (observed via remainingCap)"]
    fn the_cap_is_twice_the_sum_of_the_items_insurance_values() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: policy with two swords -> insurance sum 2000 G, cap 4000 G"]
    fn two_items_of_the_same_type_each_add_their_insurance_value() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: policy with sword + 3 runes -> insurance sum 1750 G, cap 3500 G; the block discount does not reduce the insurance sum"]
    fn the_building_block_discount_does_not_reduce_the_insurance_sum() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: cursed sword -> cap 2000 G from the unmodified insurance value; premium modifiers do not raise the cap"]
    fn premium_modifiers_do_not_raise_the_cap() {
        // Add the observation when this behavior enters Red.
    }

    // --- Claim: standard reimbursement and deductible ---

    #[test]
    #[ignore = "TODO: steel sword enchantment 3, damage 500 G -> payout 400 G (full minus 100 G deductible)"]
    fn a_standard_damage_is_reimbursed_in_full_minus_the_deductible() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: rune (insurance value 250 G), damage 200 G -> payout 100 G; a component has no enchantment or material, so no special clause applies"]
    fn damage_to_a_component_applies_only_the_deductible() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: dragon attack damages sword (500 G) and amulet (300 G) -> payout 600 G; the deductible applies once per damaged item"]
    fn the_deductible_applies_once_per_damage_entry() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: two sword damage entries on a policy covering two swords -> each entry is a separate damage with its own deductible"]
    fn repeated_damage_entries_of_one_type_are_separate_damage_events() {
        // Add the observation when this behavior enters Red.
    }

    // --- Claim: special clauses ---

    #[test]
    #[ignore = "TODO: steel sword enchantment 9, damage 1000 G -> payout 400 G (50 % clause, then deductible)"]
    fn damage_to_a_very_highly_enchanted_item_is_reimbursed_at_fifty_percent() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: dragon-material sword enchantment 5, damage 800 G -> payout 700 G (full reimbursement, then deductible)"]
    fn damage_to_a_dragon_material_item_is_fully_reimbursed() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: dragon-material sword enchantment 8, damage 1000 G -> payout 400 G (enchantment threshold is inclusive and wins)"]
    fn enchantment_of_exactly_eight_triggers_the_fifty_percent_clause() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: dragon-material sword enchantment 9, damage 1000 G -> payout 400 G; the 50 % rule wins over full reimbursement"]
    fn the_fifty_percent_clause_wins_over_dragon_material() {
        // Add the observation when this behavior enters Red.
    }

    // --- Claim: cap exhaustion across successive claims ---

    #[test]
    #[ignore = "TODO: sword (cap 2000 G), first claim 1500 G -> payout 1400 G, remainingCap 600 G"]
    fn a_claim_reduces_the_remaining_cap_by_the_payout() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: sword (cap 2000 G), two claims of 1500 G -> second payout 600 G, remainingCap 0 G"]
    fn a_payout_is_limited_to_the_remaining_cap() {
        // Add the observation when this behavior enters Red.
    }

    // --- Claim: rounding ---

    #[test]
    #[ignore = "TODO: payout of 350.5 G -> 350 G (rounded down, in MHPCO's favor)"]
    fn a_fractional_payout_is_rounded_down() {
        // Add the observation when this behavior enters Red.
    }

    // --- Error cases: observable contract is an Err result from the library,
    //     which the CLI turns into a non-zero exit with stderr output ---

    #[test]
    #[ignore = "TODO: quote with an unknown item type (broomstick) -> Err describing the unknown type"]
    fn a_quote_with_an_unknown_item_type_is_rejected() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: claim damaging an amulet when only a sword is insured -> Err describing the uncovered item"]
    fn a_claim_for_an_item_outside_the_policy_is_rejected() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: claim damaging an unknown item type -> Err describing the unknown type"]
    fn a_claim_for_an_unknown_item_type_is_rejected() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: two sword damage entries but only one sword insured -> Err; the whole claim is rejected"]
    fn a_claim_with_more_damages_of_a_type_than_insured_is_rejected() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: claim with a damage amount of -200 -> Err describing the negative amount"]
    fn a_claim_with_a_negative_damage_amount_is_rejected() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: claim referencing a policy index that is not a quote step -> Err describing the bad reference"]
    fn a_claim_referencing_a_missing_policy_is_rejected() {
        // Add the observation when this behavior enters Red.
    }

    // --- Scenario-level behavior ---

    #[test]
    #[ignore = "TODO: results array has the same length and order as steps; quote results carry premium, claim results carry payout and remainingCap"]
    fn results_mirror_the_steps_in_length_and_order() {
        // Add the observation when this behavior enters Red.
    }

    #[test]
    #[ignore = "TODO: schema example scenario (amulet quote then 200 G fire claim) round-trips through the JSON contract"]
    fn the_scenario_json_contract_round_trips() {
        // Add the observation when this behavior enters Red.
    }
}
