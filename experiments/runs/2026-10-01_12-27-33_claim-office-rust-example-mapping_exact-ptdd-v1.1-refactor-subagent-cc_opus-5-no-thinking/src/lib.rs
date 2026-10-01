mod admissibility;
mod business_done;
mod coverage;
mod pricing;
mod reimbursement;
mod risk;
mod rounding;
mod scenario;
mod settlement_limit;
mod standing;

use admissibility::{refusal_to_insure, refusal_to_settle};
use business_done::BusinessDone;
use coverage::cover_claimed_against;
use pricing::policy_base_premium;
use reimbursement::damage_reimbursement;
use risk::item_risk_surcharges;
use rounding::{round_payout_in_mhpco_favor, round_premium_in_mhpco_favor};
use settlement_limit::PolicyExposure;
use standing::standing_adjustment;

pub use admissibility::Refusal;
pub use scenario::Unreadable;

use scenario::{Results, Scenario, Step, StepResult};

pub struct Customer {
    pub years_with_mhpco: i64,
}

#[derive(Clone)]
pub struct Item {
    pub item_type: String,
    pub material: String,
    pub cursed: bool,
    pub enchantment: i64,
}

const PROCESSING_FEE: i64 = 5;

pub struct Damage {
    pub item_type: String,
    pub amount: i64,
}

pub struct Settlement {
    pub payout: i64,
    pub remaining_cap: i64,
}

pub struct Policy {
    insured: Vec<Item>,
    exposure: PolicyExposure,
}

impl Policy {
    pub fn insuring(items: &[Item]) -> Self {
        Policy {
            exposure: PolicyExposure::on_policy_covering(items),
            insured: items.to_vec(),
        }
    }

    /// What the office settles for an incident: the clauses reimburse each
    /// damage reported, and the policy's remaining exposure decides how much
    /// of that total is actually paid.
    pub fn claim(&mut self, damages: &[Damage]) -> Result<Settlement, Refusal> {
        if let Some(refusal) = refusal_to_settle(&self.insured, damages) {
            return Err(refusal);
        }
        let reimbursed = self.incident_reimbursement(damages);
        Ok(self
            .exposure
            .settle(round_payout_in_mhpco_favor(reimbursed)))
    }

    /// What the office's clauses reimburse for an incident, before its
    /// exposure limit is brought to bear: every damage the incident reported,
    /// each judged against the cover it names.
    fn incident_reimbursement(&self, damages: &[Damage]) -> f64 {
        damages
            .iter()
            .map(|damage| {
                damage_reimbursement(damage, cover_claimed_against(&self.insured, damage))
            })
            .sum()
    }
}

/// How the MHPCO's two kinds of modifier reach the premium: policy-wide
/// modifiers scale the policy base premium, while item-specific modifiers are
/// measured against their own item's base premium and are added alongside, so
/// a curse never surcharges the rest of the policy.
fn premium_before_fee(customer: &Customer, items: &[Item], previous_quotes: usize) -> f64 {
    let base = policy_base_premium(items);
    base + standing_adjustment(base, customer, previous_quotes) + item_risk_surcharges(items)
}

pub fn quote(
    customer: &Customer,
    items: &[Item],
    previous_quotes: usize,
) -> Result<i64, Refusal> {
    if let Some(refusal) = refusal_to_insure(items) {
        return Err(refusal);
    }
    let premium = premium_before_fee(customer, items, previous_quotes);
    Ok(round_premium_in_mhpco_favor(premium) + PROCESSING_FEE)
}

/// Runs a whole scenario: the office reads the steps in order and answers
/// each one, a later claim settling against the policy an earlier quote
/// created.
pub fn run_scenario(document: &str) -> Result<String, Unreadable> {
    let scenario: Scenario =
        serde_json::from_str(document).map_err(|error| Unreadable::Malformed(error.to_string()))?;
    let customer = scenario.customer.customer();

    let mut on_file = BusinessDone::none_yet();
    let mut results = Vec::new();

    for step in &scenario.steps {
        let (result, opened) = answer(step, &customer, &mut on_file)?;
        on_file.record(opened);
        results.push(result);
    }

    serde_json::to_string(&Results { results })
        .map_err(|error| Unreadable::Malformed(error.to_string()))
}

/// The office's answer to one step, and the policy that step opened, if it
/// opened one: a quote opens a policy the customer's later claims may name,
/// and a claim settles against the policy its step named.
///
/// A step is answered against the file as it stood *before* the step, so a
/// claim can only name a policy an earlier step opened; the caller records
/// what this step opened once the answer is given.
fn answer(
    step: &Step,
    customer: &Customer,
    on_file: &mut BusinessDone,
) -> Result<(StepResult, Option<Policy>), Unreadable> {
    match step {
        Step::Quote { items } => {
            let items: Vec<Item> = items.iter().map(|item| item.item()).collect();
            let premium = quote(customer, &items, on_file.quotes_given())?;
            Ok((
                StepResult::Quote { premium },
                Some(Policy::insuring(&items)),
            ))
        }
        Step::Claim { policy, incident } => {
            let damages: Vec<Damage> = incident
                .damages
                .iter()
                .map(|damage| damage.damage())
                .collect();
            let settlement = on_file
                .policy_opened_at(*policy)
                .ok_or_else(|| Unreadable::Malformed(format!("no policy at step {policy}")))?
                .claim(&damages)?;
            Ok((
                StepResult::Claim {
                    payout: settlement.payout,
                    remaining_cap: settlement.remaining_cap,
                },
                None,
            ))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// An insured item of the given type, plain in every respect the MHPCO
    /// judges: ordinary material, uncursed, unenchanted. Each test names only
    /// the properties its own rule turns on.
    fn an_item(item_type: &str) -> ItemBuilder {
        ItemBuilder {
            item_type: item_type.to_string(),
            material: "steel".to_string(),
            cursed: false,
            enchantment: 0,
        }
    }

    struct ItemBuilder {
        item_type: String,
        material: String,
        cursed: bool,
        enchantment: i64,
    }

    impl ItemBuilder {
        fn made_of(mut self, material: &str) -> Self {
            self.material = material.to_string();
            self
        }

        fn cursed(mut self) -> Self {
            self.cursed = true;
            self
        }

        fn enchanted_to(mut self, level: i64) -> Self {
            self.enchantment = level;
            self
        }

        fn build(self) -> Item {
            Item {
                item_type: self.item_type,
                material: self.material,
                cursed: self.cursed,
                enchantment: self.enchantment,
            }
        }
    }

    #[test]
    fn empty_item_list_costs_only_the_processing_fee() {
        let customer = Customer { years_with_mhpco: 0 };
        assert_eq!(quote(&customer, &[], 0).unwrap(), 5);
    }

    #[test]
    fn plain_sword_uses_its_base_premium() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("sword").build()];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 115);
    }

    #[test]
    fn plain_amulet_uses_its_base_premium() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("amulet").build()];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 71);
    }

    #[test]
    fn plain_staff_uses_its_base_premium() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("staff").build()];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 93);
    }

    #[test]
    fn plain_potion_uses_its_base_premium() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("potion").build()];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 49);
    }

    #[test]
    fn single_rune_uses_the_component_base_premium() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("rune").build()];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 33);
    }

    #[test]
    fn single_moonstone_uses_the_component_base_premium() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("moonstone").build()];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 33);
    }

    #[test]
    fn two_runes_cost_fifty() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [
            an_item("rune").build(),
            an_item("rune").build(),
        ];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 60);
    }

    #[test]
    fn three_runes_form_a_block() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [
            an_item("rune").build(),
            an_item("rune").build(),
            an_item("rune").build(),
        ];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 71);
    }

    #[test]
    fn four_runes_do_not_form_a_block() {
        let customer = Customer { years_with_mhpco: 0 };
        let items: Vec<Item> = (0..4)
            .map(|_| an_item("rune").build())
            .collect();
        assert_eq!(quote(&customer, &items, 0).unwrap(), 115);
    }

    #[test]
    fn seven_runes_do_not_form_a_block() {
        let customer = Customer { years_with_mhpco: 0 };
        let items: Vec<Item> = (0..7)
            .map(|_| an_item("rune").build())
            .collect();
        assert_eq!(quote(&customer, &items, 0).unwrap(), 198);
    }

    #[test]
    fn mixed_component_types_do_not_form_a_block() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [
            an_item("rune").build(),
            an_item("rune").build(),
            an_item("moonstone").build(),
        ];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 88);
    }

    #[test]
    fn two_separate_component_types_each_form_a_block() {
        let customer = Customer { years_with_mhpco: 0 };
        let mut items: Vec<Item> = (0..3)
            .map(|_| an_item("rune").build())
            .collect();
        items.extend((0..3).map(|_| an_item("moonstone").build()));
        assert_eq!(quote(&customer, &items, 0).unwrap(), 137);
    }

    #[test]
    fn cursed_item_adds_a_fifty_percent_surcharge() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("amulet").cursed().build()];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 101);
    }

    #[test]
    fn enchantment_of_exactly_five_adds_the_high_enchantment_surcharge() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("amulet").enchanted_to(5).build()];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 89);
    }

    #[test]
    fn enchantment_of_four_adds_no_high_enchantment_surcharge() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("amulet").enchanted_to(4).build()];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 71);
    }

    #[test]
    fn cursed_and_highly_enchanted_item_adds_both_surcharges() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("amulet").cursed().enchanted_to(5).build()];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 119);
    }

    #[test]
    fn exactly_two_years_grants_the_loyalty_discount() {
        let customer = Customer { years_with_mhpco: 2 };
        let items = [an_item("amulet").build()];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 59);
    }

    #[test]
    fn one_year_grants_no_loyalty_discount() {
        let customer = Customer { years_with_mhpco: 1 };
        let items = [an_item("amulet").build()];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 71);
    }

    #[test]
    fn first_insurance_adds_the_initial_assessment_surcharge() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("amulet").build()];
        // 60 G base + 6 G initial assessment + 5 G fee; without the surcharge
        // this policy would cost 65 G.
        assert_eq!(quote(&customer, &items, 0).unwrap(), 71);
    }

    #[test]
    fn follow_up_contract_grants_the_fifteen_percent_discount() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("amulet").build()];
        assert_eq!(quote(&customer, &items, 1).unwrap(), 62);
    }

    #[test]
    fn first_insurance_surcharge_applies_on_every_quote() {
        let customer = Customer { years_with_mhpco: 3 };
        let items = [an_item("amulet").build()];
        // 60 G base + 6 G first insurance - 12 G loyalty - 9 G follow-up + 5 G
        // fee; without the first insurance surcharge this would cost 44 G.
        assert_eq!(quote(&customer, &items, 1).unwrap(), 50);
    }

    #[test]
    fn item_modifiers_apply_only_to_the_affected_items_base_premium() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [
            an_item("sword").cursed().build(),
            an_item("amulet").build(),
        ];
        // Policy base 160 G; the curse adds 50 G (half the sword's own base),
        // not 80 G (half the policy total). 160 + 50 + 16 first insurance + 5
        // fee = 231 G.
        assert_eq!(quote(&customer, &items, 0).unwrap(), 231);
    }

    #[test]
    fn premium_is_rounded_up() {
        let customer = Customer { years_with_mhpco: 2 };
        let items = [
            an_item("sword").cursed().build(),
            an_item("rune").build(),
            an_item("rune").cursed().build(),
        ];
        // Base 150 G, policy modifiers -10% = -15 G, curse surcharges
        // 50 + 12.5 = 62.5 G -> 197.5 G, rounded up to 198 G, plus the 5 G fee.
        assert_eq!(quote(&customer, &items, 0).unwrap(), 203);
    }

    #[test]
    fn newcomer_with_a_cursed_sword_pays_165() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("sword").cursed().enchanted_to(3).build()];
        assert_eq!(quote(&customer, &items, 0).unwrap(), 165);
    }

    #[test]
    fn long_standing_customers_second_contract_pays_160() {
        let customer = Customer { years_with_mhpco: 3 };
        let items = [an_item("sword").cursed().enchanted_to(7).build()];
        assert_eq!(quote(&customer, &items, 1).unwrap(), 160);
    }

    #[test]
    fn quote_with_an_unknown_item_type_is_rejected() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("broomstick").build()];
        // The office has no price-list entry for a broomstick, so the whole
        // quote is refused; the CLI turns this into a non-zero exit status.
        assert!(quote(&customer, &items, 0).is_err());
    }

    #[test]
    fn standard_damage_is_reimbursed_minus_the_deductible() {
        let items = [an_item("sword").enchanted_to(3).build()];
        let mut policy = Policy::insuring(&items);
        let damages = [Damage {
            item_type: "sword".to_string(),
            amount: 500,
        }];
        assert_eq!(policy.claim(&damages).unwrap().payout, 400);
    }

    #[test]
    fn component_damage_is_reimbursed_minus_the_deductible() {
        let items = [an_item("rune").build()];
        let mut policy = Policy::insuring(&items);
        let damages = [Damage {
            item_type: "rune".to_string(),
            amount: 200,
        }];
        assert_eq!(policy.claim(&damages).unwrap().payout, 100);
    }

    #[test]
    fn highly_enchanted_damage_is_reimbursed_at_half() {
        let items = [an_item("sword").enchanted_to(9).build()];
        let mut policy = Policy::insuring(&items);
        let damages = [Damage {
            item_type: "sword".to_string(),
            amount: 1000,
        }];
        assert_eq!(policy.claim(&damages).unwrap().payout, 400);
    }

    #[test]
    fn dragon_material_damage_is_fully_reimbursed() {
        let items = [an_item("sword").made_of("dragon").enchanted_to(5).build()];
        let mut policy = Policy::insuring(&items);
        let damages = [Damage {
            item_type: "sword".to_string(),
            amount: 800,
        }];
        assert_eq!(policy.claim(&damages).unwrap().payout, 700);
    }

    #[test]
    fn enchantment_of_exactly_eight_triggers_the_half_reimbursement() {
        let items = [an_item("sword").made_of("dragon").enchanted_to(8).build()];
        let mut policy = Policy::insuring(&items);
        let damages = [Damage {
            item_type: "sword".to_string(),
            amount: 1000,
        }];
        assert_eq!(policy.claim(&damages).unwrap().payout, 400);
    }

    #[test]
    fn high_enchantment_beats_dragon_material() {
        let items = [an_item("sword").made_of("dragon").enchanted_to(9).build()];
        let mut policy = Policy::insuring(&items);
        let damages = [Damage {
            item_type: "sword".to_string(),
            amount: 1000,
        }];
        assert_eq!(policy.claim(&damages).unwrap().payout, 400);
    }

    #[test]
    fn the_deductible_applies_once_per_damaged_item() {
        let items = [an_item("sword").build(), an_item("amulet").build()];
        let mut policy = Policy::insuring(&items);
        let damages = [
            Damage {
                item_type: "sword".to_string(),
                amount: 500,
            },
            Damage {
                item_type: "amulet".to_string(),
                amount: 300,
            },
        ];
        assert_eq!(policy.claim(&damages).unwrap().payout, 600);
    }

    #[test]
    fn payout_is_rounded_down() {
        let items = [an_item("sword").enchanted_to(8).build()];
        let mut policy = Policy::insuring(&items);
        let damages = [Damage {
            item_type: "sword".to_string(),
            amount: 901,
        }];
        // Half of 901 G is 450.5 G; less the 100 G deductible the payout
        // calculation yields 350.5 G, rounded down in the MHPCO's favor.
        assert_eq!(policy.claim(&damages).unwrap().payout, 350);
    }

    #[test]
    fn the_cap_is_twice_the_sum_of_the_items_insurance_values() {
        let items = [an_item("sword").build(), an_item("amulet").build()];
        let mut policy = Policy::insuring(&items);
        let damages = [
            Damage {
                item_type: "sword".to_string(),
                amount: 2000,
            },
            Damage {
                item_type: "amulet".to_string(),
                amount: 2000,
            },
        ];
        // Insurance sum 1000 + 600 = 1600 G, so the cap is 3200 G; the
        // reimbursements would total 3800 G without it.
        let settlement = policy.claim(&damages).unwrap();
        assert_eq!(settlement.payout, 3200);
        assert_eq!(settlement.remaining_cap, 0);
    }

    #[test]
    fn premium_modifiers_do_not_raise_the_cap() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [an_item("sword").cursed().build()];
        // The curse raises the premium to 165 G but not the insurance value,
        // so the cap stays at twice 1000 G.
        assert_eq!(quote(&customer, &items, 0).unwrap(), 165);
        let mut policy = Policy::insuring(&items);
        let damages = [Damage {
            item_type: "sword".to_string(),
            amount: 3000,
        }];
        let settlement = policy.claim(&damages).unwrap();
        assert_eq!(settlement.payout, 2000);
        assert_eq!(settlement.remaining_cap, 0);
    }

    #[test]
    fn the_component_block_discount_does_not_lower_the_insurance_sum() {
        let mut items = vec![an_item("sword").build()];
        items.extend((0..3).map(|_| an_item("rune").build()));
        let mut policy = Policy::insuring(&items);
        let damages = [Damage {
            item_type: "sword".to_string(),
            amount: 5000,
        }];
        // Insurance sum 1000 + 3 x 250 = 1750 G even though the three runes
        // form a building block for the premium, so the cap is 3500 G.
        let settlement = policy.claim(&damages).unwrap();
        assert_eq!(settlement.payout, 3500);
        assert_eq!(settlement.remaining_cap, 0);
    }

    #[test]
    fn successive_claims_exhaust_the_remaining_cap() {
        let items = [an_item("sword").build()];
        let mut policy = Policy::insuring(&items);
        let damages = [Damage {
            item_type: "sword".to_string(),
            amount: 1500,
        }];
        let first = policy.claim(&damages).unwrap();
        assert_eq!(first.payout, 1400);
        assert_eq!(first.remaining_cap, 600);
        let second = policy.claim(&damages).unwrap();
        assert_eq!(second.payout, 600);
        assert_eq!(second.remaining_cap, 0);
    }

    #[test]
    fn two_items_of_the_same_type_are_insured_separately() {
        let items = [an_item("sword").build(), an_item("sword").build()];
        let mut policy = Policy::insuring(&items);
        let damages = [Damage {
            item_type: "sword".to_string(),
            amount: 9000,
        }];
        // Insurance sum 2 x 1000 = 2000 G, so the cap is 4000 G.
        let settlement = policy.claim(&damages).unwrap();
        assert_eq!(settlement.payout, 4000);
        assert_eq!(settlement.remaining_cap, 0);
    }

    #[test]
    fn each_damage_entry_of_the_same_type_carries_its_own_deductible() {
        let items = [an_item("sword").build(), an_item("sword").build()];
        let mut policy = Policy::insuring(&items);
        let damages = [
            Damage {
                item_type: "sword".to_string(),
                amount: 500,
            },
            Damage {
                item_type: "sword".to_string(),
                amount: 500,
            },
        ];
        // Two separate damages, each reimbursed less its own 100 G deductible.
        assert_eq!(policy.claim(&damages).unwrap().payout, 800);
    }

    #[test]
    fn more_damages_of_a_type_than_insured_items_is_rejected() {
        let items = [an_item("sword").build()];
        let mut policy = Policy::insuring(&items);
        let damages = [
            Damage {
                item_type: "sword".to_string(),
                amount: 500,
            },
            Damage {
                item_type: "sword".to_string(),
                amount: 500,
            },
        ];
        // Only one sword is insured, so two sword damages overclaim the
        // policy and the whole claim is refused.
        assert!(policy.claim(&damages).is_err());
    }

    #[test]
    fn claim_for_an_uninsured_item_is_rejected() {
        let items = [an_item("sword").build()];
        let mut policy = Policy::insuring(&items);
        let damages = [Damage {
            item_type: "amulet".to_string(),
            amount: 300,
        }];
        // The policy covers no amulet, so the whole claim is refused.
        assert!(policy.claim(&damages).is_err());
    }

    #[test]
    fn claim_with_an_unknown_item_type_is_rejected() {
        let items = [an_item("sword").build()];
        let mut policy = Policy::insuring(&items);
        let damages = [Damage {
            item_type: "broomstick".to_string(),
            amount: 300,
        }];
        // An item type the office does not even list cannot be covered, so
        // the claim is refused.
        assert!(policy.claim(&damages).is_err());
    }

    #[test]
    fn claim_with_a_negative_damage_amount_is_rejected() {
        let items = [an_item("sword").build()];
        let mut policy = Policy::insuring(&items);
        let damages = [Damage {
            item_type: "sword".to_string(),
            amount: -200,
        }];
        // The office does not entertain a damage of negative worth.
        assert!(policy.claim(&damages).is_err());
    }

    #[test]
    fn a_scenario_produces_one_result_per_step_in_order() {
        // The specification's schema example, through the CLI contract.
        let scenario = r#"{
            "customer": {"yearsWithMHPCO": 5},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {"type": "amulet", "material": "silver",
                         "enchantment": 2, "cursed": false}
                    ]
                },
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "amulet", "amount": 200}]
                    }
                }
            ]
        }"#;
        // Premium: 60 G base - 12 G loyalty + 6 G first insurance + 5 G fee.
        // Payout: 200 G less the 100 G deductible; cap 1200 G, so 1100 G left.
        let results = run_scenario(scenario).unwrap();
        assert_eq!(
            results,
            r#"{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}"#
        );
    }
}
