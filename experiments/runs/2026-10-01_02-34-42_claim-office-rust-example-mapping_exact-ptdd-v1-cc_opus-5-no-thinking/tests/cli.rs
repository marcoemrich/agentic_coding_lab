// CLI-level tests for the `kata` binary: stdin JSON in, stdout JSON out,
// non-zero exit status plus stderr for rejected scenarios.

use std::io::Write;
use std::process::{Command, Output, Stdio};

/// Runs the `kata` binary on a scenario document and returns its raw output.
fn run_kata(scenario: &str) -> Output {
    let mut child = Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("failed to spawn the kata binary");
    child
        .stdin
        .as_mut()
        .expect("stdin was not piped")
        .write_all(scenario.as_bytes())
        .expect("failed to write the scenario to stdin");

    child.wait_with_output().expect("failed to read the output")
}

#[test]
fn cli_reads_a_scenario_from_stdin_and_writes_results_to_stdout() {
    let output = run_kata(
        r#"{
            "customer": {"yearsWithMHPCO": 5},
            "steps": [
                {"op": "quote", "items": [
                    {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}
                ]}
            ]
        }"#,
    );

    assert!(output.status.success());
    // 60 base + 6 first insurance - 12 loyalty = 54 + 5 fee
    assert_eq!(
        String::from_utf8_lossy(&output.stdout).trim(),
        r#"{"results":[{"premium":59}]}"#
    );
}

#[test]
fn cli_resolves_the_policy_reference_of_a_claim_step() {
    let output = run_kata(
        r#"{
            "customer": {"yearsWithMHPCO": 5},
            "steps": [
                {"op": "quote", "items": [
                    {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}
                ]},
                {"op": "claim", "policy": 0, "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 200}]
                }}
            ]
        }"#,
    );

    assert!(output.status.success());
    // insurance sum 600, cap 1200; payout 200 - 100 deductible
    assert_eq!(
        String::from_utf8_lossy(&output.stdout).trim(),
        r#"{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}"#
    );
}

#[test]
fn cli_treats_the_second_quote_of_a_scenario_as_a_follow_up_contract() {
    let output = run_kata(
        r#"{
            "customer": {"yearsWithMHPCO": 3},
            "steps": [
                {"op": "quote", "items": [
                    {"type": "sword", "material": "steel", "enchantment": 3, "cursed": true}
                ]},
                {"op": "quote", "items": [
                    {"type": "sword", "material": "steel", "enchantment": 7, "cursed": true}
                ]}
            ]
        }"#,
    );

    assert!(output.status.success());
    // first: 100 + 50 curse + 10 first insurance - 20 loyalty = 140 + 5 fee
    // second: the spec's integration example, 155 + 5 fee
    assert_eq!(
        String::from_utf8_lossy(&output.stdout).trim(),
        r#"{"results":[{"premium":145},{"premium":160}]}"#
    );
}

#[test]
fn cli_exits_non_zero_without_stdout_results_on_an_invalid_scenario() {
    let output = run_kata(
        r#"{
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "broomstick"}]}
            ]
        }"#,
    );

    assert!(!output.status.success());
    assert!(String::from_utf8_lossy(&output.stdout).is_empty());
    assert!(String::from_utf8_lossy(&output.stderr).contains("broomstick"));
}

#[test]
fn cli_rejects_a_damage_with_an_unknown_item_type() {
    let output = run_kata(
        r#"{
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "sword"}]},
                {"op": "claim", "policy": 0, "incident": {
                    "cause": "dragon attack",
                    "damages": [{"itemType": "broomstick", "amount": 200}]
                }}
            ]
        }"#,
    );

    assert!(!output.status.success());
    assert!(String::from_utf8_lossy(&output.stdout).is_empty());
    assert!(String::from_utf8_lossy(&output.stderr).contains("broomstick"));
}
