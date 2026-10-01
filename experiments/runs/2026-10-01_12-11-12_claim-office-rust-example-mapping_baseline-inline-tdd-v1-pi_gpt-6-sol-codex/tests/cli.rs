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
fn cli_emits_only_json_for_quotes_and_claims() {
    let output = invoke(r#"{"customer":{"yearsWithMHPCO":5},"steps":[{"op":"quote","items":[{"type":"amulet","material":"silver","enchantment":2,"cursed":false}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}]}"#);
    assert!(output.status.success(), "{}", String::from_utf8_lossy(&output.stderr));
    let parsed: serde_json::Value = serde_json::from_slice(&output.stdout).unwrap();
    assert_eq!(parsed, serde_json::json!({"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}));
}

#[test]
fn cli_reports_errors_without_results_on_stdout() {
    let output = invoke(r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"broomstick"}]}]}"#);
    assert!(!output.status.success());
    assert!(output.stdout.is_empty());
    assert!(!output.stderr.is_empty());
}
