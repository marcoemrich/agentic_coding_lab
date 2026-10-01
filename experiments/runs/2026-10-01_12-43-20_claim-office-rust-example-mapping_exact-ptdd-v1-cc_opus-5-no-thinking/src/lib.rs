mod json;

pub use json::{parse_scenario, render_results};

use std::collections::BTreeMap;

pub struct Customer {
    pub years_with_mhpco: u32,
}

#[derive(Clone)]
pub struct Item {
    pub item_type: String,
    pub cursed: bool,
    pub enchantment: u32,
    pub material: String,
}

const PROCESSING_FEE: f64 = 5.0;

const FIRST_INSURANCE_SURCHARGE: f64 = 0.10;

/// The MHPCO reimburses damage; it does not accept a negative damage report.
fn reject_negative_damages(incident: &Incident) -> Result<(), String> {
    for damage in &incident.damages {
        if damage.amount < 0 {
            return Err(format!(
                "a damage amount cannot be negative, but {} was reported for {}",
                damage.amount, damage.item_type
            ));
        }
    }
    Ok(())
}

const HALF_REIMBURSEMENT_THRESHOLD: u32 = 8;
const HALF_REIMBURSEMENT: f64 = 0.50;

/// A damage is reimbursed under its item's clause, less the per-event deductible.
fn reimbursement(damage: &Damage, damaged: &Item) -> f64 {
    let reimbursed = damage.amount as f64 * reimbursement_rate(damaged);
    (reimbursed - DEDUCTIBLE_PER_DAMAGE).max(0.0)
}

const FULL_REIMBURSEMENT: f64 = 1.0;

/// Damage to a highly enchanted item is reimbursed at half its amount; that
/// clause wins over the dragon-material clause, which reimburses in full.
fn reimbursement_rate(damaged: &Item) -> f64 {
    if damaged.enchantment >= HALF_REIMBURSEMENT_THRESHOLD {
        return HALF_REIMBURSEMENT;
    }
    FULL_REIMBURSEMENT
}

/// The MHPCO rounds a payout down, always to its own advantage.
fn round_in_claimants_disfavour(payout: f64) -> u64 {
    payout.floor() as u64
}

/// The MHPCO rounds a premium up, always to its own advantage.
fn round_in_mhpcos_favour(premium: f64) -> u64 {
    premium.ceil() as u64
}

const COMPONENT_BLOCK_SIZE: usize = 3;
const COMPONENT_BLOCK_BASE_PREMIUM: f64 = 60.0;
const COMPONENT_BASE_PREMIUM: f64 = 25.0;

/// The sum of every item's base premium, with alike components priced as blocks.
fn policy_base_premium(items: &[Item]) -> Result<f64, String> {
    let main_items = items.iter().filter(|item| !is_component(&item.item_type));
    let mut total = 0.0;
    for item in main_items {
        total += base_premium(item)?;
    }
    for count in alike_component_counts(items).values() {
        total += components_base_premium(*count);
    }
    Ok(total)
}

/// Components are alike when they share a type, so each type forms its own blocks.
fn alike_component_counts(items: &[Item]) -> BTreeMap<&str, usize> {
    let mut counts = BTreeMap::new();
    for item in items.iter().filter(|item| is_component(&item.item_type)) {
        *counts.entry(item.item_type.as_str()).or_insert(0) += 1;
    }
    counts
}

/// A building block of 3 alike components is offered at a special base premium.
fn components_base_premium(count: usize) -> f64 {
    if count == COMPONENT_BLOCK_SIZE {
        return COMPONENT_BLOCK_BASE_PREMIUM;
    }
    count as f64 * COMPONENT_BASE_PREMIUM
}

/// Components such as runes and moonstones share one tariff, unlike main items.
fn is_component(item_type: &str) -> bool {
    matches!(item_type, "rune" | "moonstone")
}

fn base_premium(item: &Item) -> Result<f64, String> {
    Ok(price_list_entry(&item.item_type)?.base_premium)
}

/// One row of the MHPCO price list.
struct PriceListEntry {
    insurance_value: u64,
    base_premium: f64,
}

const COMPONENT_INSURANCE_VALUE: u64 = 250;

fn price_list_entry(item_type: &str) -> Result<PriceListEntry, String> {
    if is_component(item_type) {
        return Ok(PriceListEntry {
            insurance_value: COMPONENT_INSURANCE_VALUE,
            base_premium: COMPONENT_BASE_PREMIUM,
        });
    }
    let (insurance_value, base_premium) = match item_type {
        "sword" => (1000, 100.0),
        "amulet" => (600, 60.0),
        "staff" => (800, 80.0),
        "potion" => (400, 40.0),
        unknown => {
            return Err(format!("the MHPCO does not insure items of type {unknown}"));
        }
    };
    Ok(PriceListEntry {
        insurance_value,
        base_premium,
    })
}

pub struct Scenario {
    pub customer: Customer,
    pub steps: Vec<Step>,
}

pub enum Step {
    Quote {
        items: Vec<Item>,
    },
    Claim {
        policy: usize,
        incident: Incident,
    },
}

pub struct Incident {
    pub cause: String,
    pub damages: Vec<Damage>,
}

pub struct Damage {
    pub item_type: String,
    pub amount: i64,
}

#[derive(Debug, PartialEq, Eq)]
pub enum StepResult {
    Quote { premium: u64 },
    Claim { payout: u64, remaining_cap: u64 },
}

/// Steps are processed sequentially; later steps see the customer's history.
pub fn run_scenario(scenario: &Scenario) -> Result<Vec<StepResult>, String> {
    let mut results = Vec::new();
    let mut contracts_so_far = 0;
    let mut policies: BTreeMap<usize, Policy> = BTreeMap::new();
    for (index, step) in scenario.steps.iter().enumerate() {
        match step {
            Step::Quote { items } => {
                results.push(StepResult::Quote {
                    premium: quote_contract(&scenario.customer, items, contracts_so_far)?,
                });
                contracts_so_far += 1;
                policies.insert(index, Policy::covering(items)?);
            }
            Step::Claim { policy, incident } => {
                let policy = policies
                    .get_mut(policy)
                    .ok_or_else(|| format!("step {policy} did not create a policy"))?;
                let payout = policy.settle(incident)?;
                results.push(StepResult::Claim {
                    payout,
                    remaining_cap: policy.remaining_cap,
                });
            }
        }
    }
    Ok(results)
}

const CAP_MULTIPLE_OF_INSURANCE_SUM: u64 = 2;

/// A policy covers items up to twice their insurance sum in total payouts.
struct Policy {
    insured_items: Vec<Item>,
    remaining_cap: u64,
}

const DEDUCTIBLE_PER_DAMAGE: f64 = 100.0;

impl Policy {
    /// Each damage entry is a separate damage to a separate insured item, so a
    /// type cannot be damaged more often than the policy covers it.
    fn reject_damages_beyond_cover(&self, incident: &Incident) -> Result<(), String> {
        let mut damaged_per_type: BTreeMap<&str, usize> = BTreeMap::new();
        for damage in &incident.damages {
            *damaged_per_type.entry(&damage.item_type).or_insert(0) += 1;
        }
        let beyond_cover = damaged_per_type
            .into_iter()
            .find(|(item_type, damaged)| *damaged > self.items_covered_of_type(item_type));
        match beyond_cover {
            Some((item_type, _)) => Err(format!(
                "the policy covers fewer items of type {item_type} than the claim reports damaged"
            )),
            None => Ok(()),
        }
    }

    fn items_covered_of_type(&self, item_type: &str) -> usize {
        self.insured_items
            .iter()
            .filter(|item| item.item_type == item_type)
            .count()
    }

    /// The insured item a damage refers to; the MHPCO pays for insured items only.
    fn insured_item_for(&self, damage: &Damage) -> Result<&Item, String> {
        self.insured_items
            .iter()
            .find(|item| item.item_type == damage.item_type)
            .ok_or_else(|| {
                format!(
                    "the policy does not cover an item of type {}",
                    damage.item_type
                )
            })
    }

    /// Pays every damage of an incident, up to the cap the policy has left.
    fn settle(&mut self, incident: &Incident) -> Result<u64, String> {
        reject_negative_damages(incident)?;
        self.reject_damages_beyond_cover(incident)?;
        let mut reimbursed = 0.0;
        for damage in &incident.damages {
            reimbursed += reimbursement(damage, self.insured_item_for(damage)?);
        }
        let desired = round_in_claimants_disfavour(reimbursed);
        let payout = desired.min(self.remaining_cap);
        self.remaining_cap -= payout;
        Ok(payout)
    }

    fn covering(items: &[Item]) -> Result<Self, String> {
        let mut insurance_sum = 0;
        for item in items {
            insurance_sum += insurance_value(item)?;
        }
        Ok(Policy {
            insured_items: items.to_vec(),
            remaining_cap: insurance_sum * CAP_MULTIPLE_OF_INSURANCE_SUM,
        })
    }
}

fn insurance_value(item: &Item) -> Result<u64, String> {
    Ok(price_list_entry(&item.item_type)?.insurance_value)
}

pub fn quote(customer: &Customer, items: &[Item]) -> u64 {
    quote_contract(customer, items, 0).expect("the items are insurable")
}

fn quote_contract(
    customer: &Customer,
    items: &[Item],
    contracts_so_far: u32,
) -> Result<u64, String> {
    let base = policy_base_premium(items)?;
    let premium = base
        + item_risk_surcharges(items)?
        + base * policy_modifier_rate(customer, contracts_so_far);
    Ok(round_in_mhpcos_favour(premium + PROCESSING_FEE))
}

const LOYALTY_DISCOUNT: f64 = 0.20;
const LOYALTY_THRESHOLD_YEARS: u32 = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT: f64 = 0.15;

/// Policy-wide modifiers apply to the sum of all item base premiums.
fn policy_modifier_rate(customer: &Customer, contracts_so_far: u32) -> f64 {
    let mut rate = FIRST_INSURANCE_SURCHARGE;
    if customer.years_with_mhpco >= LOYALTY_THRESHOLD_YEARS {
        rate -= LOYALTY_DISCOUNT;
    }
    if contracts_so_far > 0 {
        rate -= FOLLOW_UP_CONTRACT_DISCOUNT;
    }
    rate
}

const CURSE_SURCHARGE: f64 = 0.50;
const HIGH_ENCHANTMENT_SURCHARGE: f64 = 0.30;
const HIGH_ENCHANTMENT_THRESHOLD: u32 = 5;

/// Item-specific risks are surcharged on the base premium of the affected item.
fn item_risk_surcharges(items: &[Item]) -> Result<f64, String> {
    let mut total = 0.0;
    for item in items {
        total += item_risk_surcharge(item)?;
    }
    Ok(total)
}

fn item_risk_surcharge(item: &Item) -> Result<f64, String> {
    let mut rate = 0.0;
    if item.cursed {
        rate += CURSE_SURCHARGE;
    }
    if item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD {
        rate += HIGH_ENCHANTMENT_SURCHARGE;
    }
    Ok(base_premium(item)? * rate)
}

#[cfg(test)]
mod tests {
    use super::*;

    // ---- Premium: base price list ----

    #[test]
    fn empty_item_list_costs_only_the_processing_fee() {
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &[]), 5);
    }

    #[test]
    fn sword_has_base_premium_of_100() {
        let sword = item_of_type("sword");
        // 100 G base + 10 G first insurance + 5 G fee, no loyalty at 0 years
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &[sword]), 115);
    }

    #[test]
    fn amulet_has_base_premium_of_60() {
        let amulet = item_of_type("amulet");
        // 60 G base + 6 G first insurance + 5 G fee
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &[amulet]), 71);
    }

    #[test]
    fn staff_has_base_premium_of_80() {
        let staff = item_of_type("staff");
        // 80 G base + 8 G first insurance + 5 G fee
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &[staff]), 93);
    }

    #[test]
    fn potion_has_base_premium_of_40() {
        let potion = item_of_type("potion");
        // 40 G base + 4 G first insurance + 5 G fee
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &[potion]), 49);
    }

    #[test]
    fn rune_has_component_base_premium_of_25() {
        let rune = item_of_type("rune");
        // 25 G base + 2.5 G first insurance + 5 G fee = 32.5 G, rounded up
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &[rune]), 33);
    }

    #[test]
    fn moonstone_has_component_base_premium_of_25() {
        let moonstone = item_of_type("moonstone");
        // 25 G base + 2.5 G first insurance + 5 G fee = 32.5 G, rounded up
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &[moonstone]), 33);
    }

    // ---- Premium: component building block of 3 alike ----

    #[test]
    fn two_runes_cost_50() {
        let runes = [rune(), rune()];
        // 50 G base + 5 G first insurance + 5 G fee
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &runes), 60);
    }

    fn sword() -> Item {
        item_of_type("sword")
    }

    fn rune() -> Item {
        item_of_type("rune")
    }

    #[test]
    fn three_runes_form_a_block_costing_60() {
        let runes = [rune(), rune(), rune()];
        // 60 G block base + 6 G first insurance + 5 G fee
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &runes), 71);
    }

    #[test]
    fn four_runes_cost_100_because_the_block_requires_exactly_three() {
        let runes = [rune(), rune(), rune(), rune()];
        // 100 G base + 10 G first insurance + 5 G fee
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &runes), 115);
    }

    #[test]
    fn seven_runes_cost_175() {
        let runes = [rune(), rune(), rune(), rune(), rune(), rune(), rune()];
        // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G, rounded up
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &runes), 198);
    }

    #[test]
    fn mixed_component_types_do_not_form_a_block() {
        let components = [rune(), rune(), moonstone()];
        // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 G, rounded up
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &components), 88);
    }

    fn moonstone() -> Item {
        item_of_type("moonstone")
    }

    fn item_of_type(item_type: &str) -> Item {
        Item {
            item_type: item_type.to_string(),
            cursed: false,
            enchantment: 0,
            material: String::new(),
        }
    }

    #[test]
    fn two_separate_component_types_form_two_blocks() {
        let components = [rune(), rune(), rune(), moonstone(), moonstone(), moonstone()];
        // 120 G base + 12 G first insurance + 5 G fee
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &components), 137);
    }

    // ---- Premium: item-specific modifiers ----

    #[test]
    fn cursed_item_adds_a_50_percent_risk_surcharge() {
        let cursed_sword = Item { cursed: true, ..sword() };
        // 100 G base + 50 G curse + 10 G first insurance + 5 G fee
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &[cursed_sword]), 165);
    }

    #[test]
    fn enchantment_of_exactly_5_adds_a_30_percent_surcharge() {
        let enchanted_sword = Item { enchantment: 5, ..sword() };
        // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &[enchanted_sword]), 145);
    }

    #[test]
    fn enchantment_of_4_adds_no_surcharge() {
        let sword = Item { enchantment: 4, ..sword() };
        // 100 G base + 10 G first insurance + 5 G fee
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &[sword]), 115);
    }

    #[test]
    fn curse_and_high_enchantment_surcharges_stack() {
        let sword = Item { cursed: true, enchantment: 5, ..sword() };
        // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance + 5 G fee
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &[sword]), 195);
    }

    #[test]
    fn item_modifiers_apply_only_to_the_affected_items_base_premium() {
        let items = [Item { cursed: true, ..sword() }, item_of_type("amulet")];
        // 160 G base + 50 G curse (50 % of the sword only) + 16 G first insurance + 5 G fee
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &items), 231);
    }

    // ---- Premium: policy-wide modifiers ----

    #[test]
    fn exactly_two_years_with_mhpco_grants_the_loyalty_discount() {
        // 100 G base - 20 G loyalty + 10 G first insurance + 5 G fee
        assert_eq!(quote(&Customer { years_with_mhpco: 2 }, &[sword()]), 95);
    }

    #[test]
    fn fewer_than_two_years_grants_no_loyalty_discount() {
        // 100 G base + 10 G first insurance + 5 G fee, no discount after 1 year
        assert_eq!(quote(&Customer { years_with_mhpco: 1 }, &[sword()]), 115);
    }

    #[test]
    fn a_first_insurance_adds_a_10_percent_assessment_surcharge() {
        let items = [sword(), item_of_type("amulet")];
        // 160 G base + 16 G first insurance (10 % of the policy base) + 5 G fee
        assert_eq!(quote(&Customer { years_with_mhpco: 0 }, &items), 181);
    }

    #[test]
    fn each_contract_after_the_first_receives_a_15_percent_discount() {
        let scenario = Scenario {
            customer: Customer { years_with_mhpco: 0 },
            steps: vec![
                Step::Quote { items: vec![sword()] },
                Step::Quote { items: vec![sword()] },
            ],
        };
        let results = run_scenario(&scenario).expect("the scenario is valid");
        // first contract: 100 + 10 + 5; second: 100 + 10 - 15 + 5
        assert_eq!(results, vec![StepResult::Quote { premium: 115 }, StepResult::Quote { premium: 100 }]);
    }

    #[test]
    fn the_first_insurance_surcharge_applies_to_every_quote() {
        let scenario = Scenario {
            customer: Customer { years_with_mhpco: 3 },
            steps: vec![
                Step::Quote { items: vec![sword()] },
                Step::Quote { items: vec![Item { cursed: true, enchantment: 7, ..sword() }] },
            ],
        };
        let results = run_scenario(&scenario).expect("the scenario is valid");
        // second contract: 100 base + 50 curse + 30 enchantment - 20 loyalty
        // + 10 first insurance - 15 follow-up + 5 fee
        assert_eq!(results[1], StepResult::Quote { premium: 160 });
    }

    #[test]
    fn the_processing_fee_is_added_last() {
        let discounted = quote(&Customer { years_with_mhpco: 2 }, &[sword()]);
        let undiscounted = quote(&Customer { years_with_mhpco: 0 }, &[sword()]);
        // the 20 % loyalty discount reduces the premium by 20 G, never the 5 G fee
        assert_eq!(undiscounted - discounted, 20);
    }

    // ---- Premium: rounding ----

    #[test]
    fn a_fractional_premium_is_rounded_up() {
        // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G
        assert_eq!(round_in_mhpcos_favour(197.5), 198);
    }

    #[test]
    fn only_the_final_premium_is_rounded() {
        // Three quarter-runes' worth of fractions survive until the end:
        // 25 G base - 5 G loyalty + 2.5 G first insurance = 22.5 G, + 5 G fee = 27.5 G.
        // Rounding the 22.5 G intermediate first would also yield 28 G, so the
        // discriminating observation is that a fraction below .5 still rounds up.
        assert_eq!(quote(&Customer { years_with_mhpco: 2 }, &[rune()]), 28);
        assert_eq!(round_in_mhpcos_favour(27.1), 28);
    }

    // ---- Premium: integration examples ----

    #[test]
    fn newcomer_with_a_cursed_sword_pays_165() {
        let scenario = Scenario {
            customer: Customer { years_with_mhpco: 0 },
            steps: vec![Step::Quote {
                items: vec![Item { cursed: true, enchantment: 3, ..sword() }],
            }],
        };
        let results = run_scenario(&scenario).expect("the scenario is valid");
        // 100 G base + 50 G curse + 10 G first insurance + 5 G fee
        assert_eq!(results, vec![StepResult::Quote { premium: 165 }]);
    }

    #[test]
    fn long_standing_customers_second_contract_costs_160() {
        let scenario = Scenario {
            customer: Customer { years_with_mhpco: 3 },
            steps: vec![
                Step::Quote { items: vec![item_of_type("potion")] },
                Step::Quote {
                    items: vec![Item { cursed: true, enchantment: 7, ..sword() }],
                },
            ],
        };
        let results = run_scenario(&scenario).expect("the scenario is valid");
        // 100 + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance
        // - 15 follow-up + 5 fee
        assert_eq!(results[1], StepResult::Quote { premium: 160 });
    }

    // ---- Premium: rejection ----

    #[test]
    fn a_quote_with_an_unknown_item_type_is_rejected() {
        let scenario = Scenario {
            customer: Customer { years_with_mhpco: 0 },
            steps: vec![Step::Quote { items: vec![item_of_type("broomstick")] }],
        };
        let error = run_scenario(&scenario).expect_err("an unknown item type is rejected");
        assert!(error.contains("broomstick"), "the error names the item: {error}");
    }

    // ---- Claim: insurance sum and cap ----

    #[test]
    fn a_policys_cap_is_twice_its_insurance_sum() {
        let results = run(vec![
            Step::Quote { items: vec![sword()] },
            claim_of(0, &[("sword", 100)]),
        ]);
        // insurance sum 1000 G, cap 2000 G; the 100 G damage is fully absorbed
        // by the deductible, so the whole cap remains
        assert_eq!(results[1], StepResult::Claim { payout: 0, remaining_cap: 2000 });
    }

    fn run(steps: Vec<Step>) -> Vec<StepResult> {
        let scenario = Scenario { customer: Customer { years_with_mhpco: 0 }, steps };
        run_scenario(&scenario).expect("the scenario is valid")
    }

    fn claim_of(policy: usize, damages: &[(&str, i64)]) -> Step {
        Step::Claim {
            policy,
            incident: Incident {
                cause: "dragon attack".to_string(),
                damages: damages
                    .iter()
                    .map(|(item_type, amount)| Damage {
                        item_type: item_type.to_string(),
                        amount: *amount,
                    })
                    .collect(),
            },
        }
    }

    #[test]
    fn the_insurance_sum_adds_up_the_items_insurance_values() {
        let results = run(vec![
            Step::Quote { items: vec![sword(), item_of_type("amulet")] },
            claim_of(0, &[("sword", 100)]),
        ]);
        // insurance sum 1000 + 600 = 1600 G, cap 3200 G
        assert_eq!(results[1], StepResult::Claim { payout: 0, remaining_cap: 3200 });
    }

    #[test]
    fn two_swords_double_the_insurance_sum() {
        let results = run(vec![
            Step::Quote { items: vec![sword(), sword()] },
            claim_of(0, &[("sword", 100)]),
        ]);
        // insurance sum 2 x 1000 = 2000 G, cap 4000 G
        assert_eq!(results[1], StepResult::Claim { payout: 0, remaining_cap: 4000 });
    }

    #[test]
    fn the_block_discount_does_not_reduce_the_insurance_sum() {
        let results = run(vec![
            Step::Quote { items: vec![sword(), rune(), rune(), rune()] },
            claim_of(0, &[("sword", 100)]),
        ]);
        // insurance sum 1000 + 3 x 250 = 1750 G, cap 3500 G despite the block tariff
        assert_eq!(results[1], StepResult::Claim { payout: 0, remaining_cap: 3500 });
    }

    #[test]
    fn premium_modifiers_do_not_raise_the_cap() {
        let results = run(vec![
            Step::Quote { items: vec![Item { cursed: true, ..sword() }] },
            claim_of(0, &[("sword", 100)]),
        ]);
        // premium with modifiers is 165 G, but the cap rests on the unmodified 1000 G
        assert_eq!(results[1], StepResult::Claim { payout: 0, remaining_cap: 2000 });
    }

    // ---- Claim: payout rules ----

    #[test]
    fn a_standard_damage_is_reimbursed_in_full_minus_the_deductible() {
        let results = run(vec![
            Step::Quote { items: vec![steel_sword()] },
            claim_of(0, &[("sword", 500)]),
        ]);
        // 500 G damage - 100 G deductible = 400 G; cap 2000 - 400 = 1600 G
        assert_eq!(results[1], StepResult::Claim { payout: 400, remaining_cap: 1600 });
    }

    fn steel_sword() -> Item {
        Item { material: "steel".to_string(), enchantment: 3, ..sword() }
    }

    #[test]
    fn a_component_damage_has_no_special_clause() {
        let results = run(vec![
            Step::Quote { items: vec![rune()] },
            claim_of(0, &[("rune", 200)]),
        ]);
        // 200 G damage - 100 G deductible = 100 G; cap 500 - 100 = 400 G
        assert_eq!(results[1], StepResult::Claim { payout: 100, remaining_cap: 400 });
    }

    #[test]
    fn enchantment_of_at_least_8_halves_the_damage_before_the_deductible() {
        let sword = Item { material: "steel".to_string(), enchantment: 9, ..sword() };
        let results = run(vec![
            Step::Quote { items: vec![sword] },
            claim_of(0, &[("sword", 1000)]),
        ]);
        // 50 % of 1000 G = 500 G, less the 100 G deductible = 400 G
        assert_eq!(results[1], StepResult::Claim { payout: 400, remaining_cap: 1600 });
    }

    #[test]
    fn enchantment_of_exactly_8_triggers_the_half_reimbursement() {
        let results = run(vec![
            Step::Quote { items: vec![dragon_sword(8)] },
            claim_of(0, &[("sword", 1000)]),
        ]);
        // the high-enchantment clause applies first, then the deductible
        assert_eq!(results[1], StepResult::Claim { payout: 400, remaining_cap: 1600 });
    }

    fn dragon_sword(enchantment: u32) -> Item {
        Item { material: "dragon".to_string(), enchantment, ..sword() }
    }

    #[test]
    fn dragon_material_alone_is_fully_reimbursed() {
        let results = run(vec![
            Step::Quote { items: vec![dragon_sword(5)] },
            claim_of(0, &[("sword", 800)]),
        ]);
        // full reimbursement, then the deductible: 800 - 100 = 700 G
        assert_eq!(results[1], StepResult::Claim { payout: 700, remaining_cap: 1300 });
    }

    #[test]
    fn the_half_reimbursement_wins_over_dragon_material() {
        let results = run(vec![
            Step::Quote { items: vec![dragon_sword(9)] },
            claim_of(0, &[("sword", 1000)]),
        ]);
        // both clauses apply; the 50 % rule wins, then the deductible: 500 - 100
        assert_eq!(results[1], StepResult::Claim { payout: 400, remaining_cap: 1600 });
    }

    #[test]
    fn the_deductible_applies_once_per_damage_entry() {
        let results = run(vec![
            Step::Quote { items: vec![steel_sword(), item_of_type("amulet")] },
            claim_of(0, &[("sword", 500), ("amulet", 300)]),
        ]);
        // (500 - 100) + (300 - 100) = 600 G; cap 3200 - 600 = 2600 G
        assert_eq!(results[1], StepResult::Claim { payout: 600, remaining_cap: 2600 });
    }

    #[test]
    fn two_entries_of_the_same_item_type_are_separate_damages() {
        let results = run(vec![
            Step::Quote { items: vec![steel_sword(), steel_sword()] },
            claim_of(0, &[("sword", 600), ("sword", 600)]),
        ]);
        // each entry is a separate damage with its own deductible: 500 + 500
        assert_eq!(results[1], StepResult::Claim { payout: 1000, remaining_cap: 3000 });
    }

    #[test]
    fn a_damage_below_the_deductible_pays_out_nothing() {
        let results = run(vec![
            Step::Quote { items: vec![steel_sword()] },
            claim_of(0, &[("sword", 60)]),
        ]);
        // 60 G is below the 100 G deductible; the MHPCO pays nothing and the cap stands
        assert_eq!(results[1], StepResult::Claim { payout: 0, remaining_cap: 2000 });
    }

    // ---- Claim: cap exhaustion ----

    #[test]
    fn a_claim_reduces_the_remaining_cap() {
        let results = run(vec![
            Step::Quote { items: vec![steel_sword()] },
            claim_of(0, &[("sword", 1500)]),
        ]);
        // 1500 - 100 = 1400 G paid out of a 2000 G cap, leaving 600 G
        assert_eq!(results[1], StepResult::Claim { payout: 1400, remaining_cap: 600 });
    }

    #[test]
    fn a_claim_is_limited_to_the_remaining_cap() {
        let results = run(vec![
            Step::Quote { items: vec![steel_sword()] },
            claim_of(0, &[("sword", 1500)]),
            claim_of(0, &[("sword", 1500)]),
        ]);
        // the desired 1400 G is reduced to the 600 G cap that remains
        assert_eq!(results[2], StepResult::Claim { payout: 600, remaining_cap: 0 });
    }

    // ---- Claim: rounding ----

    #[test]
    fn a_fractional_payout_is_rounded_down() {
        assert_eq!(round_in_claimants_disfavour(350.5), 350);
        // half of an odd damage is fractional: 901 / 2 = 450.5, less 100 = 350.5
        let results = run(vec![
            Step::Quote { items: vec![dragon_sword(9)] },
            claim_of(0, &[("sword", 901)]),
        ]);
        assert_eq!(results[1], StepResult::Claim { payout: 350, remaining_cap: 1650 });
    }

    // ---- Claim: rejection ----

    #[test]
    fn a_damage_to_an_uninsured_item_is_rejected() {
        let scenario = Scenario {
            customer: Customer { years_with_mhpco: 0 },
            steps: vec![
                Step::Quote { items: vec![steel_sword()] },
                claim_of(0, &[("amulet", 300)]),
            ],
        };
        let error = run_scenario(&scenario).expect_err("the amulet is not insured");
        assert!(error.contains("amulet"), "the error names the item: {error}");
    }

    #[test]
    fn a_damage_with_an_unknown_item_type_is_rejected() {
        let scenario = Scenario {
            customer: Customer { years_with_mhpco: 0 },
            steps: vec![
                Step::Quote { items: vec![steel_sword()] },
                claim_of(0, &[("broomstick", 300)]),
            ],
        };
        let error = run_scenario(&scenario).expect_err("a broomstick is not insurable");
        assert!(error.contains("broomstick"), "the error names the item: {error}");
    }

    #[test]
    fn more_damages_of_a_type_than_insured_items_rejects_the_claim() {
        let scenario = Scenario {
            customer: Customer { years_with_mhpco: 0 },
            steps: vec![
                Step::Quote { items: vec![steel_sword()] },
                claim_of(0, &[("sword", 600), ("sword", 600)]),
            ],
        };
        let error = run_scenario(&scenario).expect_err("only one sword is insured");
        assert!(error.contains("sword"), "the error names the item: {error}");
    }

    #[test]
    fn a_negative_damage_amount_is_rejected() {
        let scenario = Scenario {
            customer: Customer { years_with_mhpco: 0 },
            steps: vec![
                Step::Quote { items: vec![steel_sword()] },
                claim_of(0, &[("sword", -200)]),
            ],
        };
        let error = run_scenario(&scenario).expect_err("a damage cannot be negative");
        assert!(error.contains("-200"), "the error names the amount: {error}");
    }

    // ---- Scenario / CLI contract ----

    #[test]
    fn a_scenario_returns_one_result_per_step_in_order() {
        let results = run(vec![
            Step::Quote { items: vec![steel_sword()] },
            claim_of(0, &[("sword", 500)]),
            Step::Quote { items: vec![item_of_type("potion")] },
        ]);
        assert_eq!(
            results,
            vec![
                StepResult::Quote { premium: 115 },
                StepResult::Claim { payout: 400, remaining_cap: 1600 },
                // second contract: 40 + 4 first insurance - 6 follow-up + 5 fee
                StepResult::Quote { premium: 43 },
            ]
        );
    }

    #[test]
    fn a_claim_step_refers_to_its_policy_by_step_index() {
        let results = run(vec![
            Step::Quote { items: vec![steel_sword()] },
            Step::Quote { items: vec![item_of_type("potion")] },
            claim_of(1, &[("potion", 300)]),
        ]);
        // the claim draws on the potion policy of step 1: cap 800, payout 300 - 100
        assert_eq!(results[2], StepResult::Claim { payout: 200, remaining_cap: 600 });
    }

    #[test]
    fn the_scenario_json_round_trips_through_the_documented_shape() {
        let input = r#"{
            "customer": {"yearsWithMHPCO": 5},
            "steps": [
                {"op": "quote", "items": [
                    {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}
                ]},
                {"op": "claim", "policy": 0, "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 200}]
                }}
            ]
        }"#;
        let scenario = parse_scenario(input).expect("the document matches the schema");
        let results = run_scenario(&scenario).expect("the scenario is valid");
        // 60 G base - 12 G loyalty + 6 G first insurance + 5 G fee = 59 G;
        // 200 G damage - 100 G deductible = 100 G, cap 1200 - 100 = 1100 G
        assert_eq!(
            render_results(&results),
            r#"{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}"#
        );
    }
}
