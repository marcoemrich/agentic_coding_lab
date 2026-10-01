use serde_json::{Value, json};
use std::io::Write;
use std::process::{Command, Stdio};

fn run(steps: Value, years: i64) -> std::process::Output {
    let mut child = Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped())
        .spawn().unwrap();
    child.stdin.take().unwrap().write_all(json!({"customer":{"yearsWithMHPCO":years},"steps":steps}).to_string().as_bytes()).unwrap();
    child.wait_with_output().unwrap()
}
fn result(steps: Value, years: i64) -> Value {
    let output = run(steps, years);
    assert!(output.status.success(), "{}", String::from_utf8_lossy(&output.stderr));
    serde_json::from_slice(&output.stdout).unwrap()
}
fn q(items: Value) -> Value { json!({"op":"quote","items":items}) }
fn c(policy: usize, damages: Value) -> Value {
    json!({"op":"claim","policy":policy,"incident":{"cause":"attack","damages":damages}})
}
fn premium(items: Value, years: i64) -> Value { result(json!([q(items)]), years)["results"][0]["premium"].clone() }
fn damage(item: &str, amount: i64) -> Value { json!({"itemType":item,"amount":amount}) }
fn claim(items: Value, damages: Value) -> Value {
    result(json!([q(items),c(0,damages)]), 0)["results"][1].clone()
}
fn swords(n: usize) -> Value { Value::Array((0..n).map(|_| json!({"type":"sword"})).collect()) }
fn components(kind: &str, n: usize) -> Vec<Value> { (0..n).map(|_| json!({"type":kind})).collect() }
fn component_list(kind: &str, n: usize) -> Value { Value::Array(components(kind,n)) }
fn invalid(steps: Value) {
    let output = run(steps, 0);
    assert!(!output.status.success());
    assert!(!output.stderr.is_empty());
    assert!(output.stdout.is_empty());
}
#[test]
fn empty_quote() { assert_eq!(premium(json!([]), 0), 5); }

// Insurance value is independent of each catalogue entry's premium.
#[test]
fn amulet_value() { assert_eq!(claim(json!([{"type":"amulet"}]),json!([]))["remainingCap"],1200); }
#[test]
fn staff_value() { assert_eq!(claim(json!([{"type":"staff"}]),json!([]))["remainingCap"],1600); }
#[test]
fn potion_value() { assert_eq!(claim(json!([{"type":"potion"}]),json!([]))["remainingCap"],800); }
#[test]
fn rune_value() { assert_eq!(claim(json!([{"type":"rune"}]),json!([]))["remainingCap"],500); }
#[test]
fn moonstone_value() { assert_eq!(claim(json!([{"type":"moonstone"}]),json!([]))["remainingCap"],500); }

macro_rules! quote_cases {
    ($($name:ident: $items:expr, $years:expr => $expected:expr;)*) => {
        $(#[test]
        fn $name() { assert_eq!(premium($items, $years), $expected); })*
    };
}
#[test]
fn sword_price() { assert_eq!(premium(swords(1),0),115); }
quote_cases! {

    amulet_price: json!([{"type":"amulet"}]), 0 => 71;
    staff_price: json!([{"type":"staff"}]), 0 => 93;
    potion_price: json!([{"type":"potion"}]), 0 => 49;
    rune_price: component_list("rune",1), 0 => 33;
    moonstone_price: component_list("moonstone",1), 0 => 33;
    two_runes: component_list("rune",2), 0 => 60;
    three_runes: component_list("rune",3), 0 => 71;
    four_runes: component_list("rune",4), 0 => 115;
    seven_runes: component_list("rune",7), 0 => 198;
    mixed_components: Value::Array([components("rune",2),components("moonstone",1)].concat()), 0 => 88;
    two_blocks: Value::Array([components("rune",3),components("moonstone",3)].concat()), 0 => 137;
    cursed_sword: json!([{"type":"sword","cursed":true}]), 0 => 165;
    cursed_item_scope: json!([{"type":"sword","cursed":true},{"type":"amulet"}]), 0 => 231;
    enchant_four: json!([{"type":"sword","enchantment":4}]), 0 => 115;
    enchant_five: json!([{"type":"sword","enchantment":5}]), 0 => 145;
    curse_and_enchant: json!([{"type":"sword","enchantment":5,"cursed":true}]), 0 => 195;
    loyalty_boundary: swords(1), 2 => 95;
    no_loyalty: swords(1), 1 => 115;
    premium_rounding: component_list("rune",7), 0 => 198;
}
#[test]
fn follow_up() { assert_eq!(result(json!([q(swords(1)),q(swords(1))]),0)["results"][1]["premium"],100); }
#[test]
fn first_insurance_new_item() { assert_eq!(result(json!([q(json!([{"type":"amulet"}])),q(swords(1))]),0)["results"][1]["premium"],100); }
#[test]
fn second_cursed_enchanted() { assert_eq!(result(json!([q(swords(1)),q(json!([{"type":"sword","material":"steel","enchantment":7,"cursed":true}]))]),3)["results"][1]["premium"],160); }
macro_rules! claim_cases {
    ($($name:ident: $items:expr, $damages:expr => $payout:expr, $remaining:expr;)*) => {
        $(#[test]
        fn $name() { let actual = claim($items,$damages); assert_eq!(actual,json!({"payout":$payout,"remainingCap":$remaining})); })*
    };
}
claim_cases! {
    regular_damage: json!([{"type":"sword","material":"steel","enchantment":3}]),json!([damage("sword",500)]) => 400,1600;
    rune_damage: component_list("rune",1),json!([damage("rune",200)]) => 100,400;
    enchant_eight_dragon: json!([{"type":"sword","material":"dragon","enchantment":8}]),json!([damage("sword",1000)]) => 400,1600;
    enchant_nine_dragon: json!([{"type":"sword","material":"dragon","enchantment":9}]),json!([damage("sword",1000)]) => 400,1600;
    dragon_five: json!([{"type":"sword","material":"dragon","enchantment":5}]),json!([damage("sword",800)]) => 700,1300;
    steel_nine: json!([{"type":"sword","material":"steel","enchantment":9}]),json!([damage("sword",1000)]) => 400,1600;
    multiple_deductibles: json!([{"type":"sword"},{"type":"amulet"}]),json!([damage("sword",500),damage("amulet",300)]) => 600,2600;
    two_swords: swords(2),json!([damage("sword",500),damage("sword",300)]) => 600,3400;
    sword_amulet_cap: json!([{"type":"sword"},{"type":"amulet"}]),json!([]) => 0,3200;
    cursed_cap: json!([{"type":"sword","cursed":true}]),json!([]) => 0,2000;
    block_cap: Value::Array([vec![json!({"type":"sword"})],components("rune",3)].concat()),json!([]) => 0,3500;
    payout_rounding: json!([{"type":"sword","enchantment":9}]),json!([damage("sword",901)]) => 350,1650;
}
#[test]
fn successive_claims() { let r=result(json!([q(swords(1)),c(0,json!([damage("sword",1500)])),c(0,json!([damage("sword",1500)]))]),0); assert_eq!(r["results"][1],json!({"payout":1400,"remainingCap":600})); assert_eq!(r["results"][2],json!({"payout":600,"remainingCap":0})); }
#[test]
fn excess_sword_damage() { invalid(json!([q(swords(1)),c(0,json!([damage("sword",200),damage("sword",200)]))])); }
#[test]
fn unknown_quote_type() { invalid(json!([q(json!([{"type":"broomstick"}]))])); }
#[test]
fn uninsured_damage() { invalid(json!([q(swords(1)),c(0,json!([damage("amulet",200)]))])); }
#[test]
fn unknown_damage_type() { invalid(json!([q(swords(1)),c(0,json!([damage("broomstick",200)]))])); }
#[test]
fn negative_damage() { invalid(json!([q(swords(1)),c(0,json!([damage("sword",-200)]))])); }
#[test]
fn schema_example() { assert_eq!(result(json!([q(json!([{"type":"amulet","material":"silver","enchantment":2,"cursed":false}])),c(0,json!([damage("amulet",200)]))]),5),json!({"results":[{"premium":59},{"payout":100,"remainingCap":1100}]})); }
