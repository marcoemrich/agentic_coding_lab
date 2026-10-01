use serde_json::{Value, json};
use std::io::Write;

fn scenario(years: i64, steps: Vec<Value>) -> Result<Value, String> {
    kata::run(&json!({"customer":{"yearsWithMHPCO":years},"steps":steps}))
}
fn quote(items: Vec<Value>) -> Value { json!({"op":"quote","items":items}) }
fn claim(policy: usize, damages: Vec<Value>) -> Value {
    json!({"op":"claim","policy":policy,"incident":{"cause":"dragon attack","damages":damages}})
}
fn damage(item_type: &str, amount: i64) -> Value { json!({"itemType":item_type,"amount":amount}) }
fn check_quote(years: i64, steps: Vec<Value>, premiums: &[i64]) {
    let expected: Vec<Value> = premiums.iter().map(|p| json!({"premium":p})).collect();
    assert_eq!(scenario(years,steps).unwrap(),json!({"results":expected}));
}
fn check_claim(years:i64, items:Vec<Value>, damages:Vec<Value>, payout:i64, cap:i64) {
    assert_eq!(scenario(years,vec![quote(items),claim(0,damages)]).unwrap()["results"][1],json!({"payout":payout,"remainingCap":cap}));
}
fn reject_cli(steps:Vec<Value>) {
    let mut child = std::process::Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(std::process::Stdio::piped()).stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped()).spawn().unwrap();
    child.stdin.take().unwrap().write_all(json!({"customer":{"yearsWithMHPCO":0},"steps":steps}).to_string().as_bytes()).unwrap();
    let output=child.wait_with_output().unwrap();
    assert!(!output.status.success());
    assert!(!output.stderr.is_empty());
    assert!(!String::from_utf8_lossy(&output.stdout).contains("results"));
}
macro_rules! active { ($name:ident, $body:block) => { #[test] fn $name() $body }; }
active!(empty_steps, { assert_eq!(scenario(0,vec![]).unwrap(),json!({"results":[]})); });
active!(empty_items, { check_quote(0,vec![quote(vec![])],&[5]); });
active!(sword_price, { check_quote(0,vec![quote(vec![json!({"type":"sword"})])],&[115]); });
active!(amulet_price, { check_quote(0,vec![quote(vec![json!({"type":"amulet"})])],&[71]); });
active!(staff_price, { check_quote(0,vec![quote(vec![json!({"type":"staff"})])],&[93]); });
active!(potion_price, { check_quote(0,vec![quote(vec![json!({"type":"potion"})])],&[49]); });
active!(rune_price, { check_quote(0,vec![quote(vec![json!({"type":"rune"})])],&[33]); });
active!(moonstone_price, { check_quote(0,vec![quote(vec![json!({"type":"moonstone"})])],&[33]); });
active!(two_runes, { check_quote(0,vec![quote(vec![json!({"type":"rune"});2])],&[60]); });
active!(three_runes, { check_quote(0,vec![quote(vec![json!({"type":"rune"});3])],&[71]); });
active!(four_runes, { check_quote(0,vec![quote(vec![json!({"type":"rune"});4])],&[115]); });
active!(seven_runes, { check_quote(0,vec![quote(vec![json!({"type":"rune"});7])],&[198]); });
active!(mixed_components, { let mut items=vec![json!({"type":"rune"});2]; items.push(json!({"type":"moonstone"})); check_quote(0,vec![quote(items)],&[88]); });
active!(two_blocks, { let mut items=vec![json!({"type":"rune"});3]; items.extend(vec![json!({"type":"moonstone"});3]); check_quote(0,vec![quote(items)],&[137]); });
active!(curse_scope, { check_quote(0,vec![quote(vec![json!({"type":"sword","cursed":true}),json!({"type":"amulet"})])],&[231]); });
active!(cursed_newcomer, { check_quote(0,vec![quote(vec![json!({"type":"sword","material":"steel","enchantment":3,"cursed":true})])],&[165]); });
active!(enchantment_four, { check_quote(0,vec![quote(vec![json!({"type":"sword","enchantment":4})])],&[115]); });
active!(enchantment_five, { check_quote(0,vec![quote(vec![json!({"type":"sword","enchantment":5})])],&[145]); });
active!(cursed_enchanted, { check_quote(0,vec![quote(vec![json!({"type":"sword","enchantment":5,"cursed":true})])],&[195]); });
active!(loyalty_threshold, { check_quote(2,vec![quote(vec![json!({"type":"sword"})])],&[95]); });
active!(before_loyalty, { check_quote(1,vec![quote(vec![json!({"type":"sword"})])],&[115]); });
active!(followup, { let sword=quote(vec![json!({"type":"sword"})]); check_quote(0,vec![sword.clone(),sword],&[115,100]); });
active!(longstanding_second, { check_quote(3,vec![quote(vec![]),quote(vec![json!({"type":"sword","material":"steel","enchantment":7,"cursed":true})])],&[5,160]); });
active!(dragon_eight, { check_claim(0,vec![json!({"type":"sword","material":"dragon","enchantment":8})],vec![damage("sword",1000)],400,1600); });
active!(regular_claim, { check_claim(0,vec![json!({"type":"sword","material":"steel","enchantment":3})],vec![damage("sword",500)],400,1600); });
active!(rune_claim, { check_claim(0,vec![json!({"type":"rune"})],vec![damage("rune",200)],100,400); });
active!(dragon_nine, { check_claim(0,vec![json!({"type":"sword","material":"dragon","enchantment":9})],vec![damage("sword",1000)],400,1600); });
active!(dragon_five, { check_claim(0,vec![json!({"type":"sword","material":"dragon","enchantment":5})],vec![damage("sword",800)],700,1300); });
active!(steel_nine, { check_claim(0,vec![json!({"type":"sword","material":"steel","enchantment":9})],vec![damage("sword",1000)],400,1600); });
active!(two_damages, { check_claim(0,vec![json!({"type":"sword"}),json!({"type":"amulet"})],vec![damage("sword",500),damage("amulet",300)],600,2600); });
active!(two_swords, { check_claim(0,vec![json!({"type":"sword"});2],vec![damage("sword",500);2],800,3200); });
active!(mixed_cap, { check_claim(0,vec![json!({"type":"sword"}),json!({"type":"amulet"})],vec![damage("sword",500)],400,2800); });
active!(cursed_cap, { check_claim(0,vec![json!({"type":"sword","cursed":true})],vec![damage("sword",500)],400,1600); });
active!(block_cap, { let mut items=vec![json!({"type":"sword"})]; items.extend(vec![json!({"type":"rune"});3]); check_claim(0,items,vec![damage("rune",200)],100,3400); });
active!(exhausted_cap, { let result=scenario(0,vec![quote(vec![json!({"type":"sword"})]),claim(0,vec![damage("sword",1500)]),claim(0,vec![damage("sword",1500)])]).unwrap(); assert_eq!(result["results"][1],json!({"payout":1400,"remainingCap":600})); assert_eq!(result["results"][2],json!({"payout":600,"remainingCap":0})); });
active!(payout_rounding, { check_claim(0,vec![json!({"type":"sword","enchantment":8})],vec![damage("sword",901)],350,1650); });
active!(unknown_quote, { reject_cli(vec![quote(vec![json!({"type":"broomstick"})])]); });
active!(uninsured_damage, { reject_cli(vec![quote(vec![json!({"type":"sword"})]),claim(0,vec![damage("amulet",200)])]); });
active!(unknown_damage, { reject_cli(vec![quote(vec![json!({"type":"sword"})]),claim(0,vec![damage("broomstick",200)])]); });
active!(excess_damage, { reject_cli(vec![quote(vec![json!({"type":"sword"})]),claim(0,vec![damage("sword",200);2])]); });
active!(negative_damage, { reject_cli(vec![quote(vec![json!({"type":"sword"})]),claim(0,vec![damage("sword",-200)])]); });
active!(schema_example, { let result=scenario(5,vec![quote(vec![json!({"type":"amulet","material":"silver","enchantment":2,"cursed":false})]),claim(0,vec![damage("amulet",200)])]).unwrap(); assert_eq!(result,json!({"results":[{"premium":59},{"payout":100,"remainingCap":1100}]})); });
