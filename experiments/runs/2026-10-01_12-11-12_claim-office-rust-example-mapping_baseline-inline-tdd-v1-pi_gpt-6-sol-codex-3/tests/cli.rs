use std::io::Write;
use std::process::{Command, Stdio};

fn invoke(input: &str) -> std::process::Output {
    let mut child = Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped())
        .spawn().unwrap();
    child.stdin.take().unwrap().write_all(input.as_bytes()).unwrap();
    child.wait_with_output().unwrap()
}

#[test]
fn cli_prints_only_json_for_valid_scenario() {
    let output = invoke(r#"{"customer":{"yearsWithMHPCO":5},"steps":[{"op":"quote","items":[{"type":"amulet"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}]}"#);
    assert!(output.status.success());
    assert_eq!(serde_json::from_slice::<serde_json::Value>(&output.stdout).unwrap(),
        serde_json::json!({"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}));
}

#[test]
fn cli_reports_errors_only_on_stderr() {
    let output = invoke(r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"broomstick"}]}]}"#);
    assert!(!output.status.success());
    assert!(output.stdout.is_empty());
    assert!(!output.stderr.is_empty());
}
