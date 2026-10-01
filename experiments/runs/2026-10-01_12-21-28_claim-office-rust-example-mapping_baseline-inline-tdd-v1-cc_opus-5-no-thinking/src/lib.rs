pub mod catalog;

#[cfg(test)]
mod catalog_tests {
    use crate::catalog::{base_premium, insurance_value, is_component};

    #[test]
    fn sword_has_base_premium_100() {
        assert_eq!(base_premium("sword"), Some(100));
    }

    #[test]
    fn amulet_has_base_premium_60() {
        assert_eq!(base_premium("amulet"), Some(60));
    }

    #[test]
    fn staff_has_base_premium_80() {
        assert_eq!(base_premium("staff"), Some(80));
    }

    #[test]
    fn potion_has_base_premium_40() {
        assert_eq!(base_premium("potion"), Some(40));
    }

    #[test]
    fn unknown_type_has_no_base_premium() {
        assert_eq!(base_premium("broomstick"), None);
    }

    #[test]
    fn components_have_base_premium_25() {
        assert_eq!(base_premium("rune"), Some(25));
        assert_eq!(base_premium("moonstone"), Some(25));
    }

    #[test]
    fn main_items_have_their_price_list_insurance_value() {
        assert_eq!(insurance_value("sword"), Some(1000));
        assert_eq!(insurance_value("amulet"), Some(600));
        assert_eq!(insurance_value("staff"), Some(800));
        assert_eq!(insurance_value("potion"), Some(400));
    }

    #[test]
    fn components_are_insured_at_250() {
        assert_eq!(insurance_value("rune"), Some(250));
        assert_eq!(insurance_value("moonstone"), Some(250));
    }

    #[test]
    fn unknown_type_has_no_insurance_value() {
        assert_eq!(insurance_value("broomstick"), None);
    }

    #[test]
    fn only_runes_and_moonstones_are_components() {
        assert!(is_component("rune"));
        assert!(is_component("moonstone"));
        assert!(!is_component("sword"));
        assert!(!is_component("broomstick"));
    }
}

pub mod components;

#[cfg(test)]
mod component_block_tests {
    use crate::components::component_group_premium;

    #[test]
    fn two_alike_components_cost_the_plain_rate() {
        assert_eq!(component_group_premium(2), 50);
    }

    #[test]
    fn exactly_three_alike_components_form_a_block() {
        assert_eq!(component_group_premium(3), 60);
    }

    #[test]
    fn four_alike_components_do_not_form_a_block() {
        assert_eq!(component_group_premium(4), 100);
    }

    #[test]
    fn seven_alike_components_do_not_form_a_block() {
        assert_eq!(component_group_premium(7), 175);
    }

    #[test]
    fn no_components_cost_nothing() {
        assert_eq!(component_group_premium(0), 0);
    }
}

pub mod amount;

#[cfg(test)]
mod amount_tests {
    use crate::amount::Amount;

    #[test]
    fn whole_amounts_round_to_themselves() {
        assert_eq!(Amount::whole(100).round_up(), 100);
        assert_eq!(Amount::whole(100).round_down(), 100);
    }

    #[test]
    fn a_premium_of_197_point_5_rounds_up_to_198() {
        let premium = Amount::whole(395).percent(50);
        assert_eq!(premium.round_up(), 198);
    }

    #[test]
    fn a_payout_of_350_point_5_rounds_down_to_350() {
        let payout = Amount::whole(701).percent(50);
        assert_eq!(payout.round_down(), 350);
    }

    #[test]
    fn percent_of_an_amount_stays_exact_across_additions() {
        // 100 * 50% = 50 exactly, no drift when added to a whole amount.
        let total = Amount::whole(100) + Amount::whole(100).percent(50);
        assert_eq!(total.round_up(), 150);
    }

    #[test]
    fn thirds_are_kept_as_fractions_rather_than_truncated() {
        let third = Amount::whole(10).percent(50).percent(50);
        // 10 * 0.5 * 0.5 = 2.5 -> up 3, down 2
        assert_eq!(third.round_up(), 3);
        assert_eq!(third.round_down(), 2);
    }

    #[test]
    fn subtracting_a_discount_is_exact() {
        let net = Amount::whole(100) - Amount::whole(100).percent(20);
        assert_eq!(net.round_up(), 80);
    }
}

pub mod policy;

#[cfg(test)]
mod policy_base_premium_tests {
    use crate::amount::Amount;
    use crate::policy::{Item, Policy};

    fn plain(item_type: &str) -> Item {
        Item {
            item_type: item_type.to_string(),
            material: None,
            enchantment: None,
            cursed: false,
        }
    }

    fn base_of(types: &[&str]) -> i128 {
        let items: Vec<Item> = types.iter().map(|t| plain(t)).collect();
        Policy::new(&items).unwrap().base_premium().round_up()
    }

    #[test]
    fn a_single_sword_has_the_price_list_base_premium() {
        assert_eq!(base_of(&["sword"]), 100);
    }

    #[test]
    fn base_premiums_of_several_main_items_add_up() {
        assert_eq!(base_of(&["sword", "amulet"]), 160);
    }

    #[test]
    fn three_alike_components_are_charged_as_a_block() {
        assert_eq!(base_of(&["rune", "rune", "rune"]), 60);
    }

    #[test]
    fn components_of_different_types_do_not_form_a_block() {
        assert_eq!(base_of(&["rune", "rune", "moonstone"]), 75);
    }

    #[test]
    fn each_component_type_forms_its_own_block() {
        let types = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"];
        assert_eq!(base_of(&types), 120);
    }

    #[test]
    fn an_empty_item_list_has_no_base_premium() {
        assert_eq!(Policy::new(&[]).unwrap().base_premium(), Amount::zero());
    }

    #[test]
    fn an_unknown_item_type_is_rejected() {
        assert!(Policy::new(&[plain("broomstick")]).is_err());
    }

    #[test]
    fn insurance_sum_adds_the_items_insurance_values() {
        let items = [plain("sword"), plain("amulet")];
        assert_eq!(Policy::new(&items).unwrap().insurance_sum(), 1600);
    }

    #[test]
    fn the_block_discount_does_not_shrink_the_insurance_sum() {
        let items = [plain("sword"), plain("rune"), plain("rune"), plain("rune")];
        assert_eq!(Policy::new(&items).unwrap().insurance_sum(), 1750);
    }

    #[test]
    fn two_swords_double_the_insurance_sum() {
        let items = [plain("sword"), plain("sword")];
        assert_eq!(Policy::new(&items).unwrap().insurance_sum(), 2000);
    }
}

pub mod premium;

#[cfg(test)]
mod premium_tests {
    use crate::policy::{Item, Policy};
    use crate::premium::{Customer, quote_premium};

    fn item(item_type: &str, enchantment: i64, cursed: bool) -> Item {
        Item {
            item_type: item_type.to_string(),
            material: Some("steel".to_string()),
            enchantment: Some(enchantment),
            cursed,
        }
    }

    fn newcomer() -> Customer {
        Customer {
            years_with_mhpco: 0,
            previous_contracts: 0,
        }
    }

    fn premium_for(items: &[Item], customer: &Customer) -> i128 {
        quote_premium(&Policy::new(items).unwrap(), customer)
    }

    #[test]
    fn an_empty_item_list_costs_only_the_processing_fee() {
        assert_eq!(premium_for(&[], &newcomer()), 5);
    }

    #[test]
    fn a_cursed_item_adds_half_its_base_premium() {
        // 100 base + 50 curse + 10 first insurance + 5 fee
        assert_eq!(premium_for(&[item("sword", 3, true)], &newcomer()), 165);
    }

    #[test]
    fn a_plain_item_carries_only_the_first_insurance_surcharge_and_fee() {
        // 100 base + 10 first insurance + 5 fee
        assert_eq!(premium_for(&[item("sword", 3, false)], &newcomer()), 115);
    }

    #[test]
    fn enchantment_five_adds_the_high_enchantment_surcharge() {
        // 100 base + 30 enchantment + 10 first insurance + 5 fee
        assert_eq!(premium_for(&[item("sword", 5, false)], &newcomer()), 145);
    }

    #[test]
    fn enchantment_four_adds_no_surcharge() {
        assert_eq!(premium_for(&[item("sword", 4, false)], &newcomer()), 115);
    }

    #[test]
    fn a_cursed_highly_enchanted_item_carries_both_surcharges() {
        // 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee
        assert_eq!(premium_for(&[item("sword", 5, true)], &newcomer()), 195);
    }

    #[test]
    fn exactly_two_years_earn_the_loyalty_discount() {
        let loyal = Customer {
            years_with_mhpco: 2,
            previous_contracts: 0,
        };
        // 100 base - 20 loyalty + 10 first insurance + 5 fee
        assert_eq!(premium_for(&[item("sword", 3, false)], &loyal), 95);
    }

    #[test]
    fn one_year_earns_no_loyalty_discount() {
        let newish = Customer {
            years_with_mhpco: 1,
            previous_contracts: 0,
        };
        assert_eq!(premium_for(&[item("sword", 3, false)], &newish), 115);
    }

    #[test]
    fn the_item_surcharge_applies_to_the_item_not_the_policy_total() {
        // cursed sword 100 + plain amulet 60 = 160 base; curse adds 50
        // (half of the sword alone), first insurance adds 16, fee adds 5
        let items = [item("sword", 3, true), item("amulet", 2, false)];
        assert_eq!(premium_for(&items, &newcomer()), 231);
    }

    #[test]
    fn a_follow_up_contract_earns_the_fifteen_percent_discount() {
        let returning = Customer {
            years_with_mhpco: 3,
            previous_contracts: 1,
        };
        // 100 base + 50 curse + 30 enchantment - 20 loyalty
        // + 10 first insurance - 15 follow-up + 5 fee
        assert_eq!(premium_for(&[item("sword", 7, true)], &returning), 160);
    }

    #[test]
    fn a_component_has_no_enchantment_or_curse_surcharge() {
        let rune = Item {
            item_type: "rune".to_string(),
            material: None,
            enchantment: None,
            cursed: false,
        };
        // 25 base + 2.5 first insurance + 5 fee = 32.5 -> 33 (MHPCO's favor)
        assert_eq!(premium_for(&[rune], &newcomer()), 33);
    }
}

pub mod claim;

#[cfg(test)]
mod claim_tests {
    use crate::claim::{Damage, Incident, OpenPolicy, settle};
    use crate::policy::{Item, Policy};

    fn item(item_type: &str, material: &str, enchantment: i64) -> Item {
        Item {
            item_type: item_type.to_string(),
            material: Some(material.to_string()),
            enchantment: Some(enchantment),
            cursed: false,
        }
    }

    fn rune() -> Item {
        Item {
            item_type: "rune".to_string(),
            material: None,
            enchantment: None,
            cursed: false,
        }
    }

    fn damage(item_type: &str, amount: i64) -> Damage {
        Damage {
            item_type: item_type.to_string(),
            amount,
        }
    }

    fn open(items: &[Item]) -> OpenPolicy {
        OpenPolicy::new(Policy::new(items).unwrap())
    }

    fn incident(damages: Vec<Damage>) -> Incident {
        Incident {
            cause: "dragon attack".to_string(),
            damages,
        }
    }

    #[test]
    fn a_plain_item_is_reimbursed_in_full_minus_the_deductible() {
        let mut policy = open(&[item("sword", "steel", 3)]);
        let result = settle(&mut policy, &incident(vec![damage("sword", 500)])).unwrap();
        assert_eq!(result.payout, 400);
    }

    #[test]
    fn a_rune_without_enchantment_or_material_has_no_special_clause() {
        let mut policy = open(&[rune()]);
        let result = settle(&mut policy, &incident(vec![damage("rune", 200)])).unwrap();
        assert_eq!(result.payout, 100);
    }

    #[test]
    fn enchantment_nine_halves_the_damage_before_the_deductible() {
        let mut policy = open(&[item("sword", "steel", 9)]);
        let result = settle(&mut policy, &incident(vec![damage("sword", 1000)])).unwrap();
        assert_eq!(result.payout, 400);
    }

    #[test]
    fn dragon_material_is_fully_reimbursed_minus_the_deductible() {
        let mut policy = open(&[item("sword", "dragon", 5)]);
        let result = settle(&mut policy, &incident(vec![damage("sword", 800)])).unwrap();
        assert_eq!(result.payout, 700);
    }

    #[test]
    fn the_half_rule_wins_over_dragon_material() {
        let mut policy = open(&[item("sword", "dragon", 9)]);
        let result = settle(&mut policy, &incident(vec![damage("sword", 1000)])).unwrap();
        assert_eq!(result.payout, 400);
    }

    #[test]
    fn enchantment_exactly_eight_triggers_the_half_rule() {
        let mut policy = open(&[item("sword", "dragon", 8)]);
        let result = settle(&mut policy, &incident(vec![damage("sword", 1000)])).unwrap();
        assert_eq!(result.payout, 400);
    }

    #[test]
    fn the_deductible_applies_once_per_damaged_item() {
        let mut policy = open(&[item("sword", "steel", 3), item("amulet", "silver", 1)]);
        let damages = vec![damage("sword", 500), damage("amulet", 300)];
        let result = settle(&mut policy, &incident(damages)).unwrap();
        assert_eq!(result.payout, 600);
    }

    #[test]
    fn a_payout_of_350_point_5_is_rounded_down() {
        let mut policy = open(&[item("sword", "steel", 9)]);
        // 901 / 2 = 450.5, minus 100 deductible = 350.5 -> 350
        let result = settle(&mut policy, &incident(vec![damage("sword", 901)])).unwrap();
        assert_eq!(result.payout, 350);
    }

    #[test]
    fn damage_below_the_deductible_pays_nothing() {
        let mut policy = open(&[item("sword", "steel", 3)]);
        let result = settle(&mut policy, &incident(vec![damage("sword", 60)])).unwrap();
        assert_eq!(result.payout, 0);
    }

    #[test]
    fn the_cap_is_twice_the_insurance_sum_and_shrinks_with_each_claim() {
        let mut policy = open(&[item("sword", "steel", 3)]);
        let first = settle(&mut policy, &incident(vec![damage("sword", 1500)])).unwrap();
        assert_eq!((first.payout, first.remaining_cap), (1400, 600));

        let second = settle(&mut policy, &incident(vec![damage("sword", 1500)])).unwrap();
        assert_eq!((second.payout, second.remaining_cap), (600, 0));
    }

    #[test]
    fn premium_modifiers_do_not_raise_the_cap() {
        let cursed = Item {
            cursed: true,
            ..item("sword", "steel", 3)
        };
        let policy = open(&[cursed]);
        assert_eq!(policy.remaining_cap(), 2000);
    }

    #[test]
    fn two_swords_each_get_their_own_deductible() {
        let mut policy = open(&[item("sword", "steel", 3), item("sword", "steel", 3)]);
        let damages = vec![damage("sword", 500), damage("sword", 500)];
        let result = settle(&mut policy, &incident(damages)).unwrap();
        assert_eq!(result.payout, 800);
    }

    #[test]
    fn a_damage_to_an_item_the_policy_does_not_cover_is_rejected() {
        let mut policy = open(&[item("sword", "steel", 3)]);
        assert!(settle(&mut policy, &incident(vec![damage("amulet", 200)])).is_err());
    }

    #[test]
    fn an_unknown_damaged_item_type_is_rejected() {
        let mut policy = open(&[item("sword", "steel", 3)]);
        assert!(settle(&mut policy, &incident(vec![damage("broomstick", 200)])).is_err());
    }

    #[test]
    fn more_damages_of_a_type_than_the_policy_covers_is_rejected() {
        let mut policy = open(&[item("sword", "steel", 3)]);
        let damages = vec![damage("sword", 200), damage("sword", 200)];
        assert!(settle(&mut policy, &incident(damages)).is_err());
    }

    #[test]
    fn a_negative_damage_amount_is_rejected() {
        let mut policy = open(&[item("sword", "steel", 3)]);
        assert!(settle(&mut policy, &incident(vec![damage("sword", -200)])).is_err());
    }

    #[test]
    fn a_rejected_claim_leaves_the_cap_untouched() {
        let mut policy = open(&[item("sword", "steel", 3)]);
        let _ = settle(&mut policy, &incident(vec![damage("sword", -200)]));
        assert_eq!(policy.remaining_cap(), 2000);
    }
}

pub mod scenario;

#[cfg(test)]
mod scenario_tests {
    use crate::scenario::run_json;

    fn results(input: &str) -> String {
        run_json(input).unwrap()
    }

    #[test]
    fn a_quote_step_reports_its_premium() {
        let input = r#"{"customer":{"yearsWithMHPCO":0},
            "steps":[{"op":"quote","items":[
                {"type":"sword","material":"steel","enchantment":3,"cursed":true}]}]}"#;
        assert_eq!(results(input), r#"{"results":[{"premium":165}]}"#);
    }

    #[test]
    fn an_empty_quote_reports_only_the_fee() {
        let input = r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[]}]}"#;
        assert_eq!(results(input), r#"{"results":[{"premium":5}]}"#);
    }

    #[test]
    fn a_second_quote_earns_the_follow_up_discount() {
        let input = r#"{"customer":{"yearsWithMHPCO":3},"steps":[
            {"op":"quote","items":[{"type":"potion"}]},
            {"op":"quote","items":[
                {"type":"sword","material":"steel","enchantment":7,"cursed":true}]}]}"#;
        assert_eq!(
            results(input),
            r#"{"results":[{"premium":41},{"premium":160}]}"#
        );
    }

    #[test]
    fn a_claim_step_reports_payout_and_remaining_cap() {
        let input = r#"{"customer":{"yearsWithMHPCO":5},"steps":[
            {"op":"quote","items":[
                {"type":"amulet","material":"silver","enchantment":2,"cursed":false}]},
            {"op":"claim","policy":0,"incident":{"cause":"fire",
                "damages":[{"itemType":"amulet","amount":200}]}}]}"#;
        assert_eq!(
            results(input),
            r#"{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}"#
        );
    }

    #[test]
    fn successive_claims_draw_down_the_same_policy_cap() {
        let input = r#"{"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":[{"type":"sword","material":"steel","enchantment":3}]},
            {"op":"claim","policy":0,"incident":{"cause":"dragon",
                "damages":[{"itemType":"sword","amount":1500}]}},
            {"op":"claim","policy":0,"incident":{"cause":"dragon",
                "damages":[{"itemType":"sword","amount":1500}]}}]}"#;
        assert_eq!(
            results(input),
            r#"{"results":[{"premium":115},{"payout":1400,"remainingCap":600},{"payout":600,"remainingCap":0}]}"#
        );
    }

    #[test]
    fn an_absent_cursed_flag_defaults_to_not_cursed() {
        let input = r#"{"customer":{"yearsWithMHPCO":0},
            "steps":[{"op":"quote","items":[{"type":"sword"}]}]}"#;
        assert_eq!(results(input), r#"{"results":[{"premium":115}]}"#);
    }

    #[test]
    fn an_unknown_item_type_fails_the_scenario() {
        let input = r#"{"customer":{"yearsWithMHPCO":0},
            "steps":[{"op":"quote","items":[{"type":"broomstick"}]}]}"#;
        assert!(run_json(input).is_err());
    }

    #[test]
    fn a_claim_against_an_uninsured_item_fails_the_scenario() {
        let input = r#"{"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":[{"type":"sword"}]},
            {"op":"claim","policy":0,"incident":{"cause":"fire",
                "damages":[{"itemType":"amulet","amount":200}]}}]}"#;
        assert!(run_json(input).is_err());
    }

    #[test]
    fn a_negative_damage_amount_fails_the_scenario() {
        let input = r#"{"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":[{"type":"sword"}]},
            {"op":"claim","policy":0,"incident":{"cause":"fire",
                "damages":[{"itemType":"sword","amount":-200}]}}]}"#;
        assert!(run_json(input).is_err());
    }

    #[test]
    fn a_claim_referring_to_a_missing_policy_fails_the_scenario() {
        let input = r#"{"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"claim","policy":0,"incident":{"cause":"fire",
                "damages":[{"itemType":"sword","amount":200}]}}]}"#;
        assert!(run_json(input).is_err());
    }

    #[test]
    fn malformed_json_fails_the_scenario() {
        assert!(run_json("not json").is_err());
    }
}

#[cfg(test)]
mod prompt_example_tests {
    //! The examples from the kata brief, driven through the scenario runner.

    use crate::scenario::run_json;

    fn quote_of(items: &str) -> String {
        let input =
            format!(r#"{{"customer":{{"yearsWithMHPCO":0}},"steps":[{{"op":"quote","items":[{items}]}}]}}"#);
        run_json(&input).unwrap()
    }

    fn runes(count: usize) -> String {
        vec![r#"{"type":"rune"}"#; count].join(",")
    }

    fn claim_on(items: &str, damages: &str) -> String {
        let input = format!(
            r#"{{"customer":{{"yearsWithMHPCO":0}},"steps":[
                {{"op":"quote","items":[{items}]}},
                {{"op":"claim","policy":0,"incident":{{"cause":"dragon","damages":[{damages}]}}}}]}}"#
        );
        run_json(&input).unwrap()
    }

    #[test]
    fn seven_runes_round_a_premium_of_197_point_5_up_to_198() {
        // 175 base + 17.5 first insurance + 5 fee = 197.5
        assert_eq!(quote_of(&runes(7)), r#"{"results":[{"premium":198}]}"#);
    }

    #[test]
    fn two_runes_and_a_moonstone_form_no_block() {
        let items = format!(r#"{},{{"type":"moonstone"}}"#, runes(2));
        // 75 base + 7.5 first insurance + 5 fee = 87.5 -> 88
        assert_eq!(quote_of(&items), r#"{"results":[{"premium":88}]}"#);
    }

    #[test]
    fn three_runes_and_three_moonstones_form_two_blocks() {
        let items = format!(
            r#"{},{{"type":"moonstone"}},{{"type":"moonstone"}},{{"type":"moonstone"}}"#,
            runes(3)
        );
        // 120 base + 12 first insurance + 5 fee
        assert_eq!(quote_of(&items), r#"{"results":[{"premium":137}]}"#);
    }

    #[test]
    fn the_block_discount_does_not_shrink_the_cap() {
        // sword + 3 runes = insurance sum 1750, cap 3500
        let items = format!(r#"{{"type":"sword"}},{}"#, runes(3));
        let results = claim_on(&items, r#"{"itemType":"sword","amount":200}"#);
        assert!(results.contains(r#""remainingCap":3400"#), "{results}");
    }

    #[test]
    fn premium_modifiers_do_not_raise_the_cap() {
        let cursed_sword = r#"{"type":"sword","material":"steel","enchantment":3,"cursed":true}"#;
        let results = claim_on(cursed_sword, r#"{"itemType":"sword","amount":100}"#);
        // premium 165 G, but the cap still rests on the 1000 G insurance value
        assert_eq!(
            results,
            r#"{"results":[{"premium":165},{"payout":0,"remainingCap":2000}]}"#
        );
    }

    #[test]
    fn a_dragon_attack_deducts_once_per_damaged_item() {
        let results = claim_on(
            r#"{"type":"sword"},{"type":"amulet"}"#,
            r#"{"itemType":"sword","amount":500},{"itemType":"amulet","amount":300}"#,
        );
        assert!(results.contains(r#""payout":600"#), "{results}");
    }
}
