use serde_json::{Value, json};
use std::io::Write;
use std::process::{Command, Stdio};

fn run(input: Value) -> std::process::Output {
    let mut child = Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped())
        .spawn().expect("start kata");
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
fn damage(item: &str, amount: i64) -> Value { json!({"itemType":item,"amount":amount}) }
fn results(years: i64, steps: Value) -> Value {
    let output = run(scenario(years,steps));
    assert!(output.status.success(), "{}", String::from_utf8_lossy(&output.stderr));
    serde_json::from_slice(&output.stdout).unwrap()
}
fn rejected(years: i64, steps: Value) {
    let output = run(scenario(years,steps));
    assert!(!output.status.success());
    assert!(!output.stderr.is_empty());
    assert!(!String::from_utf8_lossy(&output.stdout).contains("results"));
}
macro_rules! active {
    ($name:ident, $description:literal, $years:expr, $steps:expr, $expected:expr) => {
        #[test]
        fn $name() { assert_eq!(results($years, $steps), json!({"results":$expected})); }
    };
}
active!(empty_items, "empty quote -> 5 G fee", 0, json!([quote(json!([]))]), json!([{"premium":5}]));
active!(sword_price, "sword 1000 G value, 100 G base -> first premium 115 G", 0, json!([quote(json!([{"type":"sword"}]))]), json!([{"premium":115}]));
active!(amulet_price, "amulet 600 G value, 60 G base -> 71 G", 0, json!([quote(json!([{"type":"amulet"}]))]), json!([{"premium":71}]));
active!(staff_price, "staff 800 G value, 80 G base -> 93 G", 0, json!([quote(json!([{"type":"staff"}]))]), json!([{"premium":93}]));
active!(potion_price, "potion 400 G value, 40 G base -> 49 G", 0, json!([quote(json!([{"type":"potion"}]))]), json!([{"premium":49}]));
active!(rune_price, "rune 250 G value, 25 G base -> rounded 33 G", 0, json!([quote(json!([{"type":"rune"}]))]), json!([{"premium":33}]));
active!(moonstone_price, "moonstone 250 G value, 25 G base -> rounded 33 G", 0, json!([quote(json!([{"type":"moonstone"}]))]), json!([{"premium":33}]));
active!(two_runes, "2 runes base 50 G -> 60 G", 0, json!([quote(json!([{"type":"rune"},{"type":"rune"}]))]), json!([{"premium":60}]));
active!(three_runes, "3 runes base 60 G -> 71 G", 0, json!([quote(json!([{"type":"rune"},{"type":"rune"},{"type":"rune"}]))]), json!([{"premium":71}]));
active!(four_runes, "4 runes base 100 G, no block -> 115 G", 0, json!([quote(json!([{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]))]), json!([{"premium":115}]));
active!(seven_runes, "7 runes base 175 G, no block -> 198 G", 0, json!([quote(json!([{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]))]), json!([{"premium":198}]));
active!(mixed_components, "2 runes + moonstone base 75 G, no mixed block -> 88 G", 0, json!([quote(json!([{"type":"rune"},{"type":"rune"},{"type":"moonstone"}]))]), json!([{"premium":88}]));
active!(two_blocks, "3 runes + 3 moonstones base 120 G -> 137 G", 0, json!([quote(json!([{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}]))]), json!([{"premium":137}]));
active!(cursed_sword, "newcomer cursed steel sword enchantment 3 -> 165 G", 0, json!([quote(json!([{"type":"sword","material":"steel","enchantment":3,"cursed":true}]))]), json!([{"premium":165}]));
active!(curse_scope, "cursed sword + plain amulet base 160 G, curse adds only 50 G -> 231 G including first surcharge and fee", 0, json!([quote(json!([{"type":"sword","cursed":true},{"type":"amulet"}]))]), json!([{"premium":231}]));
active!(enchantment_four, "enchantment 4 sword without curse -> 115 G", 0, json!([quote(json!([{"type":"sword","enchantment":4}]))]), json!([{"premium":115}]));
active!(enchantment_five, "enchantment 5 sword high risk -> 145 G", 0, json!([quote(json!([{"type":"sword","enchantment":5}]))]), json!([{"premium":145}]));
active!(both_risks, "cursed enchantment 5 sword stacks both risk surcharges -> 195 G", 0, json!([quote(json!([{"type":"sword","enchantment":5,"cursed":true}]))]), json!([{"premium":195}]));
active!(loyalty_below, "one year has no loyalty discount -> 115 G sword", 1, json!([quote(json!([{"type":"sword"}]))]), json!([{"premium":115}]));
active!(loyalty_at_two, "exactly 2 years gives 20 percent base loyalty discount -> 95 G sword", 2, json!([quote(json!([{"type":"sword"}]))]), json!([{"premium":95}]));
active!(followup, "second quote receives 15 percent base discount but both items receive first insurance surcharge -> 115 G then 100 G", 0, json!([quote(json!([{"type":"sword"}])),quote(json!([{"type":"sword"}]))]), json!([{"premium":115},{"premium":100}]));
active!(longstanding_second, "3 year customer's second quote for new cursed enchanted 7 sword -> 160 G", 3, json!([quote(json!([])),quote(json!([{"type":"sword","material":"steel","enchantment":7,"cursed":true}]))]), json!([{"premium":5},{"premium":160}]));
active!(schema_example, "schema example amulet quote and fire claim -> 59 G then payout 100 G remaining cap 1100 G", 5, json!([quote(json!([{"type":"amulet","material":"silver","enchantment":2,"cursed":false}])),claim(0,json!([damage("amulet",200)]))]), json!([{"premium":59},{"payout":100,"remainingCap":1100}]));
active!(regular_claim, "steel enchantment 3 sword damage 500 -> payout 400 G cap 1600 G", 0, json!([quote(json!([{"type":"sword","material":"steel","enchantment":3}])),claim(0,json!([damage("sword",500)]))]), json!([{"premium":115},{"payout":400,"remainingCap":1600}]));
active!(rune_claim, "rune damage 200 -> payout 100 G cap 400 G", 0, json!([quote(json!([{"type":"rune"}])),claim(0,json!([damage("rune",200)]))]), json!([{"premium":33},{"payout":100,"remainingCap":400}]));
active!(dragon_five, "dragon sword enchantment 5 damage 800 -> full less deductible 700 G", 0, json!([quote(json!([{"type":"sword","material":"dragon","enchantment":5}])),claim(0,json!([damage("sword",800)]))]), json!([{"premium":145},{"payout":700,"remainingCap":1300}]));
active!(steel_nine, "steel sword enchantment 9 damage 1000 -> half less deductible 400 G", 0, json!([quote(json!([{"type":"sword","material":"steel","enchantment":9}])),claim(0,json!([damage("sword",1000)]))]), json!([{"premium":145},{"payout":400,"remainingCap":1600}]));
active!(dragon_eight, "dragon sword exactly enchantment 8 damage 1000 -> half less deductible 400 G", 0, json!([quote(json!([{"type":"sword","material":"dragon","enchantment":8}])),claim(0,json!([damage("sword",1000)]))]), json!([{"premium":145},{"payout":400,"remainingCap":1600}]));
active!(dragon_nine, "dragon sword enchantment 9 damage 1000 -> half clause wins, payout 400 G", 0, json!([quote(json!([{"type":"sword","material":"dragon","enchantment":9}])),claim(0,json!([damage("sword",1000)]))]), json!([{"premium":145},{"payout":400,"remainingCap":1600}]));
active!(two_damages, "dragon attack sword 500 and amulet 300 -> two deductibles payout 600 G", 0, json!([quote(json!([{"type":"sword"},{"type":"amulet"}])),claim(0,json!([damage("sword",500),damage("amulet",300)]))]), json!([{"premium":181},{"payout":600,"remainingCap":2600}]));
active!(two_swords, "two swords sum 2000 G cap 4000 G; two damages each has deductible", 0, json!([quote(json!([{"type":"sword"},{"type":"sword"}])),claim(0,json!([damage("sword",500),damage("sword",300)]))]), json!([{"premium":225},{"payout":600,"remainingCap":3400}]));
active!(staff_cap, "staff insurance value 800 G -> cap 1600 G", 0, json!([quote(json!([{"type":"staff"}])),claim(0,json!([]))]), json!([{"premium":93},{"payout":0,"remainingCap":1600}]));
active!(potion_cap, "potion insurance value 400 G -> cap 800 G", 0, json!([quote(json!([{"type":"potion"}])),claim(0,json!([]))]), json!([{"premium":49},{"payout":0,"remainingCap":800}]));
active!(moonstone_cap, "moonstone insurance value 250 G -> cap 500 G", 0, json!([quote(json!([{"type":"moonstone"}])),claim(0,json!([]))]), json!([{"premium":33},{"payout":0,"remainingCap":500}]));
active!(cursed_cap, "cursed sword premium 165 G but cap remains 2000 G", 0, json!([quote(json!([{"type":"sword","cursed":true}])),claim(0,json!([]))]), json!([{"premium":165},{"payout":0,"remainingCap":2000}]));
active!(block_cap, "sword and 3 runes sum 1750 G cap 3500 G despite block discount", 0, json!([quote(json!([{"type":"sword"},{"type":"rune"},{"type":"rune"},{"type":"rune"}])),claim(0,json!([]))]), json!([{"premium":181},{"payout":0,"remainingCap":3500}]));
active!(successive_claims, "sword claims 1500 twice -> payouts 1400 then 600, cap 600 then 0", 0, json!([quote(json!([{"type":"sword"}])),claim(0,json!([damage("sword",1500)])),claim(0,json!([damage("sword",1500)]))]), json!([{"premium":115},{"payout":1400,"remainingCap":600},{"payout":600,"remainingCap":0}]));
active!(payout_rounding, "half of 901 less deductible is 350.5 G -> payout rounded down 350 G", 0, json!([quote(json!([{"type":"sword","enchantment":8}])),claim(0,json!([damage("sword",901)]))]), json!([{"premium":145},{"payout":350,"remainingCap":1650}]));
#[test] 
fn unknown_quote() { rejected(0,json!([quote(json!([{"type":"broomstick"}]))])); }
#[test] 
fn uninsured_damage() { rejected(0,json!([quote(json!([{"type":"sword"}])),claim(0,json!([damage("amulet",200)]))])); }
#[test] 
fn unknown_damage() { rejected(0,json!([quote(json!([{"type":"sword"}])),claim(0,json!([damage("broomstick",200)]))])); }
#[test] 
fn excess_damage() { rejected(0,json!([quote(json!([{"type":"sword"}])),claim(0,json!([damage("sword",200),damage("sword",200)]))])); }
#[test] 
fn negative_damage() { rejected(0,json!([quote(json!([{"type":"sword"}])),claim(0,json!([damage("sword",-200)]))])); }
