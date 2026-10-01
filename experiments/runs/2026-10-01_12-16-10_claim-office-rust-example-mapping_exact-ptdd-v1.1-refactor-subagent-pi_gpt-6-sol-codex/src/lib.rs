mod domain;

pub fn scenario(input: &serde_json::Value) -> Result<serde_json::Value, String> {
    domain::run(input)
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::{Value, json};

    fn quote(items: Value, years: i64) -> Value {
        json!({"customer":{"yearsWithMHPCO":years},"steps":[{"op":"quote","items":items}]})
    }
    fn premium(items: Value, years: i64) -> i64 {
        scenario(&quote(items, years)).unwrap()["results"][0]["premium"].as_i64().unwrap()
    }
    fn claim_case(items: Value, damages: Value) -> Value {
        scenario(&json!({"customer":{"yearsWithMHPCO":0},"steps":[
            {"op":"quote","items":items},
            {"op":"claim","policy":0,"incident":{"cause":"dragon attack","damages":damages}}
        ]})).unwrap()["results"][1].clone()
    }
    fn check(name: &str) {
        let sword = json!({"type":"sword"});
        let runes = |n| json!(vec![json!({"type":"rune"}); n]);
        let damage = |kind: &str, amount| json!([{"itemType":kind,"amount":amount}]);
        match name {
            "staff_price" => assert_eq!(premium(json!([{"type":"staff"}]),0),93),
            "potion_price" => assert_eq!(premium(json!([{"type":"potion"}]),0),49),
            "rune_price" => assert_eq!(premium(runes(1),0),33),
            "moonstone_price" => assert_eq!(premium(json!([{"type":"moonstone"}]),0),33),
            "two_runes" => assert_eq!(premium(runes(2),0),60),
            "three_runes" => assert_eq!(premium(runes(3),0),71),
            "four_runes" => assert_eq!(premium(runes(4),0),115),
            "seven_runes" | "premium_rounding" => assert_eq!(premium(runes(7),0),198),
            "mixed_components" => assert_eq!(premium(json!([{"type":"rune"},{"type":"rune"},{"type":"moonstone"}]),0),88),
            "two_blocks" => assert_eq!(premium(json!([{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}]),0),137),
            "curse_scope" => assert_eq!(premium(json!([{"type":"sword","cursed":true},{"type":"amulet"}]),0),231),
            "enchantment_four" => assert_eq!(premium(json!([{"type":"sword","enchantment":4}]),0),115),
            "enchantment_five" => assert_eq!(premium(json!([{"type":"sword","enchantment":5}]),0),145),
            "curse_and_enchantment" => assert_eq!(premium(json!([{"type":"sword","cursed":true,"enchantment":5}]),0),195),
            "loyalty_threshold" => assert_eq!(premium(json!([sword]),2),95),
            "policy_modifier_scope" => assert_eq!(premium(json!([{"type":"sword","cursed":true},{"type":"amulet"}]),2),199),
            "first_insurance" => assert_eq!(premium(json!([sword]),0),115),
            "followup_discount" => assert_eq!(scenario(&json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[]},{"op":"quote","items":[sword]}]})).unwrap()["results"][1]["premium"],100),
            "newcomer" => assert_eq!(premium(json!([{"type":"sword","cursed":true,"material":"steel","enchantment":3}]),0),165),
            "longstanding_second" => assert_eq!(scenario(&json!({"customer":{"yearsWithMHPCO":3},"steps":[{"op":"quote","items":[]},{"op":"quote","items":[{"type":"sword","cursed":true,"material":"steel","enchantment":7}]}]})).unwrap()["results"][1]["premium"],160),
            "standard_sword_claim" => assert_eq!(claim_case(json!([{"type":"sword","material":"steel","enchantment":3}]),damage("sword",500))["payout"],400),
            "rune_claim" => assert_eq!(claim_case(runes(1),damage("rune",200))["payout"],100),
            "dragon_eight" | "dragon_nine" => assert_eq!(claim_case(json!([{"type":"sword","material":"dragon","enchantment":if name == "dragon_eight" {8} else {9}}]),damage("sword",1000))["payout"],400),
            "dragon_five" => assert_eq!(claim_case(json!([{"type":"sword","material":"dragon","enchantment":5}]),damage("sword",800))["payout"],700),
            "steel_nine" => assert_eq!(claim_case(json!([{"type":"sword","material":"steel","enchantment":9}]),damage("sword",1000))["payout"],400),
            "multiple_damages" => assert_eq!(claim_case(json!([sword,{"type":"amulet"}]),json!([{"itemType":"sword","amount":500},{"itemType":"amulet","amount":300}]))["payout"],600),
            "two_swords" => assert_eq!(claim_case(json!([sword,sword]),json!([]))["remainingCap"],4000),
            "two_sword_damages" => assert_eq!(claim_case(json!([sword,sword]),json!([{"itemType":"sword","amount":500},{"itemType":"sword","amount":500}]))["payout"],800),
            "sword_amulet_cap" => assert_eq!(claim_case(json!([sword,{"type":"amulet"}]),json!([]))["remainingCap"],3200),
            "cursed_cap" => assert_eq!(claim_case(json!([{"type":"sword","cursed":true}]),json!([]))["remainingCap"],2000),
            "block_cap" => assert_eq!(claim_case(json!([sword,{"type":"rune"},{"type":"rune"},{"type":"rune"}]),json!([]))["remainingCap"],3500),
            "cap_exhaustion" => {
                let result = scenario(&json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[sword]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1500}]}}]})).unwrap();
                assert_eq!(result["results"][1],json!({"payout":1400,"remainingCap":600}));
                assert_eq!(result["results"][2],json!({"payout":600,"remainingCap":0}));
            }
            "payout_rounding" => assert_eq!(claim_case(json!([{"type":"sword","enchantment":8}]),damage("sword",901))["payout"],350),
            "schema_sequence" => assert_eq!(scenario(&json!({"customer":{"yearsWithMHPCO":5},"steps":[{"op":"quote","items":[{"type":"amulet","material":"silver","enchantment":2,"cursed":false}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}]})).unwrap(),json!({"results":[{"premium":59},{"payout":100,"remainingCap":1100}]})),
            "unknown_quote" => assert!(scenario(&quote(json!([{"type":"broomstick"}]),0)).is_err()),
            "uninsured_damage" => assert!(scenario(&json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[sword]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}]})).is_err()),
            "unknown_damage" => assert!(scenario(&json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[sword]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"broomstick","amount":200}]}}]})).is_err()),
            "excess_same_type" => assert!(scenario(&json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[sword]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":200},{"itemType":"sword","amount":200}]}}]})).is_err()),
            "negative_damage" => assert!(scenario(&json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[sword]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":-200}]}}]})).is_err()),
            _ => panic!("uncovered case: {name}"),
        }
    }
    macro_rules! pending {
        ($($name:ident : $expectation:literal;)*) => {
            $(#[test]
            fn $name() { check(stringify!($name)); })*
        };
    }
    #[test]
    fn empty_items() {
        assert_eq!(scenario(&serde_json::json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[]}]})).unwrap(), serde_json::json!({"results":[{"premium":5}]}));
    }
    #[test]
    fn sword_price() {
        assert_eq!(scenario(&serde_json::json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]}]})).unwrap(), serde_json::json!({"results":[{"premium":115}]}));
    }
    #[test]
    fn amulet_price() {
        assert_eq!(scenario(&serde_json::json!({"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"amulet"}]}]})).unwrap()["results"][0]["premium"], 71);
    }
    pending! {
        staff_price: "staff value 800 G, base 80 G";
        potion_price: "potion value 400 G, base 40 G";
        rune_price: "rune value 250 G, base 25 G";
        moonstone_price: "moonstone value 250 G, base 25 G";
        two_runes: "2 runes base 50 G";
        three_runes: "3 runes base 60 G";
        four_runes: "4 runes base 100 G, no block";
        seven_runes: "7 runes base 175 G, no block";
        mixed_components: "2 runes + 1 moonstone base 75 G, different types";
        two_blocks: "3 runes + 3 moonstones base 120 G";
        curse_scope: "cursed sword + plain amulet base 160 G plus 50 G curse, not 80 G";
        enchantment_four: "enchantment 4 incurs no high enchantment surcharge";
        enchantment_five: "enchantment 5 incurs 30 G surcharge on sword";
        curse_and_enchantment: "cursed enchanted sword receives both 50 G and 30 G surcharges";
        loyalty_threshold: "2 years incurs 20 G discount on sword base";
        policy_modifier_scope: "loyalty applies to sum of base premiums, not surcharged premiums";
        first_insurance: "new sword incurs 10 G first-insurance surcharge";
        followup_discount: "second quote incurs 15 G discount on base sword";
        newcomer: "newcomer cursed sword premium 165 G";
        longstanding_second: "3-year customer second quote new cursed enchanted sword premium 160 G";
        premium_rounding: "fractional premium 197.5 rounds up to 198 G, once at end";
        standard_sword_claim: "steel sword enchantment 3 damage 500 pays 400 G";
        rune_claim: "rune damage 200 pays 100 G";
        dragon_eight: "dragon sword enchantment 8 damage 1000 pays 400 G";
        dragon_nine: "dragon sword enchantment 9 damage 1000 pays 400 G";
        dragon_five: "dragon sword enchantment 5 damage 800 pays 700 G";
        steel_nine: "steel sword enchantment 9 damage 1000 pays 400 G";
        multiple_damages: "sword 500 and amulet 300 pays 600 G, deductible per item";
        two_swords: "two swords insurance sum 2000 G cap 4000 G";
        two_sword_damages: "two sword entries each get own deductible";
        sword_amulet_cap: "sword + amulet cap 3200 G";
        cursed_cap: "cursed sword premium 165 G yet cap 2000 G";
        block_cap: "sword + 3 runes sum 1750 G cap 3500 G";
        cap_exhaustion: "two successive sword claims of 1500 pay 1400 then 600; remaining 600 then 0";
        payout_rounding: "fractional payout 350.5 rounds down 350 G once at end";
        schema_sequence: "schema example quote then claim yields integer premium, payout and remainingCap in results order";
        unknown_quote: "unknown broomstick quote: CLI nonzero, stderr description, no results stdout";
        uninsured_damage: "uninsured amulet damage: CLI nonzero and stderr description";
        unknown_damage: "unknown damage type: CLI nonzero and stderr description";
        excess_same_type: "two sword damages on one sword policy: CLI nonzero and stderr description";
        negative_damage: "negative damage -200: CLI nonzero and stderr description";
    }
}
