use serde_json::{Value, json};

fn scenario(years: i64, steps: Value) -> Value {
    json!({"customer":{"yearsWithMHPCO":years},"steps":steps})
}
fn checked(input: Value) -> Value {
    let output = kata::process(input).expect("valid scenario");
    output["results"].clone()
}
fn quote(years: i64, items: Value) -> i64 {
    checked(scenario(years, json!([{"op":"quote","items":items}])))[0]["premium"].as_i64().unwrap()
}
fn claim(items: Value, damages: Value) -> Value {
    checked(scenario(0, json!([{"op":"quote","items":items},{"op":"claim","policy":0,"incident":{"cause":"dragon attack","damages":damages}}])))[1].clone()
}

#[test]
fn empty_quote() { assert_eq!(quote(0,json!([])),5); }
#[test]
fn sword() { assert_eq!(quote(0,json!([{"type":"sword"}])),115); }
#[test]
fn amulet() { assert_eq!(quote(0,json!([{"type":"amulet"}])),71); }
#[test]
fn staff() { assert_eq!(quote(0,json!([{"type":"staff"}])),93); }
#[test] // previously inactive: "potion 40 G base plus 4 and fee 5 = 49"]
fn potion() { assert_eq!(quote(0,json!([{"type":"potion"}])),49); }
#[test] // previously inactive: "rune 25 G base plus 2.5 and fee 5 rounds up to 33"]
fn rune() { assert_eq!(quote(0,json!([{"type":"rune"}])),33); }
#[test] // previously inactive: "moonstone 25 G base plus 2.5 and fee 5 rounds up to 33"]
fn moonstone() { assert_eq!(quote(0,json!([{"type":"moonstone"}])),33); }
#[test] // previously inactive: "two runes base 50 G, premium 60 G"]
fn two_runes() { assert_eq!(quote(0,json!([{"type":"rune"},{"type":"rune"}])),60); }
#[test] // previously inactive: "three runes block base 60 G, premium 71 G"]
fn three_runes() { assert_eq!(quote(0,json!([{"type":"rune"},{"type":"rune"},{"type":"rune"}])),71); }
#[test] // previously inactive: "four runes no block base 100 G, premium 115 G"]
fn four_runes() { assert_eq!(quote(0,json!([{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}])),115); }
#[test] // previously inactive: "seven runes no block base 175 G, premium rounds to 198 G"]
fn seven_runes() { assert_eq!(quote(0,json!((0..7).map(|_|json!({"type":"rune"})).collect::<Vec<_>>())),198); }
#[test] // previously inactive: "two runes one moonstone different types base 75 G, premium 88 G"]
fn mixed_components() { assert_eq!(quote(0,json!([{"type":"rune"},{"type":"rune"},{"type":"moonstone"}])),88); }
#[test] // previously inactive: "three of each type two blocks base 120 G, premium 137 G"]
fn two_blocks() { assert_eq!(quote(0,json!((0..3).flat_map(|_|[json!({"type":"rune"}),json!({"type":"moonstone"})]).collect::<Vec<_>>())),137); }
#[test] // previously inactive: "cursed sword and plain amulet: surcharge 50 on sword only, base 160; premium 231 G"]
fn scoped_curse() { assert_eq!(quote(0,json!([{"type":"sword","cursed":true},{"type":"amulet"}])),231); }
#[test] // previously inactive: "enchantment 4 no high surcharge, cursed sword premium 165 G"]
fn enchantment_four() { assert_eq!(quote(0,json!([{"type":"sword","enchantment":4,"cursed":true}])),165); }
#[test] // previously inactive: "enchantment 5 cursed sword both surcharges premium 195 G"]
fn enchantment_five() { assert_eq!(quote(0,json!([{"type":"sword","enchantment":5,"cursed":true}])),195); }
#[test] // previously inactive: "exactly 2 years loyalty: sword premium 95 G"]
fn loyalty_two() { assert_eq!(quote(2,json!([{"type":"sword"}])),95); }
#[test] // previously inactive: "second quote follow-up discount applies to base, new sword still first insurance; second premium 100 G"]
fn second_quote() { let r=checked(scenario(0,json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"quote","items":[{"type":"sword"}]}]))); assert_eq!(r,json!([{"premium":115},{"premium":100}])); }
#[test] // previously inactive: "newcomer cursed steel sword enchantment 3 premium 165 G"]
fn newcomer() { assert_eq!(quote(0,json!([{"type":"sword","material":"steel","enchantment":3,"cursed":true}])),165); }
#[test] // previously inactive: "long-standing second quote cursed enchantment 7 sword premium 160 G"]
fn veteran_second() { let r=checked(scenario(3,json!([{"op":"quote","items":[]},{"op":"quote","items":[{"type":"sword","material":"steel","enchantment":7,"cursed":true}]}]))); assert_eq!(r[1]["premium"],160); }
#[test] // previously inactive: "regular sword damage 500 pays 400; remaining cap 1600"]
fn regular_claim() { assert_eq!(claim(json!([{"type":"sword","material":"steel","enchantment":3}]),json!([{"itemType":"sword","amount":500}])),json!({"payout":400,"remainingCap":1600})); }
#[test] // previously inactive: "rune damage 200 pays 100; remaining cap 400"]
fn rune_claim() { assert_eq!(claim(json!([{"type":"rune"}]),json!([{"itemType":"rune","amount":200}])),json!({"payout":100,"remainingCap":400})); }
#[test] // previously inactive: "dragon sword enchantment 5 damage 800 pays 700"]
fn dragon_five() { assert_eq!(claim(json!([{"type":"sword","material":"dragon","enchantment":5}]),json!([{"itemType":"sword","amount":800}]))["payout"],700); }
#[test] // previously inactive: "dragon sword enchantment exactly 8 damage 1000 pays 400"]
fn dragon_eight() { assert_eq!(claim(json!([{"type":"sword","material":"dragon","enchantment":8}]),json!([{"itemType":"sword","amount":1000}]))["payout"],400); }
#[test] // previously inactive: "dragon sword enchantment 9 damage 1000 pays 400"]
fn dragon_nine() { assert_eq!(claim(json!([{"type":"sword","material":"dragon","enchantment":9}]),json!([{"itemType":"sword","amount":1000}]))["payout"],400); }
#[test] // previously inactive: "steel sword enchantment 9 damage 1000 pays 400"]
fn steel_nine() { assert_eq!(claim(json!([{"type":"sword","material":"steel","enchantment":9}]),json!([{"itemType":"sword","amount":1000}]))["payout"],400); }
#[test] // previously inactive: "dragon attack sword 500 amulet 300: per-item deductibles pay 600"]
fn two_damages() { assert_eq!(claim(json!([{"type":"sword"},{"type":"amulet"}]),json!([{"itemType":"sword","amount":500},{"itemType":"amulet","amount":300}])),json!({"payout":600,"remainingCap":2600})); }
#[test] // previously inactive: "two swords insurance sum 2000 cap 4000; two damage entries each deductible pays 600"]
fn two_swords() { assert_eq!(claim(json!([{"type":"sword"},{"type":"sword"}]),json!([{"itemType":"sword","amount":500},{"itemType":"sword","amount":300}])),json!({"payout":600,"remainingCap":3400})); }
#[test] // previously inactive: "cursed sword premium 165 but cap 2000 unmodified"]
fn cursed_cap() { assert_eq!(claim(json!([{"type":"sword","cursed":true}]),json!([])),json!({"payout":0,"remainingCap":2000})); }
#[test] // previously inactive: "sword and three runes insurance sum 1750 cap 3500 despite block"]
fn block_cap() { assert_eq!(claim(json!([{"type":"sword"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]),json!([]))["remainingCap"],3500); }
#[test] // previously inactive: "two successive 1500 claims on sword pay 1400 then 600, remaining cap 0"]
fn cap_exhaustion() { let r=checked(scenario(0,json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}}]))); assert_eq!(r[1],json!({"payout":1400,"remainingCap":600})); assert_eq!(r[2],json!({"payout":600,"remainingCap":0})); }
#[test] // previously inactive: "fractional payout 350.5 rounds down to 350"]
fn payout_rounding() { assert_eq!(claim(json!([{"type":"sword","enchantment":8}]),json!([{"itemType":"sword","amount":901}]))["payout"],350); }
#[test] // previously inactive: "unknown quote type rejects entire scenario with error result"]
fn unknown_quote() { assert!(kata::process(scenario(0,json!([{"op":"quote","items":[{"type":"broomstick"}]}]))).is_err()); }
#[test] // previously inactive: "uninsured amulet damage rejects entire scenario with error result"]
fn uninsured() { assert!(kata::process(scenario(0,json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}]))).is_err()); }
#[test] // previously inactive: "unknown damage type rejects entire scenario with error result"]
fn unknown_damage() { assert!(kata::process(scenario(0,json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"broomstick","amount":200}]}}]))).is_err()); }
#[test] // previously inactive: "two damages but one insured sword rejects entire claim with error result"]
fn excess_damages() { assert!(kata::process(scenario(0,json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":200},{"itemType":"sword","amount":200}]}}]))).is_err()); }
#[test] // previously inactive: "negative damage -200 rejects entire claim with error result"]
fn negative_damage() { assert!(kata::process(scenario(0,json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":-200}]}}]))).is_err()); }

#[test]
fn staff_insurance_value() { assert_eq!(claim(json!([{"type":"staff"}]),json!([]))["remainingCap"],1600); }
#[test]
fn potion_insurance_value() { assert_eq!(claim(json!([{"type":"potion"}]),json!([]))["remainingCap"],800); }
#[test]
fn moonstone_insurance_value_and_claim() { assert_eq!(claim(json!([{"type":"moonstone"}]),json!([{"itemType":"moonstone","amount":200}])),json!({"payout":100,"remainingCap":400})); }
#[test]
fn scoped_enchantment() { assert_eq!(quote(0,json!([{"type":"sword","enchantment":5},{"type":"amulet"}])),211); }
