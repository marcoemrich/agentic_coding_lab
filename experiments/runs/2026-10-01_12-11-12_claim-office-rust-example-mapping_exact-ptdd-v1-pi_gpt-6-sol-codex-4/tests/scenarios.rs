use serde_json::{Value, json};
use std::io::Write;
use std::process::{Command, Stdio};

fn run(input: Value) -> std::process::Output {
    let executable = option_env!("CARGO_BIN_EXE_kata").unwrap_or("target/debug/kata");
    let mut child = Command::new(executable)
        .stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped())
        .spawn().expect("kata executable");
    child.stdin.take().unwrap().write_all(input.to_string().as_bytes()).unwrap();
    child.wait_with_output().unwrap()
}
fn results(input: Value, expected: Value) {
    let output = run(input);
    assert!(output.status.success(), "{}", String::from_utf8_lossy(&output.stderr));
    assert_eq!(serde_json::from_slice::<Value>(&output.stdout).unwrap(), json!({"results": expected}));
}
fn rejected(input: Value) {
    let output = run(input);
    assert!(!output.status.success());
    assert!(!output.stderr.is_empty());
    assert!(!String::from_utf8_lossy(&output.stdout).contains("results"));
}
fn scenario(years: i64, steps: Value) -> Value { json!({"customer":{"yearsWithMHPCO":years}, "steps":steps}) }
fn quote(items: Value) -> Value { json!({"op":"quote","items":items}) }
fn claim(policy: usize, damages: Value) -> Value {
    json!({"op":"claim","policy":policy,"incident":{"cause":"dragon attack","damages":damages}})
}
macro_rules! active_premium {
    ($name:ident, $years:expr, $items:expr, $expected:expr) => {
        #[test]
        fn $name() { results(scenario($years, json!([quote($items)])), json!([{"premium":$expected}])); }
    };
}
// Every test is inactive until its own predictive cycle. Premiums include the
// first-insurance charge and fee unless a multi-step scenario says otherwise.
active_premium!(empty_items_only_fee_5, 0, json!([]), 5);
active_premium!(sword_value_1000_base_100_premium_115, 0, json!([{"type":"sword"}]), 115);
active_premium!(amulet_value_600_base_60_premium_71, 0, json!([{"type":"amulet"}]), 71);
active_premium!(staff_value_800_base_80_premium_93, 0, json!([{"type":"staff"}]), 93);
active_premium!(potion_value_400_base_40_premium_49, 0, json!([{"type":"potion"}]), 49);
active_premium!(rune_value_250_base_25_premium_33, 0, json!([{"type":"rune"}]), 33);
active_premium!(moonstone_value_250_base_25_premium_33, 0, json!([{"type":"moonstone"}]), 33);
active_premium!(two_runes_base_50_premium_60, 0, json!([{"type":"rune"},{"type":"rune"}]), 60);
active_premium!(three_runes_block_60_premium_71, 0, json!([{"type":"rune"},{"type":"rune"},{"type":"rune"}]), 71);
active_premium!(four_runes_no_block_100_premium_115, 0, json!([{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]), 115);
active_premium!(seven_runes_no_block_175_premium_198, 0, json!([{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]), 198);
active_premium!(mixed_two_runes_one_moonstone_no_block_75_premium_88, 0, json!([{"type":"rune"},{"type":"rune"},{"type":"moonstone"}]), 88);
active_premium!(separate_rune_and_moonstone_blocks_120_premium_137, 0, json!([{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}]), 137);
active_premium!(cursed_sword_165, 0, json!([{"type":"sword","material":"steel","enchantment":3,"cursed":true}]), 165);
active_premium!(curse_only_on_sword_not_amulet_231, 0, json!([{"type":"sword","cursed":true},{"type":"amulet"}]), 231);
active_premium!(enchantment_4_no_surcharge_115, 0, json!([{"type":"sword","enchantment":4}]), 115);
active_premium!(enchantment_5_surcharge_145, 0, json!([{"type":"sword","enchantment":5}]), 145);
active_premium!(curse_and_enchantment_5_stack_195, 0, json!([{"type":"sword","enchantment":5,"cursed":true}]), 195);
active_premium!(one_year_no_loyalty_115, 1, json!([{"type":"sword"}]), 115);
active_premium!(exactly_two_years_loyalty_95, 2, json!([{"type":"sword"}]), 95);
#[test]
fn second_quote_new_sword_first_insurance_and_follow_up_100() {
    results(scenario(0,json!([quote(json!([{"type":"sword"}])),quote(json!([{"type":"sword"}]))])),
        json!([{"premium":115},{"premium":100}]));
}
#[test]
fn loyal_second_quote_cursed_enchanted_sword_160() {
    results(scenario(3,json!([quote(json!([])),quote(json!([{"type":"sword","material":"steel","enchantment":7,"cursed":true}]))])),
        json!([{"premium":5},{"premium":160}]));
}
#[test]
fn loyalty_on_base_not_curse_145() {
    results(scenario(2,json!([quote(json!([{"type":"sword","cursed":true}]))])),json!([{"premium":145}]));
}
#[test]
fn fractional_premium_197_point_5_rounds_to_198() {
    // Seven components have base 175; first-insurance adds 17.5 and fee 5.
    let items: Vec<_> = (0..7).map(|_| json!({"type":"rune"})).collect();
    results(scenario(0,json!([quote(json!(items))])),json!([{"premium":198}]));
}
#[test]
fn fractional_modifiers_not_rounded_between_steps() {
    results(scenario(2,json!([quote(json!([{"type":"rune","cursed":true}]))])),json!([{"premium":40}]));
    // 25 + 12.5 - 5 + 2.5 + 5 = 40.
}
#[test]
fn schema_example_amulet_fire() {
    results(scenario(5,json!([quote(json!([{"type":"amulet","material":"silver","enchantment":2,"cursed":false}])),claim(0,json!([{"itemType":"amulet","amount":200}]))])),
        json!([{"premium":59},{"payout":100,"remainingCap":1100}]));
}
#[test]
fn empty_steps_empty_results() { results(scenario(0,json!([])),json!([])); }
#[test]
fn unknown_quote_type_rejected() { rejected(scenario(0,json!([quote(json!([{"type":"broomstick"}]))]))); }
#[test]
fn unknown_damage_type_rejected() { rejected(scenario(0,json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"broomstick","amount":200}]))]))); }
#[test]
fn uninsured_amulet_rejected() { rejected(scenario(0,json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"amulet","amount":200}]))]))); }
#[test]
fn negative_damage_rejected() { rejected(scenario(0,json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"sword","amount":-200}]))]))); }
#[test]
fn more_sword_damages_than_insured_rejected() { rejected(scenario(0,json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"sword","amount":500},{"itemType":"sword","amount":500}]))]))); }
#[test]
fn steel_enchantment_3_damage_500_pays_400() {
    results(scenario(0,json!([quote(json!([{"type":"sword","material":"steel","enchantment":3}])),claim(0,json!([{"itemType":"sword","amount":500}]))])),json!([{"premium":115},{"payout":400,"remainingCap":1600}]));
}
#[test]
fn rune_damage_200_pays_100() {
    results(scenario(0,json!([quote(json!([{"type":"rune"}])),claim(0,json!([{"itemType":"rune","amount":200}]))])),json!([{"premium":33},{"payout":100,"remainingCap":400}]));
}
#[test]
fn dragon_enchantment_5_damage_800_pays_700() {
    results(scenario(0,json!([quote(json!([{"type":"sword","material":"dragon","enchantment":5}])),claim(0,json!([{"itemType":"sword","amount":800}]))])),json!([{"premium":145},{"payout":700,"remainingCap":1300}]));
}
#[test]
fn steel_enchantment_9_damage_1000_pays_400() {
    results(scenario(0,json!([quote(json!([{"type":"sword","material":"steel","enchantment":9}])),claim(0,json!([{"itemType":"sword","amount":1000}]))])),json!([{"premium":145},{"payout":400,"remainingCap":1600}]));
}
#[test]
fn dragon_enchantment_8_damage_1000_pays_400() {
    results(scenario(0,json!([quote(json!([{"type":"sword","material":"dragon","enchantment":8}])),claim(0,json!([{"itemType":"sword","amount":1000}]))])),json!([{"premium":145},{"payout":400,"remainingCap":1600}]));
}
#[test]
fn dragon_enchantment_9_damage_1000_pays_400() {
    results(scenario(0,json!([quote(json!([{"type":"sword","material":"dragon","enchantment":9}])),claim(0,json!([{"itemType":"sword","amount":1000}]))])),json!([{"premium":145},{"payout":400,"remainingCap":1600}]));
}
#[test]
fn fractional_payout_350_point_5_rounds_down() {
    results(scenario(0,json!([quote(json!([{"type":"sword","enchantment":8}])),claim(0,json!([{"itemType":"sword","amount":901}]))])),json!([{"premium":145},{"payout":350,"remainingCap":1650}]));
}
#[test]
fn two_swords_two_damages_separate_deductibles() {
    results(scenario(0,json!([quote(json!([{"type":"sword"},{"type":"sword"}])),claim(0,json!([{"itemType":"sword","amount":500},{"itemType":"sword","amount":300}]))])),json!([{"premium":225},{"payout":600,"remainingCap":3400}]));
}
#[test]
fn sword_amulet_cap_3200() {
    results(scenario(0,json!([quote(json!([{"type":"sword"},{"type":"amulet"}])),claim(0,json!([]))])),json!([{"premium":181},{"payout":0,"remainingCap":3200}]));
}
#[test]
fn cursed_sword_cap_2000() {
    results(scenario(0,json!([quote(json!([{"type":"sword","cursed":true}])),claim(0,json!([]))])),json!([{"premium":165},{"payout":0,"remainingCap":2000}]));
}
#[test]
fn sword_three_runes_cap_3500() {
    results(scenario(0,json!([quote(json!([{"type":"sword"},{"type":"rune"},{"type":"rune"},{"type":"rune"}])),claim(0,json!([]))])),json!([{"premium":181},{"payout":0,"remainingCap":3500}]));
}
#[test]
fn staff_insurance_cap_1600() {
    results(scenario(0,json!([quote(json!([{"type":"staff"}])),claim(0,json!([]))])),json!([{"premium":93},{"payout":0,"remainingCap":1600}]));
}
#[test]
fn potion_insurance_cap_800() {
    results(scenario(0,json!([quote(json!([{"type":"potion"}])),claim(0,json!([]))])),json!([{"premium":49},{"payout":0,"remainingCap":800}]));
}
#[test]
fn moonstone_insurance_cap_500() {
    results(scenario(0,json!([quote(json!([{"type":"moonstone"}])),claim(0,json!([]))])),json!([{"premium":33},{"payout":0,"remainingCap":500}]));
}
#[test]
fn successive_claims_pay_1400_then_600() {
    results(scenario(0,json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"sword","amount":1500}])),claim(0,json!([{"itemType":"sword","amount":1500}]))])),json!([{"premium":115},{"payout":1400,"remainingCap":600},{"payout":600,"remainingCap":0}]));
}
