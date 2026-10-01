use serde_json::{Value, json};
use std::io::Write;
use std::process::{Command, Stdio};

fn execute(input: Value) -> std::process::Output {
    let mut child = Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .unwrap();
    write!(child.stdin.take().unwrap(), "{input}").unwrap();
    child.wait_with_output().unwrap()
}
fn scenario(years: i64, steps: Value) -> Value {
    json!({"customer":{"yearsWithMHPCO":years},"steps":steps})
}
fn results(years: i64, steps: Value) -> Value {
    let output = execute(scenario(years, steps));
    assert!(output.status.success(), "{}", String::from_utf8_lossy(&output.stderr));
    serde_json::from_slice(&output.stdout).unwrap()
}
fn quote(items: Value) -> Value { json!({"op":"quote","items":items}) }
fn claim(policy: usize, damages: Value) -> Value {
    json!({"op":"claim","policy":policy,"incident":{"cause":"dragon attack","damages":damages}})
}
fn premium(years: i64, items: Value) -> i64 {
    results(years, json!([quote(items)]))["results"][0]["premium"].as_i64().unwrap()
}
fn rejected(steps: Value) {
    let output = execute(scenario(0, steps));
    assert!(!output.status.success());
    assert!(!output.stderr.is_empty());
    assert!(!String::from_utf8_lossy(&output.stdout).contains("results"));
}

#[test]
fn empty_quote() { assert_eq!(premium(0, json!([])), 5); }
#[test]
fn sword_quote() { assert_eq!(premium(0, json!([{"type":"sword"}])), 115); }
#[test]
fn amulet_quote() { assert_eq!(premium(0, json!([{"type":"amulet"}])), 71); }
#[test]
fn staff_quote() { assert_eq!(premium(0, json!([{"type":"staff"}])), 93); }
#[test]
fn potion_quote() { assert_eq!(premium(0, json!([{"type":"potion"}])), 49); }
#[test]
fn rune_quote() { assert_eq!(premium(0, json!([{"type":"rune"}])), 33); }
#[test]
fn moonstone_quote() { assert_eq!(premium(0, json!([{"type":"moonstone"}])), 33); }
#[test]
fn two_runes() { assert_eq!(premium(0, json!([{"type":"rune"},{"type":"rune"}])), 60); }
#[test]
fn three_runes() { assert_eq!(premium(0, json!([{"type":"rune"},{"type":"rune"},{"type":"rune"}])), 71); }
#[test]
fn four_runes() { assert_eq!(premium(0, json!([{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}])), 115); }
#[test]
fn seven_runes() { assert_eq!(premium(0, json!([{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}])), 198); }
#[test]
fn mixed_components() { assert_eq!(premium(0, json!([{"type":"rune"},{"type":"rune"},{"type":"moonstone"}])), 88); }
#[test]
fn two_blocks() { assert_eq!(premium(0, json!([{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}])), 137); }
#[test]
fn curse_scope() { assert_eq!(premium(0, json!([{"type":"sword","cursed":true},{"type":"amulet"}])), 231); }
#[test]
fn cursed_newcomer() { assert_eq!(premium(0, json!([{"type":"sword","material":"steel","enchantment":3,"cursed":true}])), 165); }
#[test]
fn enchantment_four() { assert_eq!(premium(0, json!([{"type":"sword","enchantment":4}])), 115); }
#[test]
fn enchantment_five() { assert_eq!(premium(0, json!([{"type":"sword","enchantment":5}])), 145); }
#[test]
fn enchanted_cursed() { assert_eq!(premium(0, json!([{"type":"sword","enchantment":5,"cursed":true}])), 195); }
#[test]
fn loyalty_threshold() { assert_eq!(premium(2, json!([{"type":"sword"}])), 95); }
#[test]
fn before_loyalty() { assert_eq!(premium(1, json!([{"type":"sword"}])), 115); }
#[test]
fn follow_up() { assert_eq!(results(0, json!([quote(json!([{"type":"sword"}])),quote(json!([{"type":"sword"}]))])), json!({"results":[{"premium":115},{"premium":100}]})); }
#[test]
fn longstanding_second() { assert_eq!(results(3, json!([quote(json!([])),quote(json!([{"type":"sword","material":"steel","enchantment":7,"cursed":true}]))])), json!({"results":[{"premium":5},{"premium":160}]})); }
#[test]
fn regular_claim() { assert_eq!(results(0, json!([quote(json!([{"type":"sword","material":"steel","enchantment":3}])),claim(0,json!([{"itemType":"sword","amount":500}]))])), json!({"results":[{"premium":115},{"payout":400,"remainingCap":1600}]})); }
#[test]
fn rune_claim() { assert_eq!(results(0, json!([quote(json!([{"type":"rune"}])),claim(0,json!([{"itemType":"rune","amount":200}]))])), json!({"results":[{"premium":33},{"payout":100,"remainingCap":400}]})); }
#[test]
fn dragon_five() { assert_eq!(results(0, json!([quote(json!([{"type":"sword","material":"dragon","enchantment":5}])),claim(0,json!([{"itemType":"sword","amount":800}]))]))["results"][1]["payout"], 700); }
#[test]
fn steel_nine() { assert_eq!(results(0, json!([quote(json!([{"type":"sword","material":"steel","enchantment":9}])),claim(0,json!([{"itemType":"sword","amount":1000}]))]))["results"][1]["payout"], 400); }
#[test]
fn dragon_eight() { assert_eq!(results(0, json!([quote(json!([{"type":"sword","material":"dragon","enchantment":8}])),claim(0,json!([{"itemType":"sword","amount":1000}]))]))["results"][1]["payout"], 400); }
#[test]
fn dragon_nine() { assert_eq!(results(0, json!([quote(json!([{"type":"sword","material":"dragon","enchantment":9}])),claim(0,json!([{"itemType":"sword","amount":1000}]))]))["results"][1]["payout"], 400); }
#[test]
fn two_damages() { assert_eq!(results(0, json!([quote(json!([{"type":"sword"},{"type":"amulet"}])),claim(0,json!([{"itemType":"sword","amount":500},{"itemType":"amulet","amount":300}]))]))["results"][1], json!({"payout":600,"remainingCap":2600})); }
#[test]
fn two_swords() { assert_eq!(results(0, json!([quote(json!([{"type":"sword"},{"type":"sword"}])),claim(0,json!([{"itemType":"sword","amount":500},{"itemType":"sword","amount":300}]))]))["results"][1], json!({"payout":600,"remainingCap":3400})); }
#[test]
fn combined_cap() { assert_eq!(results(0, json!([quote(json!([{"type":"sword"},{"type":"amulet"}])),claim(0,json!([]))]))["results"][1], json!({"payout":0,"remainingCap":3200})); }
#[test]
fn cursed_cap() { assert_eq!(results(0, json!([quote(json!([{"type":"sword","cursed":true}])),claim(0,json!([]))])), json!({"results":[{"premium":165},{"payout":0,"remainingCap":2000}]})); }
#[test]
fn block_cap() { assert_eq!(results(0, json!([quote(json!([{"type":"sword"},{"type":"rune"},{"type":"rune"},{"type":"rune"}])),claim(0,json!([]))]))["results"][1], json!({"payout":0,"remainingCap":3500})); }
#[test]
fn cap_exhaustion() { assert_eq!(results(0, json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"sword","amount":1500}])),claim(0,json!([{"itemType":"sword","amount":1500}]))]))["results"], json!([{"premium":115},{"payout":1400,"remainingCap":600},{"payout":600,"remainingCap":0}])); }
#[test]
fn payout_rounding() {
    assert_eq!(results(0, json!([quote(json!([{"type":"sword","enchantment":8}])),claim(0,json!([{"itemType":"sword","amount":901}]))]))["results"][1]["payout"], 350);
    assert_eq!(results(0, json!([quote(json!([{"type":"sword","enchantment":8},{"type":"sword","enchantment":8}])),claim(0,json!([{"itemType":"sword","amount":501},{"itemType":"sword","amount":501}]))]))["results"][1]["payout"], 301);
}
#[test]
fn schema_example() { assert_eq!(results(5, json!([quote(json!([{"type":"amulet","material":"silver","enchantment":2,"cursed":false}])),json!({"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}})])), json!({"results":[{"premium":59},{"payout":100,"remainingCap":1100}]})); }
#[test]
fn unknown_quote() { rejected(json!([quote(json!([{"type":"broomstick"}]))])); }
#[test]
fn uninsured_damage() { rejected(json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"amulet","amount":200}]))])); }
#[test]
fn unknown_damage() { rejected(json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"broomstick","amount":200}]))])); }
#[test]
fn excessive_damages() { rejected(json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"sword","amount":200},{"itemType":"sword","amount":200}]))])); }
#[test]
fn negative_damage() { rejected(json!([quote(json!([{"type":"sword"}])),claim(0,json!([{"itemType":"sword","amount":-200}]))])); }

#[test]
fn staff_cap() { assert_eq!(results(0, json!([quote(json!([{"type":"staff"}])),claim(0,json!([]))]))["results"][1]["remainingCap"], 1600); }
#[test]
fn potion_cap() { assert_eq!(results(0, json!([quote(json!([{"type":"potion"}])),claim(0,json!([]))]))["results"][1]["remainingCap"], 800); }
#[test]
fn moonstone_cap() { assert_eq!(results(0, json!([quote(json!([{"type":"moonstone"}])),claim(0,json!([]))]))["results"][1]["remainingCap"], 500); }
