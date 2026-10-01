use serde_json::{Value, json};
use std::io::Write;
use std::process::{Command, Stdio};

fn run(input: Value) -> std::process::Output {
    let mut child = Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped())
        .spawn().unwrap();
    child.stdin.take().unwrap().write_all(input.to_string().as_bytes()).unwrap();
    child.wait_with_output().unwrap()
}
fn scenario(years: i64, steps: Value) -> Value {
    json!({"customer":{"yearsWithMHPCO":years},"steps":steps})
}
fn quote(items: Value) -> Value { json!({"op":"quote","items":items}) }
fn claim(policy: usize, damages: Value) -> Value {
    json!({"op":"claim","policy":policy,"incident":{"cause":"dragon attack","damages":damages}})
}
fn results(years: i64, steps: Value, expected: Value) {
    let output = run(scenario(years, steps));
    assert!(output.status.success(), "{}", String::from_utf8_lossy(&output.stderr));
    assert_eq!(serde_json::from_slice::<Value>(&output.stdout).unwrap(), json!({"results":expected}));
}
fn rejected(years: i64, steps: Value) {
    let output = run(scenario(years, steps));
    assert!(!output.status.success());
    assert!(!output.stderr.is_empty());
    assert!(!String::from_utf8_lossy(&output.stdout).contains("results"));
}
macro_rules! active {
    ($name:ident, $body:block) => { #[test] fn $name() $body };
}

active!(empty_quote_is_five, { results(0,json!([quote(json!([]))]),json!([{"premium":5}])); });
active!(sword_value_and_base_1000_100, { results(0,json!([quote(json!([{"type":"sword"}]))]),json!([{"premium":115}])); });
active!(amulet_base_60, { results(0,json!([quote(json!([{"type":"amulet"}]))]),json!([{"premium":71}])); });
active!(staff_base_80, { results(0,json!([quote(json!([{"type":"staff"}]))]),json!([{"premium":93}])); });
active!(potion_base_40, { results(0,json!([quote(json!([{"type":"potion"}]))]),json!([{"premium":49}])); });
active!(single_rune_base_25, { results(0,json!([quote(json!([{"type":"rune"}]))]),json!([{"premium":33}])); });
active!(single_moonstone_base_25, { results(0,json!([quote(json!([{"type":"moonstone"}]))]),json!([{"premium":33}])); });
active!(two_runes_base_50, { results(0,json!([quote(json!([{"type":"rune"},{"type":"rune"}]))]),json!([{"premium":60}])); });
active!(three_runes_block_base_60, { results(0,json!([quote(json!([{"type":"rune"},{"type":"rune"},{"type":"rune"}]))]),json!([{"premium":71}])); });
active!(four_runes_no_block_base_100, { results(0,json!([quote(json!([{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]))]),json!([{"premium":115}])); });
active!(seven_runes_no_block_base_175, { results(0,json!([quote(json!([{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]))]),json!([{"premium":198}])); });
active!(mixed_components_no_block_base_75, { results(0,json!([quote(json!([{"type":"rune"},{"type":"rune"},{"type":"moonstone"}]))]),json!([{"premium":88}])); });
active!(two_separate_blocks_base_120, { results(0,json!([quote(json!([{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}]))]),json!([{"premium":137}])); });
active!(cursed_sword_newcomer_165, { results(0,json!([quote(json!([{"type":"sword","material":"steel","enchantment":3,"cursed":true}]))]),json!([{"premium":165}])); });
active!(curse_only_affects_sword_not_amulet, { results(0,json!([quote(json!([{"type":"sword","cursed":true},{"type":"amulet"}]))]),json!([{"premium":231}])); });
active!(enchantment_four_no_surcharge, { results(0,json!([quote(json!([{"type":"sword","enchantment":4}]))]),json!([{"premium":115}])); });
active!(enchantment_five_adds_30, { results(0,json!([quote(json!([{"type":"sword","enchantment":5}]))]),json!([{"premium":145}])); });
active!(curse_and_enchantment_five_both_apply, { results(0,json!([quote(json!([{"type":"sword","enchantment":5,"cursed":true}]))]),json!([{"premium":195}])); });
active!(loyalty_at_two_years_discount_20, { results(2,json!([quote(json!([{"type":"sword"}]))]),json!([{"premium":95}])); });
active!(one_year_no_loyalty, { results(1,json!([quote(json!([{"type":"sword"}]))]),json!([{"premium":115}])); });
active!(followup_contract_discount_15_on_base, { results(0,json!([quote(json!([{"type":"sword"}])),quote(json!([{"type":"sword"}]))]),json!([{"premium":115},{"premium":100}])); });
active!(longstanding_second_new_cursed_enchanted_sword_160, { results(3,json!([quote(json!([])),quote(json!([{"type":"sword","material":"steel","enchantment":7,"cursed":true}]))]),json!([{"premium":5},{"premium":160}])); });
active!(quote_unknown_type_rejected, { rejected(0,json!([quote(json!([{"type":"broomstick"}]))])); });
active!(regular_sword_damage_500_pays_400_cap_1600, { results(0,json!([quote(json!([{"type":"sword","material":"steel","enchantment":3}])),claim(0,json!([{"itemType":"sword","amount":500}]))]),json!([{"premium":115},{"payout":400,"remainingCap":1600}])); });
active!(rune_damage_200_pays_100_cap_400, { results(0,json!([quote(json!([{"type":"rune"}])),claim(0,json!([{"itemType":"rune","amount":200}]))]),json!([{"premium":33},{"payout":100,"remainingCap":400}])); });
active!(dragon_sword_enchantment_five_damage_800_pays_700, { results(0,json!([quote(json!([{"type":"sword","material":"dragon","enchantment":5}])),claim(0,json!([{"itemType":"sword","amount":800}]))]),json!([{"premium":145},{"payout":700,"remainingCap":1300}])); });
active!(steel_sword_enchantment_nine_damage_1000_pays_400, { results(0,json!([quote(json!([{"type":"sword","material":"steel","enchantment":9}])),claim(0,json!([{"itemType":"sword","amount":1000}]))]),json!([{"premium":145},{"payout":400,"remainingCap":1600}])); });
active!(dragon_sword_enchantment_eight_damage_1000_pays_400, { results(0,json!([quote(json!([{"type":"sword","material":"dragon","enchantment":8}])),claim(0,json!([{"itemType":"sword","amount":1000}]))]),json!([{"premium":145},{"payout":400,"remainingCap":1600}])); });
active!(dragon_sword_enchantment_nine_damage_1000_pays_400, { results(0,json!([quote(json!([{"type":"sword","material":"dragon","enchantment":9}])),claim(0,json!([{"itemType":"sword","amount":1000}]))]),json!([{"premium":145},{"payout":400,"remainingCap":1600}])); });
active!(two_damaged_items_each_have_deductible_pays_600, { results(0,json!([quote(json!([{"type":"sword"},{"type":"amulet"}])),claim(0,json!([{"itemType":"sword","amount":500},{"itemType":"amulet","amount":300}]))]),json!([{"premium":181},{"payout":600,"remainingCap":2600}])); });
active!(two_swords_value_2000_cap_4000_and_separate_damages, { results(0,json!([quote(json!([{"type":"sword"},{"type":"sword"}])),claim(0,json!([{"itemType":"sword","amount":500},{"itemType":"sword","amount":500}]))]),json!([{"premium":225},{"payout":800,"remainingCap":3200}])); });
active!(too_many_sword_damages_rejected, { rejected(0,json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"sword","amount":500},{"itemType":"sword","amount":500}]))])); });
active!(uninsured_amulet_damage_rejected, { rejected(0,json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"amulet","amount":200}]))])); });
active!(unknown_damage_type_rejected, { rejected(0,json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"broomstick","amount":200}]))])); });
active!(negative_damage_rejected, { rejected(0,json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"sword","amount":-200}]))])); });
active!(sword_and_amulet_cap_3200, { results(0,json!([quote(json!([{"type":"sword"},{"type":"amulet"}])),claim(0,json!([]))]),json!([{"premium":181},{"payout":0,"remainingCap":3200}])); });
active!(cursed_sword_cap_unmodified_2000, { results(0,json!([quote(json!([{"type":"sword","cursed":true}])),claim(0,json!([]))]),json!([{"premium":165},{"payout":0,"remainingCap":2000}])); });
active!(block_discount_does_not_reduce_sum_1750, { results(0,json!([quote(json!([{"type":"sword"},{"type":"rune"},{"type":"rune"},{"type":"rune"}])),claim(0,json!([]))]),json!([{"premium":181},{"payout":0,"remainingCap":3500}])); });
active!(successive_claims_1400_then_600_exhaust_cap, { results(0,json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"sword","amount":1500}])),claim(0,json!([{"itemType":"sword","amount":1500}]))]),json!([{"premium":115},{"payout":1400,"remainingCap":600},{"payout":600,"remainingCap":0}])); });
active!(fractional_payout_350_point_5_rounds_down_350, { results(0,json!([quote(json!([{"type":"sword","enchantment":8}])),claim(0,json!([{"itemType":"sword","amount":901}]))]),json!([{"premium":145},{"payout":350,"remainingCap":1650}])); });
active!(fractional_intermediate_premium_rounds_once, { results(2,json!([quote(json!([{"type":"rune"},{"type":"moonstone"}]))]),json!([{"premium":50}])); });
active!(schema_example_quote_then_claim, { results(5,json!([quote(json!([{"type":"amulet","material":"silver","enchantment":2,"cursed":false}])),claim(0,json!([{"itemType":"amulet","amount":200}]))]),json!([{"premium":59},{"payout":100,"remainingCap":1100}])); });
