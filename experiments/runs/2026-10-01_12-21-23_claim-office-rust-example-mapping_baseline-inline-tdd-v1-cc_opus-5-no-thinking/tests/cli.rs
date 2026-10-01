//! End-to-end tests driving the `kata` binary over stdin/stdout, covering the
//! CLI contract: JSON in, JSON out, errors to stderr with a non-zero status.

use std::io::Write;
use std::process::{Command, Output, Stdio};

fn run_cli(input: &str) -> Output {
    let mut child = Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("binary starts");
    child
        .stdin
        .as_mut()
        .expect("stdin is piped")
        .write_all(input.as_bytes())
        .expect("input is written");
    child.wait_with_output().expect("binary finishes")
}

#[test]
fn writes_the_results_of_the_schema_example_to_stdout() {
    let output = run_cli(
        r#"{
            "customer": {"yearsWithMHPCO": 5},
            "steps": [
                {"op": "quote", "items": [
                    {"type": "amulet", "material": "silver",
                     "enchantment": 2, "cursed": false}]},
                {"op": "claim", "policy": 0, "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 200}]}}
            ]
        }"#,
    );

    assert!(output.status.success(), "stderr: {:?}", String::from_utf8_lossy(&output.stderr));
    let stdout = String::from_utf8(output.stdout).expect("utf-8 stdout");
    let parsed: serde_json::Value = serde_json::from_str(&stdout).expect("valid JSON");
    assert_eq!(
        parsed,
        serde_json::json!({"results": [
            {"premium": 59},
            {"payout": 100, "remainingCap": 1100}
        ]})
    );
}

#[test]
fn an_unknown_item_type_exits_non_zero_without_results_on_stdout() {
    let output = run_cli(
        r#"{"customer": {"yearsWithMHPCO": 1},
            "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}"#,
    );

    assert!(!output.status.success());
    assert!(output.stdout.is_empty(), "stdout: {:?}", output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(stderr.contains("broomstick"), "stderr: {stderr}");
}

#[test]
fn a_negative_damage_amount_exits_non_zero() {
    let output = run_cli(
        r#"{"customer": {"yearsWithMHPCO": 1},
            "steps": [
                {"op": "quote", "items": [{"type": "sword"}]},
                {"op": "claim", "policy": 0, "incident": {
                    "cause": "mishap",
                    "damages": [{"itemType": "sword", "amount": -200}]}}]}"#,
    );

    assert!(!output.status.success());
    assert!(output.stdout.is_empty());
    assert!(!output.stderr.is_empty());
}

#[test]
fn malformed_json_exits_non_zero() {
    let output = run_cli("not json at all");

    assert!(!output.status.success());
    assert!(output.stdout.is_empty());
    assert!(!output.stderr.is_empty());
}
