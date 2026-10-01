use std::io::Write;
use std::process::{Command, Stdio};

#[test]
fn cli_reads_scenario_and_emits_only_json() {
    let mut child = Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(Stdio::piped()).stdout(Stdio::piped()).spawn().unwrap();
    child.stdin.take().unwrap().write_all(br#"{"customer":{"yearsWithMHPCO":5},"steps":[{"op":"quote","items":[{"type":"amulet"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}]}"#).unwrap();
    let output = child.wait_with_output().unwrap();
    assert!(output.status.success());
    assert_eq!(serde_json::from_slice::<serde_json::Value>(&output.stdout).unwrap(),
        serde_json::json!({"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}));
}

#[test]
fn cli_reports_errors_without_results() {
    let mut child = Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped()).spawn().unwrap();
    child.stdin.take().unwrap().write_all(br#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"broomstick"}]}]}"#).unwrap();
    let output = child.wait_with_output().unwrap();
    assert!(!output.status.success());
    assert!(output.stdout.is_empty());
    assert!(!output.stderr.is_empty());
}
