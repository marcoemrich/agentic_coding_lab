use serde_json::{Value, json};
use std::io::Write;
use std::process::{Command, Stdio};

fn run(steps: Value, years: i64) -> std::process::Output {
    let mut child = Command::new(option_env!("CARGO_BIN_EXE_kata").unwrap_or("target/debug/kata"))
        .stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped())
        .spawn().expect("launch kata binary");
    write!(child.stdin.take().unwrap(), "{}", json!({"customer":{"yearsWithMHPCO":years},"steps":steps})).unwrap();
    child.wait_with_output().unwrap()
}
fn results(steps: Value, years: i64) -> Value {
    let output = run(steps, years);
    assert!(output.status.success(), "{}", String::from_utf8_lossy(&output.stderr));
    serde_json::from_slice::<Value>(&output.stdout).unwrap()["results"].clone()
}
fn rejected(steps: Value) {
    let output = run(steps, 0);
    assert!(!output.status.success());
    assert!(!output.stderr.is_empty());
    assert!(output.stdout.is_empty());
}
fn quote(items: Value) -> Value { json!({"op":"quote","items":items}) }
fn item(kind: &str) -> Value { json!({"type":kind}) }
fn copies(kind: &str, count: usize) -> Value { Value::Array((0..count).map(|_| item(kind)).collect()) }
fn claim(policy: usize, damages: Value) -> Value {
    json!({"op":"claim","policy":policy,"incident":{"cause":"dragon attack","damages":damages}})
}
fn damage(kind: &str, amount: i64) -> Value { json!({"itemType":kind,"amount":amount}) }
fn premium(items: Value, years: i64) -> i64 {
    results(json!([quote(items)]), years)[0]["premium"].as_i64().unwrap()
}
fn payout(items: Value, damages: Value) -> Value {
    results(json!([quote(items), claim(0, damages)]), 0)[1].clone()
}

#[test]
fn empty_quote() { assert_eq!(premium(json!([]), 0), 5); }
#[test]
fn sword_quote() { assert_eq!(premium(json!([item("sword")]), 0), 115); }
#[test]
fn amulet_quote() { assert_eq!(premium(json!([item("amulet")]), 0), 71); }
#[test]
fn staff_quote() { assert_eq!(premium(json!([item("staff")]), 0), 93); }
#[test]
fn potion_quote() { assert_eq!(premium(json!([item("potion")]), 0), 49); }
#[test]
fn rune_quote() { assert_eq!(premium(json!([item("rune")]), 0), 33); }
#[test]
fn moonstone_quote() { assert_eq!(premium(json!([item("moonstone")]), 0), 33); }
#[test]
fn two_runes() { assert_eq!(premium(copies("rune", 2), 0), 60); }
#[test]
fn three_runes() { assert_eq!(premium(copies("rune", 3), 0), 71); }
#[test]
fn four_runes() { assert_eq!(premium(copies("rune", 4), 0), 115); }
#[test]
fn seven_runes() { assert_eq!(premium(copies("rune", 7), 0), 198); }
#[test]
fn mixed_components() { assert_eq!(premium(json!([item("rune"),item("rune"),item("moonstone")]), 0), 88); }
#[test]
fn two_blocks() { assert_eq!(premium(json!([item("rune"),item("rune"),item("rune"),item("moonstone"),item("moonstone"),item("moonstone")]), 0), 137); }
#[test]
fn cursed_sword() { assert_eq!(premium(json!([{"type":"sword","material":"steel","enchantment":3,"cursed":true}]), 0), 165); }
#[test]
fn curse_scope() { assert_eq!(premium(json!([{"type":"sword","cursed":true},item("amulet")]), 0), 231); }
#[test]
fn loyalty_boundary() { assert_eq!(premium(json!([item("sword")]), 2), 95); }
#[test]
fn no_loyalty() { assert_eq!(premium(json!([item("sword")]), 1), 115); }
#[test]
fn enchantment_below() { assert_eq!(premium(json!([{"type":"sword","enchantment":4}]), 0), 115); }
#[test]
fn enchantment_boundary() { assert_eq!(premium(json!([{"type":"sword","enchantment":5}]), 0), 145); }
#[test]
fn stacked_item_surcharges() { assert_eq!(premium(json!([{"type":"sword","enchantment":5,"cursed":true}]), 0), 195); }
#[test]
fn follow_up() { assert_eq!(results(json!([quote(json!([item("sword")])),quote(json!([item("sword")]))]), 0), json!([{"premium":115},{"premium":100}])); }
#[test]
fn long_standing_second() { assert_eq!(results(json!([quote(json!([item("amulet")])),quote(json!([{"type":"sword","material":"steel","enchantment":7,"cursed":true}]))]), 3), json!([{"premium":59},{"premium":160}])); }
#[test]
fn schema_example() { assert_eq!(results(json!([quote(json!([{"type":"amulet","material":"silver","enchantment":2,"cursed":false}])),claim(0,json!([damage("amulet",200)]))]), 5), json!([{"premium":59},{"payout":100,"remainingCap":1100}])); }
#[test]
fn regular_claim() { assert_eq!(payout(json!([{"type":"sword","material":"steel","enchantment":3}]),json!([damage("sword",500)])),json!({"payout":400,"remainingCap":1600})); }
#[test]
fn rune_claim() { assert_eq!(payout(json!([item("rune")]),json!([damage("rune",200)])),json!({"payout":100,"remainingCap":400})); }
#[test]
fn dragon_claim() { assert_eq!(payout(json!([{"type":"sword","material":"dragon","enchantment":5}]),json!([damage("sword",800)]))["payout"],700); }
#[test]
fn high_enchantment_claim() { assert_eq!(payout(json!([{"type":"sword","material":"steel","enchantment":9}]),json!([damage("sword",1000)]))["payout"],400); }
#[test]
fn dragon_threshold_claim() { assert_eq!(payout(json!([{"type":"sword","material":"dragon","enchantment":8}]),json!([damage("sword",1000)]))["payout"],400); }
#[test]
fn dragon_high_claim() { assert_eq!(payout(json!([{"type":"sword","material":"dragon","enchantment":9}]),json!([damage("sword",1000)]))["payout"],400); }
#[test]
fn two_damages() { assert_eq!(payout(json!([item("sword"),item("amulet")]),json!([damage("sword",500),damage("amulet",300)]))["payout"],600); }
#[test]
fn duplicate_swords() { assert_eq!(payout(copies("sword",2),json!([damage("sword",500),damage("sword",500)])),json!({"payout":800,"remainingCap":3200})); }
#[test]
fn mixed_cap() { assert_eq!(payout(json!([item("sword"),item("amulet")]),json!([]))["remainingCap"],3200); }
#[test]
fn cursed_cap() { assert_eq!(payout(json!([{"type":"sword","cursed":true}]),json!([])),json!({"payout":0,"remainingCap":2000})); }
#[test]
fn block_cap() { assert_eq!(payout(json!([item("sword"),item("rune"),item("rune"),item("rune")]),json!([]))["remainingCap"],3500); }
#[test]
fn cap_exhaustion() { assert_eq!(results(json!([quote(json!([item("sword")])),claim(0,json!([damage("sword",1500)])),claim(0,json!([damage("sword",1500)]))]),0),json!([{"premium":115},{"payout":1400,"remainingCap":600},{"payout":600,"remainingCap":0}])); }
#[test]
fn payout_rounding() { assert_eq!(payout(json!([{"type":"sword","enchantment":8}]),json!([damage("sword",901)]))["payout"],350); }
#[test]
fn unknown_quote() { rejected(json!([quote(json!([item("broomstick")]))])); }
#[test]
fn uninsured_damage() { rejected(json!([quote(json!([item("sword")])),claim(0,json!([damage("amulet",200)]))])); }
#[test]
fn unknown_damage() { rejected(json!([quote(json!([item("sword")])),claim(0,json!([damage("broomstick",200)]))])); }
#[test]
fn excess_damage_entries() { rejected(json!([quote(json!([item("sword")])),claim(0,json!([damage("sword",200),damage("sword",200)]))])); }
#[test]
fn negative_damage() { rejected(json!([quote(json!([item("sword")])),claim(0,json!([damage("sword",-200)]))])); }
