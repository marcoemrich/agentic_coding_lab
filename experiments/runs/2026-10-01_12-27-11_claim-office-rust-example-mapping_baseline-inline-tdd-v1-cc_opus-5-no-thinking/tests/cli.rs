//! End-to-end tests driving the `kata` binary over stdin and stdout.

use std::io::Write;
use std::process::{Command, Output, Stdio};

/// Runs the CLI with `input` on stdin.
fn run_cli(input: &str) -> Output {
    let mut child = Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("the kata binary is built for this test");
    child
        .stdin
        .take()
        .expect("stdin was piped")
        .write_all(input.as_bytes())
        .expect("the CLI accepts the scenario");
    child.wait_with_output().expect("the CLI terminates")
}

/// Runs the CLI and returns its stdout, asserting it succeeded.
fn results_of(input: &str) -> String {
    let output = run_cli(input);
    assert!(
        output.status.success(),
        "expected success, got {:?} with stderr: {}",
        output.status,
        String::from_utf8_lossy(&output.stderr)
    );
    String::from_utf8(output.stdout).expect("stdout is UTF-8")
}

/// Runs the CLI expecting rejection, and returns its stderr.
fn rejection_of(input: &str) -> String {
    let output = run_cli(input);
    assert!(!output.status.success(), "expected a non-zero exit status");
    assert!(output.stdout.is_empty(), "no results are written on rejection");
    String::from_utf8(output.stderr).expect("stderr is UTF-8")
}

#[test]
fn the_schema_example_is_quoted_and_claimed() {
    let input = r#"{
        "customer": {"yearsWithMHPCO": 5},
        "steps": [
            {"op": "quote", "items": [
                {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}
            ]},
            {"op": "claim", "policy": 0, "incident": {
                "cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]
            }}
        ]
    }"#;
    // 60 base − 12 loyalty + 6 first insurance + 5 fee = 59; payout 200 − 100.
    assert_eq!(
        results_of(input).trim(),
        r#"{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}"#
    );
}

#[test]
fn a_newcomer_with_a_cursed_sword_is_quoted_165_g() {
    let input = r#"{
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [
            {"type": "sword", "material": "steel", "enchantment": 3, "cursed": true}
        ]}]
    }"#;
    assert_eq!(results_of(input).trim(), r#"{"results":[{"premium":165}]}"#);
}

#[test]
fn a_long_standing_customers_second_contract_is_quoted_160_g() {
    let input = r#"{
        "customer": {"yearsWithMHPCO": 3},
        "steps": [
            {"op": "quote", "items": [{"type": "potion"}]},
            {"op": "quote", "items": [
                {"type": "sword", "material": "steel", "enchantment": 7, "cursed": true}
            ]}
        ]
    }"#;
    let results = results_of(input);
    assert!(results.contains(r#"{"premium":160}"#), "got {results}");
}

#[test]
fn an_empty_item_list_is_quoted_at_the_processing_fee() {
    let input = r#"{"customer": {"yearsWithMHPCO": 0},
                    "steps": [{"op": "quote", "items": []}]}"#;
    assert_eq!(results_of(input).trim(), r#"{"results":[{"premium":5}]}"#);
}

#[test]
fn successive_claims_exhaust_the_cap() {
    let input = r#"{
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "material": "steel", "enchantment": 1}]},
            {"op": "claim", "policy": 0, "incident": {
                "cause": "dragon", "damages": [{"itemType": "sword", "amount": 1500}]}},
            {"op": "claim", "policy": 0, "incident": {
                "cause": "dragon", "damages": [{"itemType": "sword", "amount": 1500}]}}
        ]
    }"#;
    let results = results_of(input);
    assert!(results.contains(r#"{"payout":1400,"remainingCap":600}"#), "got {results}");
    assert!(results.contains(r#"{"payout":600,"remainingCap":0}"#), "got {results}");
}

#[test]
fn a_dragon_attack_on_two_items_deducts_once_per_item() {
    let input = r#"{
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [
                {"type": "sword", "material": "steel", "enchantment": 1},
                {"type": "amulet", "material": "silver", "enchantment": 1}
            ]},
            {"op": "claim", "policy": 0, "incident": {"cause": "dragon attack", "damages": [
                {"itemType": "sword", "amount": 500}, {"itemType": "amulet", "amount": 300}
            ]}}
        ]
    }"#;
    let results = results_of(input);
    assert!(results.contains(r#"{"payout":600,"remainingCap":2600}"#), "got {results}");
}

#[test]
fn an_unknown_item_type_is_rejected_with_a_message() {
    let input = r#"{"customer": {"yearsWithMHPCO": 0},
                    "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}"#;
    assert!(rejection_of(input).contains("broomstick"));
}

#[test]
fn a_damage_outside_the_policy_is_rejected_with_a_message() {
    let input = r#"{
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {"op": "claim", "policy": 0, "incident": {
                "cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}}
        ]
    }"#;
    assert!(rejection_of(input).contains("amulet"));
}

#[test]
fn more_sword_damages_than_insured_swords_is_rejected() {
    let input = r#"{
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {"op": "claim", "policy": 0, "incident": {"cause": "dragon", "damages": [
                {"itemType": "sword", "amount": 200}, {"itemType": "sword", "amount": 200}
            ]}}
        ]
    }"#;
    assert!(rejection_of(input).contains("sword"));
}

#[test]
fn a_negative_damage_amount_is_rejected_with_a_message() {
    let input = r#"{
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {"op": "claim", "policy": 0, "incident": {
                "cause": "fire", "damages": [{"itemType": "sword", "amount": -200}]}}
        ]
    }"#;
    assert!(rejection_of(input).contains("negative"));
}

#[test]
fn malformed_json_is_rejected() {
    assert!(!rejection_of("not json at all").is_empty());
}

#[test]
fn a_cursed_sword_is_capped_on_its_unmodified_insurance_value() {
    let input = r#"{
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [
                {"type": "sword", "material": "steel", "enchantment": 3, "cursed": true}
            ]},
            {"op": "claim", "policy": 0, "incident": {
                "cause": "fire", "damages": [{"itemType": "sword", "amount": 100}]}}
        ]
    }"#;
    // Premium modifiers do not raise the cap: it stays 2 x 1000 G.
    let results = results_of(input);
    assert!(results.contains(r#"{"premium":165}"#), "got {results}");
    assert!(results.contains(r#"{"payout":0,"remainingCap":2000}"#), "got {results}");
}

#[test]
fn a_block_discount_does_not_shrink_the_cap() {
    let input = r#"{
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [
                {"type": "sword"}, {"type": "rune"}, {"type": "rune"}, {"type": "rune"}
            ]},
            {"op": "claim", "policy": 0, "incident": {
                "cause": "fire", "damages": [{"itemType": "rune", "amount": 100}]}}
        ]
    }"#;
    // Insurance sum 1000 + 3 x 250 = 1750 G, so the cap is 3500 G.
    let results = results_of(input);
    assert!(results.contains(r#""remainingCap":3500"#), "got {results}");
}

#[test]
fn two_swords_are_capped_at_4000_g() {
    let input = r#"{
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}, {"type": "sword"}]},
            {"op": "claim", "policy": 0, "incident": {"cause": "dragon", "damages": [
                {"itemType": "sword", "amount": 500}, {"itemType": "sword", "amount": 500}
            ]}}
        ]
    }"#;
    // Each sword damage carries its own deductible: 400 + 400 G, cap 4000 - 800.
    let results = results_of(input);
    assert!(results.contains(r#"{"payout":800,"remainingCap":3200}"#), "got {results}");
}

#[test]
fn a_premium_ending_in_a_half_g_rounds_up() {
    let input = r#"{
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [
            {"type": "sword"}, {"type": "sword"}, {"type": "rune"}, {"type": "rune"},
            {"type": "rune"}, {"type": "rune"}, {"type": "rune"}
        ]}]
    }"#;
    // Base 200 + 125 = 325 G; first insurance 32.5 G; fee 5 G = 362.5 -> 363 G.
    assert_eq!(results_of(input).trim(), r#"{"results":[{"premium":363}]}"#);
}

#[test]
fn a_payout_ending_in_a_half_g_rounds_down() {
    let input = r#"{
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [
                {"type": "sword", "material": "steel", "enchantment": 9}
            ]},
            {"op": "claim", "policy": 0, "incident": {
                "cause": "fire", "damages": [{"itemType": "sword", "amount": 901}]}}
        ]
    }"#;
    // Half of 901 is 450.5 G; minus the 100 G deductible is 350.5 -> 350 G.
    let results = results_of(input);
    assert!(results.contains(r#"{"payout":350,"remainingCap":1650}"#), "got {results}");
}
