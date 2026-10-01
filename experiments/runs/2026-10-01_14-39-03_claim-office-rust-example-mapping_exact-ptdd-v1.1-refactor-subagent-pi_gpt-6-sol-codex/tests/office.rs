use serde_json::{Value, json};
use std::io::Write;
use std::process::{Command, Stdio};

fn invoke(input: Value) -> std::process::Output {
    let mut child = Command::new(format!("{}/target/debug/kata", env!("CARGO_MANIFEST_DIR")))
        .stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped()).spawn().unwrap();
    child.stdin.take().unwrap().write_all(input.to_string().as_bytes()).unwrap();
    child.wait_with_output().unwrap()
}
fn check(years: i64, steps: Value, expected: Value) {
    let output = invoke(json!({"customer":{"yearsWithMHPCO":years},"steps":steps}));
    assert!(output.status.success(), "{}", String::from_utf8_lossy(&output.stderr));
    assert_eq!(serde_json::from_slice::<Value>(&output.stdout).unwrap(), json!({"results":expected}));
}
fn reject(steps: Value) {
    let output = invoke(json!({"customer":{"yearsWithMHPCO":0},"steps":steps}));
    assert!(!output.status.success());
    assert!(!output.stderr.is_empty());
    assert!(!String::from_utf8_lossy(&output.stdout).contains("results"));
}
macro_rules! example {
    ($name:ident, $reason:literal, $years:expr, $steps:expr, $expected:expr) => {
        #[test]
        fn $name() { check($years, $steps, $expected); }
    };
}
macro_rules! invalid {
    ($name:ident, $reason:literal, $steps:expr) => {
        #[test]
        fn $name() { reject($steps); }
    };
}
example!(empty_items, "empty quote: premium 5", 0, json!([{"op":"quote","items":[]}]), json!([{"premium":5}]));
example!(sword, "sword 1000 value, 100 base: premium 115", 0, json!([{"op":"quote","items":[{"type":"sword"}]}]), json!([{"premium":115}]));
example!(amulet, "amulet 600 value, 60 base: premium 71", 0, json!([{"op":"quote","items":[{"type":"amulet"}]}]), json!([{"premium":71}]));
example!(staff, "staff 800 value, 80 base: premium 93", 0, json!([{"op":"quote","items":[{"type":"staff"}]}]), json!([{"premium":93}]));
example!(potion, "potion 400 value, 40 base: premium 49", 0, json!([{"op":"quote","items":[{"type":"potion"}]}]), json!([{"premium":49}]));
example!(rune, "rune 250 value, 25 base: premium 33 rounded up", 0, json!([{"op":"quote","items":[{"type":"rune"}]}]), json!([{"premium":33}]));
example!(moonstone, "moonstone 250 value, 25 base: premium 33", 0, json!([{"op":"quote","items":[{"type":"moonstone"}]}]), json!([{"premium":33}]));
example!(two_runes, "2 runes base 50: premium 60", 0, json!([{"op":"quote","items":[{"type":"rune"},{"type":"rune"}]}]), json!([{"premium":60}]));
example!(three_runes, "3 runes block base 60: premium 71", 0, json!([{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"}]}]), json!([{"premium":71}]));
example!(four_runes, "4 runes no block base 100: premium 115", 0, json!([{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]}]), json!([{"premium":115}]));
example!(seven_runes, "7 runes no block base 175: premium 198", 0, json!([{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]}]), json!([{"premium":198}]));
example!(mixed_components, "2 runes + moonstone base 75 no block: premium 88", 0, json!([{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"moonstone"}]}]), json!([{"premium":88}]));
example!(two_blocks, "3 runes + 3 moonstones base 120: premium 137", 0, json!([{"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}]}]), json!([{"premium":137}]));
example!(curse, "cursed sword + plain amulet base 160 plus item-only 50: premium 231", 0, json!([{"op":"quote","items":[{"type":"sword","cursed":true},{"type":"amulet"}]}]), json!([{"premium":231}]));
example!(enchantment_four, "enchantment 4 has no high surcharge: premium 115", 0, json!([{"op":"quote","items":[{"type":"sword","enchantment":4}]}]), json!([{"premium":115}]));
example!(enchantment_five, "enchantment 5 adds 30: premium 145", 0, json!([{"op":"quote","items":[{"type":"sword","enchantment":5}]}]), json!([{"premium":145}]));
example!(both_modifiers, "cursed enchantment 5 adds 50 and 30: premium 195", 0, json!([{"op":"quote","items":[{"type":"sword","enchantment":5,"cursed":true}]}]), json!([{"premium":195}]));
example!(loyalty_threshold, "exactly 2 years takes 20 percent base discount: sword premium 95", 2, json!([{"op":"quote","items":[{"type":"sword"}]}]), json!([{"premium":95}]));
example!(before_loyalty, "one year has no loyalty discount: premium 115", 1, json!([{"op":"quote","items":[{"type":"sword"}]}]), json!([{"premium":115}]));
example!(newcomer, "newcomer cursed sword premium 165", 0, json!([{"op":"quote","items":[{"type":"sword","material":"steel","enchantment":3,"cursed":true}]}]), json!([{"premium":165}]));
example!(second_contract, "3 year customer's second quote cursed enchantment 7 sword premium 160", 3, json!([{"op":"quote","items":[]},{"op":"quote","items":[{"type":"sword","material":"steel","enchantment":7,"cursed":true}]}]), json!([{"premium":5},{"premium":160}]));
example!(premium_rounding, "197.5 premium rounds to 198 only at end", 0, json!([{"op":"quote","items":[]},{"op":"quote","items":[{"type":"sword","cursed":true},{"type":"rune"},{"type":"rune"}]}]), json!([{"premium":5},{"premium":198}]));
invalid!(unknown_quote, "unknown broomstick quote: nonzero exit, stderr, no results", json!([{"op":"quote","items":[{"type":"broomstick"}]}]));
example!(ordinary_damage, "steel enchantment 3 sword damage 500 pays 400, cap 1600", 0, json!([{"op":"quote","items":[{"type":"sword","material":"steel","enchantment":3}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":500}]}}]), json!([{"premium":115},{"payout":400,"remainingCap":1600}]));
example!(rune_damage, "rune damage 200 pays 100, cap 400", 0, json!([{"op":"quote","items":[{"type":"rune"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"rune","amount":200}]}}]), json!([{"premium":33},{"payout":100,"remainingCap":400}]));
example!(dragon_five, "dragon sword enchantment 5 damage 800 pays 700", 0, json!([{"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":5}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":800}]}}]), json!([{"premium":145},{"payout":700,"remainingCap":1300}]));
example!(dragon_eight, "dragon sword enchantment 8 damage 1000 pays 400", 0, json!([{"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":8}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1000}]}}]), json!([{"premium":145},{"payout":400,"remainingCap":1600}]));
example!(dragon_nine, "dragon sword enchantment 9 damage 1000 pays 400", 0, json!([{"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":9}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1000}]}}]), json!([{"premium":145},{"payout":400,"remainingCap":1600}]));
example!(steel_nine, "steel sword enchantment 9 damage 1000 pays 400", 0, json!([{"op":"quote","items":[{"type":"sword","material":"steel","enchantment":9}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1000}]}}]), json!([{"premium":145},{"payout":400,"remainingCap":1600}]));
example!(two_damages, "sword 500 and amulet 300 take separate deductibles: payout 600 cap 2600", 0, json!([{"op":"quote","items":[{"type":"sword"},{"type":"amulet"}]},{"op":"claim","policy":0,"incident":{"cause":"dragon","damages":[{"itemType":"sword","amount":500},{"itemType":"amulet","amount":300}]}}]), json!([{"premium":181},{"payout":600,"remainingCap":2600}]));
example!(two_swords, "two insured swords have cap 4000 and two separate deductions", 0, json!([{"op":"quote","items":[{"type":"sword"},{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"dragon","damages":[{"itemType":"sword","amount":500},{"itemType":"sword","amount":300}]}}]), json!([{"premium":225},{"payout":600,"remainingCap":3400}]));
example!(cap_exhaustion, "two successive sword claims 1500 pay 1400 then 600, remaining 0", 0, json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}}]), json!([{"premium":115},{"payout":1400,"remainingCap":600},{"payout":600,"remainingCap":0}]));
example!(cursed_cap, "cursed sword premium 165 but cap 2000", 0, json!([{"op":"quote","items":[{"type":"sword","cursed":true}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[]}}]), json!([{"premium":165},{"payout":0,"remainingCap":2000}]));
example!(block_cap, "sword + 3 runes insurance sum 1750 cap 3500 despite block", 0, json!([{"op":"quote","items":[{"type":"sword"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[]}}]), json!([{"premium":181},{"payout":0,"remainingCap":3500}]));
example!(staff_cap, "staff insurance value 800 gives cap 1600", 0, json!([{"op":"quote","items":[{"type":"staff"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[]}}]), json!([{"premium":93},{"payout":0,"remainingCap":1600}]));
example!(potion_cap, "potion insurance value 400 gives cap 800", 0, json!([{"op":"quote","items":[{"type":"potion"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[]}}]), json!([{"premium":49},{"payout":0,"remainingCap":800}]));
example!(moonstone_cap, "moonstone insurance value 250 gives cap 500", 0, json!([{"op":"quote","items":[{"type":"moonstone"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[]}}]), json!([{"premium":33},{"payout":0,"remainingCap":500}]));
example!(payout_rounding, "350.5 payout rounds down to 350", 0, json!([{"op":"quote","items":[{"type":"sword","enchantment":8}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":901}]}}]), json!([{"premium":145},{"payout":350,"remainingCap":1650}]));
invalid!(uninsured_damage, "uninsured amulet: nonzero exit and stderr", json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}]));
invalid!(unknown_damage, "unknown damage item type: nonzero exit and stderr", json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"broomstick","amount":200}]}}]));
invalid!(excess_damages, "two sword damage entries for one insured sword: reject whole claim with nonzero exit and stderr", json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"dragon","damages":[{"itemType":"sword","amount":500},{"itemType":"sword","amount":300}]}}]));
invalid!(negative_damage, "damage -200: nonzero exit and stderr", json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":-200}]}}]));
