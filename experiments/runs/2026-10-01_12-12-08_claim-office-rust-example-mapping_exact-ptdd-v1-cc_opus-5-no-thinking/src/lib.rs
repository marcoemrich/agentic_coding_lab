use std::collections::HashMap;

pub struct Customer {
    pub years_with_mhpco: i64,
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

pub struct Item {
    pub item_type: String,
    pub cursed: bool,
    pub enchantment: Option<i64>,
    pub material: Option<String>,
}

pub struct Scenario {
    pub customer: Customer,
    pub steps: Vec<Step>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum StepResult {
    Quote {
        premium: i64,
    },
    Claim {
        payout: i64,
        remaining_cap: i64,
    },
}

const PROCESSING_FEE: i64 = 5;
const FIRST_INSURANCE_SURCHARGE_RATE: f64 = 0.10;
const CURSE_SURCHARGE_RATE: f64 = 0.50;
const HIGH_ENCHANTMENT_SURCHARGE_RATE: f64 = 0.30;
const HIGH_ENCHANTMENT_THRESHOLD: i64 = 5;
const LOYALTY_DISCOUNT_RATE: f64 = 0.20;
const LOYALTY_YEARS_THRESHOLD: i64 = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE: f64 = 0.15;
const COMPONENT_INSURANCE_VALUE: i64 = 250;
const DEDUCTIBLE_PER_DAMAGE: i64 = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM: i64 = 2;
const REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD: i64 = 8;
const REDUCED_REIMBURSEMENT_RATE: f64 = 0.50;

const COMPONENT_BASE_PREMIUM: i64 = 25;
const BLOCK_SIZE: usize = 3;
const BLOCK_BASE_PREMIUM: i64 = 60;
const COMPONENT_TYPES: [&str; 2] = ["rune", "moonstone"];

fn is_component(item_type: &str) -> bool {
    COMPONENT_TYPES.contains(&item_type)
}

/// One row of the MHPCO price list for a main item.
struct PriceListRow {
    item_type: &'static str,
    insurance_value: i64,
    base_premium: i64,
}

/// The MHPCO price list. Components are priced by their own rule.
const PRICE_LIST: [PriceListRow; 4] = [
    PriceListRow {
        item_type: "sword",
        insurance_value: 1000,
        base_premium: 100,
    },
    PriceListRow {
        item_type: "amulet",
        insurance_value: 600,
        base_premium: 60,
    },
    PriceListRow {
        item_type: "staff",
        insurance_value: 800,
        base_premium: 80,
    },
    PriceListRow {
        item_type: "potion",
        insurance_value: 400,
        base_premium: 40,
    },
];

fn price_list_row(item_type: &str) -> Option<&'static PriceListRow> {
    PRICE_LIST.iter().find(|row| row.item_type == item_type)
}

fn insurance_value(item_type: &str) -> i64 {
    if is_component(item_type) {
        return COMPONENT_INSURANCE_VALUE;
    }
    price_list_row(item_type).map_or(0, |row| row.insurance_value)
}

fn insurance_sum(items: &[Item]) -> i64 {
    items
        .iter()
        .map(|item| insurance_value(&item.item_type))
        .sum()
}

fn payout_cap(items: &[Item]) -> i64 {
    insurance_sum(items) * CAP_MULTIPLE_OF_INSURANCE_SUM
}

/// The MHPCO insures only the items on its price list.
fn is_insurable(item_type: &str) -> bool {
    is_component(item_type) || price_list_row(item_type).is_some()
}

fn reject_uninsurable_items(items: &[Item]) -> Result<(), String> {
    match items
        .iter()
        .find(|item| !is_insurable(&item.item_type))
    {
        Some(item) => Err(format!("unknown item type: {}", item.item_type)),
        None => Ok(()),
    }
}

fn base_premium(item: &Item) -> i64 {
    if is_component(&item.item_type) {
        return COMPONENT_BASE_PREMIUM;
    }
    price_list_row(&item.item_type).map_or(0, |row| row.base_premium)
}

fn is_highly_enchanted(item: &Item) -> bool {
    item.enchantment
        .is_some_and(|level| level >= HIGH_ENCHANTMENT_THRESHOLD)
}

fn item_modifiers(item: &Item) -> f64 {
    let item_base = base_premium(item) as f64;
    let mut surcharges = 0.0;
    if item.cursed {
        surcharges += item_base * CURSE_SURCHARGE_RATE;
    }
    if is_highly_enchanted(item) {
        surcharges += item_base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
    surcharges
}

/// What the customer has earned with MHPCO by the time a contract is quoted.
struct CustomerStanding {
    years_with_mhpco: i64,
    contracts_already_signed: usize,
}

impl CustomerStanding {
    fn is_long_standing(&self) -> bool {
        self.years_with_mhpco >= LOYALTY_YEARS_THRESHOLD
    }

    fn is_follow_up_contract(&self) -> bool {
        self.contracts_already_signed > 0
    }
}

/// The MHPCO rounds to whole G in its own favor: premiums up, payouts down.
fn round_premium_in_mhpco_favor(amount: f64) -> i64 {
    amount.ceil() as i64
}

fn round_payout_in_mhpco_favor(amount: f64) -> i64 {
    amount.floor() as i64
}

fn policy_modifiers(policy_base: f64, standing: &CustomerStanding) -> f64 {
    let mut modifiers = policy_base * FIRST_INSURANCE_SURCHARGE_RATE;
    if standing.is_long_standing() {
        modifiers -= policy_base * LOYALTY_DISCOUNT_RATE;
    }
    if standing.is_follow_up_contract() {
        modifiers -= policy_base * FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
    }
    modifiers
}

fn alike_components_base_premium(count: usize) -> i64 {
    if count == BLOCK_SIZE {
        BLOCK_BASE_PREMIUM
    } else {
        count as i64 * COMPONENT_BASE_PREMIUM
    }
}

fn components_base_premium(items: &[Item]) -> i64 {
    COMPONENT_TYPES
        .iter()
        .map(|component_type| {
            let count = items
                .iter()
                .filter(|item| item.item_type == *component_type)
                .count();
            alike_components_base_premium(count)
        })
        .sum()
}

fn premium(items: &[Item], standing: &CustomerStanding) -> Result<i64, String> {
    reject_uninsurable_items(items)?;
    let main_items_base: i64 = items
        .iter()
        .filter(|item| !is_component(&item.item_type))
        .map(base_premium)
        .sum();
    let policy_base = main_items_base + components_base_premium(items);
    let policy_base = policy_base as f64;
    let item_surcharges: f64 = items.iter().map(item_modifiers).sum();
    let total = policy_base
        + item_surcharges
        + policy_modifiers(policy_base, standing)
        + PROCESSING_FEE as f64;
    Ok(round_premium_in_mhpco_favor(total))
}

/// What the MHPCO pays for one incident against a policy, and the cap left afterwards.
struct Settlement {
    payout: i64,
    remaining_cap: i64,
}

/// Damage to a deeply enchanted item is reimbursed at half its amount.
fn has_reduced_reimbursement(item: &Item) -> bool {
    item.enchantment
        .is_some_and(|level| level >= REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD)
}

/// Damage to a dragon-material item is fully reimbursed, which is already the
/// default; and where an item is both dragon-material and deeply enchanted the
/// 50 % rule wins. The dragon-material clause therefore never changes a payout
/// and needs no branch of its own.
fn reimbursement(item: &Item, damage: &Damage) -> i64 {
    let mut reimbursed = damage.amount as f64;
    if has_reduced_reimbursement(item) {
        reimbursed *= REDUCED_REIMBURSEMENT_RATE;
    }
    (round_payout_in_mhpco_favor(reimbursed) - DEDUCTIBLE_PER_DAMAGE).max(0)
}

/// Pairs every damage entry with the insured item it hit. Each insured item
/// answers for at most one damage entry, so the MHPCO rejects the whole claim
/// when the damages name an item the policy does not cover, or name it more
/// often than the policy covers it.
fn damaged_items<'a>(
    items: &'a [Item],
    damages: &'a [Damage],
) -> Result<Vec<(&'a Item, &'a Damage)>, String> {
    let mut unclaimed: Vec<&Item> = items.iter().collect();
    damages
        .iter()
        .map(|damage| {
            let position = unclaimed
                .iter()
                .position(|item| item.item_type == damage.item_type)
                .ok_or_else(|| format!("policy does not cover a damaged {}", damage.item_type))?;
            Ok((unclaimed.remove(position), damage))
        })
        .collect()
}

/// A damage report must state a loss, never a gain.
fn reject_negative_damages(damages: &[Damage]) -> Result<(), String> {
    match damages.iter().find(|damage| damage.amount < 0) {
        Some(damage) => Err(format!("damage amount must not be negative: {}", damage.amount)),
        None => Ok(()),
    }
}

fn settle_claim(
    items: &[Item],
    incident: &Incident,
    remaining_cap: i64,
) -> Result<Settlement, String> {
    reject_negative_damages(&incident.damages)?;
    let reimbursed: i64 = damaged_items(items, &incident.damages)?
        .iter()
        .map(|(item, damage)| reimbursement(item, damage))
        .sum();
    let payout = reimbursed.min(remaining_cap);
    Ok(Settlement {
        payout,
        remaining_cap: remaining_cap - payout,
    })
}

/// How much cover each policy has left after the claims settled against it.
#[derive(Default)]
struct PolicyLedger {
    remaining_cap: HashMap<usize, i64>,
}

impl PolicyLedger {
    fn remaining_cap(&mut self, policy: usize, items: &[Item]) -> i64 {
        *self
            .remaining_cap
            .entry(policy)
            .or_insert_with(|| payout_cap(items))
    }

    fn record(&mut self, policy: usize, remaining_cap: i64) {
        self.remaining_cap.insert(policy, remaining_cap);
    }
}

/// The items a claim's referenced policy covers.
fn insured_items(scenario: &Scenario, policy: usize) -> Result<&[Item], String> {
    match scenario.steps.get(policy) {
        Some(Step::Quote { items }) => Ok(items),
        _ => Err(format!("step {policy} did not create a policy")),
    }
}

pub fn run_scenario(scenario: &Scenario) -> Result<Vec<StepResult>, String> {
    let mut results = Vec::new();
    let mut contracts = 0;
    let mut ledger = PolicyLedger::default();
    for step in &scenario.steps {
        match step {
            Step::Quote { items } => {
                let standing = CustomerStanding {
                    years_with_mhpco: scenario.customer.years_with_mhpco,
                    contracts_already_signed: contracts,
                };
                results.push(StepResult::Quote {
                    premium: premium(items, &standing)?,
                });
                contracts += 1;
            }
            Step::Claim { policy, incident } => {
                let items = insured_items(scenario, *policy)?;
                let remaining_cap = ledger.remaining_cap(*policy, items);
                let settlement = settle_claim(items, incident, remaining_cap)?;
                ledger.record(*policy, settlement.remaining_cap);
                results.push(StepResult::Claim {
                    payout: settlement.payout,
                    remaining_cap: settlement.remaining_cap,
                });
            }
        }
    }
    Ok(results)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn item(item_type: &str) -> Item {
        Item {
            item_type: item_type.to_string(),
            cursed: false,
            enchantment: None,
            material: None,
        }
    }

    fn claim_step(policy: usize, damages: Vec<Damage>) -> Step {
        Step::Claim {
            policy,
            incident: Incident {
                cause: "dragon attack".to_string(),
                damages,
            },
        }
    }

    fn scenario_results(years_with_mhpco: i64, steps: Vec<Step>) -> Vec<StepResult> {
        let scenario = Scenario {
            customer: Customer { years_with_mhpco },
            steps,
        };

        run_scenario(&scenario).expect("scenario is valid")
    }

    /// One quote step followed by one claim that the MHPCO must reject.
    fn claim_error(items: Vec<Item>, damages: Vec<Damage>) -> String {
        let scenario = Scenario {
            customer: Customer { years_with_mhpco: 0 },
            steps: vec![Step::Quote { items }, claim_step(0, damages)],
        };

        run_scenario(&scenario).expect_err("the claim is rejected")
    }

    /// One quote step followed by one claim against it; returns the claim result.
    fn claim_on(items: Vec<Item>, damages: Vec<Damage>) -> StepResult {
        let results = scenario_results(0, vec![Step::Quote { items }, claim_step(0, damages)]);
        results[1].clone()
    }

    fn damage(item_type: &str, amount: i64) -> Damage {
        Damage {
            item_type: item_type.to_string(),
            amount,
        }
    }

    fn quote_premium(years_with_mhpco: i64, items: Vec<Item>) -> i64 {
        let scenario = Scenario {
            customer: Customer { years_with_mhpco },
            steps: vec![Step::Quote { items }],
        };

        match run_scenario(&scenario).expect("scenario is valid").as_slice() {
            [StepResult::Quote { premium }] => *premium,
            other => panic!("expected one quote result, got {other:?}"),
        }
    }

    // ---- Quote: base premiums per item type ----

    #[test]
    fn empty_item_list_costs_only_the_processing_fee() {
        assert_eq!(quote_premium(0, vec![]), 5);
    }

    #[test]
    fn sword_has_base_premium_of_100_g() {
        assert_eq!(quote_premium(0, vec![item("sword")]), 115);
    }

    #[test]
    fn amulet_has_base_premium_of_60_g() {
        assert_eq!(quote_premium(0, vec![item("amulet")]), 71);
    }

    #[test]
    fn staff_has_base_premium_of_80_g() {
        assert_eq!(quote_premium(0, vec![item("staff")]), 93);
    }

    #[test]
    fn potion_has_base_premium_of_40_g() {
        assert_eq!(quote_premium(0, vec![item("potion")]), 49);
    }

    #[test]
    fn rune_has_base_premium_of_25_g() {
        assert_eq!(quote_premium(0, vec![item("rune")]), 33);
    }

    #[test]
    fn moonstone_has_base_premium_of_25_g() {
        assert_eq!(quote_premium(0, vec![item("moonstone")]), 33);
    }

    // ---- Quote: component building block of exactly 3 alike ----

    #[test]
    fn two_runes_cost_50_g_base_premium() {
        assert_eq!(quote_premium(0, vec![item("rune"), item("rune")]), 60);
    }

    #[test]
    fn three_runes_form_a_block_of_60_g_base_premium() {
        assert_eq!(
            quote_premium(0, vec![item("rune"), item("rune"), item("rune")]),
            71
        );
    }

    #[test]
    fn four_runes_get_no_block_and_cost_100_g_base_premium() {
        assert_eq!(
            quote_premium(
                0,
                vec![item("rune"), item("rune"), item("rune"), item("rune")]
            ),
            115
        );
    }

    #[test]
    fn seven_runes_cost_175_g_base_premium() {
        let runes = (0..7).map(|_| item("rune")).collect();

        assert_eq!(quote_premium(0, runes), 198);
    }

    #[test]
    fn different_component_types_do_not_form_a_block() {
        assert_eq!(
            quote_premium(0, vec![item("rune"), item("rune"), item("moonstone")]),
            88
        );
    }

    #[test]
    fn each_component_type_forms_its_own_block() {
        let items = vec![
            item("rune"),
            item("rune"),
            item("rune"),
            item("moonstone"),
            item("moonstone"),
            item("moonstone"),
        ];

        assert_eq!(quote_premium(0, items), 137);
    }

    // ---- Quote: item-specific modifiers ----

    #[test]
    fn cursed_item_adds_a_50_percent_risk_surcharge() {
        let cursed_sword = Item {
            cursed: true,
            ..item("sword")
        };

        assert_eq!(quote_premium(0, vec![cursed_sword]), 165);
    }

    #[test]
    fn enchantment_of_exactly_5_adds_a_30_percent_surcharge() {
        let enchanted_sword = Item {
            enchantment: Some(5),
            ..item("sword")
        };

        assert_eq!(quote_premium(0, vec![enchanted_sword]), 145);
    }

    #[test]
    fn enchantment_of_4_adds_no_high_enchantment_surcharge() {
        let sword = Item {
            enchantment: Some(4),
            ..item("sword")
        };

        assert_eq!(quote_premium(0, vec![sword]), 115);
    }

    #[test]
    fn cursed_and_highly_enchanted_item_gets_both_surcharges() {
        let sword = Item {
            cursed: true,
            enchantment: Some(5),
            ..item("sword")
        };

        assert_eq!(quote_premium(0, vec![sword]), 195);
    }

    #[test]
    fn item_surcharge_applies_only_to_the_affected_items_base_premium() {
        let cursed_sword = Item {
            cursed: true,
            ..item("sword")
        };

        assert_eq!(quote_premium(0, vec![cursed_sword, item("amulet")]), 231);
    }

    // ---- Quote: policy-wide modifiers ----

    #[test]
    fn first_insurance_adds_a_10_percent_assessment_surcharge() {
        assert_eq!(quote_premium(0, vec![item("sword"), item("amulet")]), 181);
    }

    #[test]
    fn exactly_two_years_with_mhpco_grants_the_loyalty_discount() {
        assert_eq!(quote_premium(2, vec![item("sword")]), 95);
    }

    #[test]
    fn fewer_than_two_years_grants_no_loyalty_discount() {
        assert_eq!(quote_premium(1, vec![item("sword")]), 115);
    }

    #[test]
    fn each_contract_after_the_first_gets_a_15_percent_discount() {
                let results = scenario_results(
            0,
            vec![
                    Step::Quote {
                        items: vec![item("sword")],
                    },
                    Step::Quote {
                        items: vec![item("sword")],
                    },
                ],
        );

        assert_eq!(
            results,
            vec![
                StepResult::Quote { premium: 115 },
                StepResult::Quote { premium: 100 },
            ]
        );
    }

    #[test]
    fn first_insurance_surcharge_applies_to_every_quote_regardless_of_history() {
        let cursed_sword = Item {
            cursed: true,
            enchantment: Some(7),
            ..item("sword")
        };
                let results = scenario_results(
            3,
            vec![
                    Step::Quote {
                        items: vec![item("amulet")],
                    },
                    Step::Quote {
                        items: vec![cursed_sword],
                    },
                ],
        );

        assert_eq!(results[1], StepResult::Quote { premium: 160 });
    }

    // ---- Quote: rounding in MHPCO's favor ----

    #[test]
    fn a_fractional_premium_rounds_up() {
        // 7 runes: 175 G base + 17.5 G assessment + 5 G fee = 197.5 G
        let runes = (0..7).map(|_| item("rune")).collect();

        assert_eq!(quote_premium(0, runes), 198);
    }

    #[test]
    fn only_the_final_premium_is_rounded() {
        // Follow-up contract for one rune: 25 G base + 2.5 G assessment
        // - 3.75 G follow-up discount + 5 G fee = 28.75 G -> 29 G.
        // Rounding the 2.5 G and 3.75 G modifiers separately would yield 30 G.
                let results = scenario_results(
            0,
            vec![
                    Step::Quote {
                        items: vec![item("rune")],
                    },
                    Step::Quote {
                        items: vec![item("rune")],
                    },
                ],
        );

        assert_eq!(results[1], StepResult::Quote { premium: 29 });
    }

    // ---- Quote: integration examples ----

    #[test]
    fn newcomer_with_a_cursed_sword_pays_165_g() {
        // 100 G base + 50 G curse + 10 G first insurance + 5 G fee
        let cursed_sword = Item {
            cursed: true,
            enchantment: Some(3),
            ..item("sword")
        };

        assert_eq!(quote_premium(0, vec![cursed_sword]), 165);
    }

    #[test]
    fn long_standing_customers_second_contract_pays_160_g() {
        // 100 G base + 50 G curse + 30 G high enchantment - 20 G loyalty
        // + 10 G first insurance - 15 G follow-up contract + 5 G fee
        let cursed_sword = Item {
            cursed: true,
            enchantment: Some(7),
            ..item("sword")
        };
                let results = scenario_results(
            3,
            vec![
                    Step::Quote {
                        items: vec![item("staff")],
                    },
                    Step::Quote {
                        items: vec![cursed_sword],
                    },
                ],
        );

        assert_eq!(results[1], StepResult::Quote { premium: 160 });
    }

    // ---- Quote: rejection ----

    #[test]
    fn quote_with_an_unknown_item_type_is_rejected() {
        // Reading adopted: the library reports the rejection as `Err`; the CLI
        // translates it into a non-zero exit status with stderr output.
        let scenario = Scenario {
            customer: Customer { years_with_mhpco: 0 },
            steps: vec![Step::Quote {
                items: vec![item("broomstick")],
            }],
        };

        let error = run_scenario(&scenario).expect_err("unknown item type is rejected");

        assert!(
            error.contains("broomstick"),
            "error should name the item: {error}"
        );
    }

    // ---- Insurance sum and cap ----

    #[test]
    fn insurance_sum_is_the_sum_of_the_items_insurance_values() {
        // insurance sum 1000 + 600 = 1600 G, so the cap is 3200 G
        let results = scenario_results(
            0,
            vec![
                Step::Quote {
                    items: vec![item("sword"), item("amulet")],
                },
                claim_step(0, vec![damage("sword", 100)]),
            ],
        );

        assert_eq!(
            results[1],
            StepResult::Claim {
                payout: 0,
                remaining_cap: 3200,
            }
        );
    }

    #[test]
    fn premium_modifiers_do_not_raise_the_cap() {
        // The cursed sword's premium is 165 G, but its insurance value stays
        // 1000 G, so the cap is 2000 G.
        let cursed_sword = Item {
            cursed: true,
            ..item("sword")
        };
                let results = scenario_results(
            0,
            vec![
                    Step::Quote {
                        items: vec![cursed_sword],
                    },
                    claim_step(0, vec![damage("sword", 100)]),
                ],
        );

        assert_eq!(
            results,
            vec![
                StepResult::Quote { premium: 165 },
                StepResult::Claim {
                    payout: 0,
                    remaining_cap: 2000,
                },
            ]
        );
    }

    #[test]
    fn the_block_discount_does_not_reduce_the_insurance_sum() {
        // Premium uses the 60 G block, but the insurance sum is
        // 1000 + 3 x 250 = 1750 G, so the cap is 3500 G.
                let results = scenario_results(
            0,
            vec![
                    Step::Quote {
                        items: vec![item("sword"), item("rune"), item("rune"), item("rune")],
                    },
                    claim_step(0, vec![damage("sword", 100)]),
                ],
        );

        assert_eq!(
            results,
            vec![
                StepResult::Quote { premium: 181 },
                StepResult::Claim {
                    payout: 0,
                    remaining_cap: 3500,
                },
            ]
        );
    }

    #[test]
    fn two_items_of_the_same_type_both_count_towards_the_insurance_sum() {
                let results = scenario_results(
            0,
            vec![
                    Step::Quote {
                        items: vec![item("sword"), item("sword")],
                    },
                    claim_step(0, vec![damage("sword", 100)]),
                ],
        );

        assert_eq!(
            results,
            vec![
                StepResult::Quote { premium: 225 },
                StepResult::Claim {
                    payout: 0,
                    remaining_cap: 4000,
                },
            ]
        );
    }

    // ---- Claim: payout rules ----

    #[test]
    fn standard_damage_is_fully_reimbursed_minus_the_deductible() {
        let steel_sword = Item {
            material: Some("steel".to_string()),
            enchantment: Some(3),
            ..item("sword")
        };

        assert_eq!(
            claim_on(vec![steel_sword], vec![damage("sword", 500)]),
            StepResult::Claim {
                payout: 400,
                remaining_cap: 1600,
            }
        );
    }

    #[test]
    fn component_damage_has_no_special_clause() {
        // Rune insurance value 250 G -> cap 500 G; 200 - 100 = 100 G payout.
        assert_eq!(
            claim_on(vec![item("rune")], vec![damage("rune", 200)]),
            StepResult::Claim {
                payout: 100,
                remaining_cap: 400,
            }
        );
    }

    #[test]
    fn high_enchantment_damage_is_reimbursed_at_50_percent() {
        let steel_sword = Item {
            material: Some("steel".to_string()),
            enchantment: Some(9),
            ..item("sword")
        };

        assert_eq!(
            claim_on(vec![steel_sword], vec![damage("sword", 1000)]),
            StepResult::Claim {
                payout: 400,
                remaining_cap: 1600,
            }
        );
    }

    #[test]
    fn enchantment_of_exactly_8_triggers_the_50_percent_clause() {
        let dragon_sword = Item {
            material: Some("dragon".to_string()),
            enchantment: Some(8),
            ..item("sword")
        };

        assert_eq!(
            claim_on(vec![dragon_sword], vec![damage("sword", 1000)]),
            StepResult::Claim {
                payout: 400,
                remaining_cap: 1600,
            }
        );
    }

    #[test]
    fn dragon_material_damage_is_fully_reimbursed() {
        let dragon_sword = Item {
            material: Some("dragon".to_string()),
            enchantment: Some(5),
            ..item("sword")
        };

        assert_eq!(
            claim_on(vec![dragon_sword], vec![damage("sword", 800)]),
            StepResult::Claim {
                payout: 700,
                remaining_cap: 1300,
            }
        );
    }

    #[test]
    fn the_50_percent_clause_wins_over_dragon_material() {
        // Both clauses apply; the 50 % rule wins, then the deductible: 500 - 100.
        let dragon_sword = Item {
            material: Some("dragon".to_string()),
            enchantment: Some(9),
            ..item("sword")
        };

        assert_eq!(
            claim_on(vec![dragon_sword], vec![damage("sword", 1000)]),
            StepResult::Claim {
                payout: 400,
                remaining_cap: 1600,
            }
        );
    }

    #[test]
    fn the_deductible_applies_once_per_damaged_item() {
        // (500 - 100) + (300 - 100) = 600 G; cap 3200 - 600 = 2600 G.
        assert_eq!(
            claim_on(
                vec![item("sword"), item("amulet")],
                vec![damage("sword", 500), damage("amulet", 300)]
            ),
            StepResult::Claim {
                payout: 600,
                remaining_cap: 2600,
            }
        );
    }

    #[test]
    fn repeated_damage_entries_of_one_type_are_separate_damages() {
        // Each entry carries its own deductible: (500 - 100) * 2 = 800 G.
        assert_eq!(
            claim_on(
                vec![item("sword"), item("sword")],
                vec![damage("sword", 500), damage("sword", 500)]
            ),
            StepResult::Claim {
                payout: 800,
                remaining_cap: 3200,
            }
        );
    }

    #[test]
    fn a_fractional_payout_rounds_down() {
        // 901 G damage at 50 % = 450.5 G, less the 100 G deductible = 350.5 G -> 350 G.
        let steel_sword = Item {
            material: Some("steel".to_string()),
            enchantment: Some(9),
            ..item("sword")
        };

        assert_eq!(
            claim_on(vec![steel_sword], vec![damage("sword", 901)]),
            StepResult::Claim {
                payout: 350,
                remaining_cap: 1650,
            }
        );
    }

    // ---- Claim: cap ----

    #[test]
    fn a_claim_reports_the_remaining_cap() {
        // Insurance sum 1000 G -> cap 2000 G; payout 1400 G leaves 600 G.
        assert_eq!(
            claim_on(vec![item("sword")], vec![damage("sword", 1500)]),
            StepResult::Claim {
                payout: 1400,
                remaining_cap: 600,
            }
        );
    }

    #[test]
    fn a_claim_is_limited_to_the_remaining_cap() {
        let claim = || claim_step(0, vec![damage("sword", 1500)]);
        let results = scenario_results(
            0,
            vec![
                Step::Quote {
                    items: vec![item("sword")],
                },
                claim(),
                claim(),
            ],
        );

        assert_eq!(
            results[1..],
            [
                StepResult::Claim {
                    payout: 1400,
                    remaining_cap: 600,
                },
                StepResult::Claim {
                    payout: 600,
                    remaining_cap: 0,
                },
            ]
        );
    }

    // ---- Claim: rejection ----

    #[test]
    fn claim_for_an_item_outside_the_policy_is_rejected() {
        let error = claim_error(vec![item("sword")], vec![damage("amulet", 300)]);

        assert!(error.contains("amulet"), "error should name the item: {error}");
    }

    #[test]
    fn claim_with_an_unknown_item_type_is_rejected() {
        let error = claim_error(vec![item("sword")], vec![damage("broomstick", 300)]);

        assert!(
            error.contains("broomstick"),
            "error should name the item: {error}"
        );
    }

    #[test]
    fn claim_with_more_damages_of_a_type_than_insured_is_rejected() {
        // Two sword damages, but only one sword insured.
        let error = claim_error(
            vec![item("sword")],
            vec![damage("sword", 500), damage("sword", 500)],
        );

        assert!(error.contains("sword"), "error should name the item: {error}");
    }

    #[test]
    fn claim_with_a_negative_damage_amount_is_rejected() {
        let error = claim_error(vec![item("sword")], vec![damage("sword", -200)]);

        assert!(error.contains("-200"), "error should name the amount: {error}");
    }

    // ---- Scenario / CLI contract ----

    #[test]
    fn results_mirror_the_input_steps_in_length_and_order() {
                let results = scenario_results(
            0,
            vec![
                    Step::Quote {
                        items: vec![item("sword")],
                    },
                    claim_step(0, vec![damage("sword", 500)]),
                    Step::Quote {
                        items: vec![item("potion")],
                    },
                ],
        );

        assert_eq!(
            results,
            vec![
                StepResult::Quote { premium: 115 },
                StepResult::Claim {
                    payout: 400,
                    remaining_cap: 1600,
                },
                // follow-up contract: 40 + 4 - 6 + 5 = 43 G
                StepResult::Quote { premium: 43 },
            ]
        );
    }

    #[test]
    fn a_claim_step_refers_to_the_policy_of_an_earlier_quote_step() {
        // The specification's schema example: a 5-year customer insures a
        // silver amulet (60 + 6 - 12 + 5 = 59 G) and claims 200 G of fire
        // damage (200 - 100 = 100 G; cap 1200 - 100 = 1100 G).
        let amulet = Item {
            material: Some("silver".to_string()),
            enchantment: Some(2),
            ..item("amulet")
        };
        let results = scenario_results(
            5,
            vec![
                Step::Quote {
                    items: vec![amulet],
                },
                claim_step(0, vec![damage("amulet", 200)]),
            ],
        );

        assert_eq!(
            results,
            vec![
                StepResult::Quote { premium: 59 },
                StepResult::Claim {
                    payout: 100,
                    remaining_cap: 1100,
                },
            ]
        );
    }
}
