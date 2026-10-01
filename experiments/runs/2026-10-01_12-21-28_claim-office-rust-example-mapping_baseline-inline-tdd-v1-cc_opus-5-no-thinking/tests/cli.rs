//! Drives the `kata` binary the way the MHPCO's clerks do: JSON on stdin,
//! JSON on stdout, a non-zero status for anything it refuses to process.

use std::io::Write;
use std::process::{Command, Output, Stdio};

fn run_cli(input: &str) -> Output {
    let mut child = Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("binary builds");
    child
        .stdin
        .as_mut()
        .expect("stdin is piped")
        .write_all(input.as_bytes())
        .expect("writes to stdin");
    child.wait_with_output().expect("binary finishes")
}

#[test]
fn it_writes_the_results_document_to_stdout() {
    let input = r#"{
        "customer": {"yearsWithMHPCO": 5},
        "steps": [
            {"op": "quote", "items": [
                {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}]},
            {"op": "claim", "policy": 0, "incident": {
                "cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}}
        ]
    }"#;
    let output = run_cli(input);

    assert!(output.status.success());
    assert_eq!(
        String::from_utf8_lossy(&output.stdout).trim(),
        r#"{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}"#
    );
}

#[test]
fn it_rejects_an_unknown_item_type_without_writing_results() {
    let input = r#"{"customer":{"yearsWithMHPCO":0},
        "steps":[{"op":"quote","items":[{"type":"broomstick"}]}]}"#;
    let output = run_cli(input);

    assert!(!output.status.success());
    assert!(output.stdout.is_empty(), "no results on stdout");
    assert!(!output.stderr.is_empty(), "an error description on stderr");
}

#[test]
fn it_rejects_a_claim_on_an_uninsured_item() {
    let input = r#"{"customer":{"yearsWithMHPCO":0},"steps":[
        {"op":"quote","items":[{"type":"sword"}]},
        {"op":"claim","policy":0,"incident":{"cause":"fire",
            "damages":[{"itemType":"amulet","amount":200}]}}]}"#;
    let output = run_cli(input);

    assert!(!output.status.success());
    assert!(!output.stderr.is_empty());
}

#[test]
fn it_rejects_more_damages_of_a_type_than_are_insured() {
    let input = r#"{"customer":{"yearsWithMHPCO":0},"steps":[
        {"op":"quote","items":[{"type":"sword"}]},
        {"op":"claim","policy":0,"incident":{"cause":"dragon","damages":[
            {"itemType":"sword","amount":200},{"itemType":"sword","amount":200}]}}]}"#;
    let output = run_cli(input);

    assert!(!output.status.success());
    assert!(!output.stderr.is_empty());
}

#[test]
fn it_rejects_a_negative_damage_amount() {
    let input = r#"{"customer":{"yearsWithMHPCO":0},"steps":[
        {"op":"quote","items":[{"type":"sword"}]},
        {"op":"claim","policy":0,"incident":{"cause":"fire",
            "damages":[{"itemType":"sword","amount":-200}]}}]}"#;
    let output = run_cli(input);

    assert!(!output.status.success());
    assert!(!output.stderr.is_empty());
}

#[test]
fn it_settles_a_dragon_attack_on_two_insured_swords() {
    let input = r#"{"customer":{"yearsWithMHPCO":0},"steps":[
        {"op":"quote","items":[
            {"type":"sword","material":"steel","enchantment":3},
            {"type":"sword","material":"steel","enchantment":3}]},
        {"op":"claim","policy":0,"incident":{"cause":"dragon","damages":[
            {"itemType":"sword","amount":500},{"itemType":"sword","amount":500}]}}]}"#;
    let output = run_cli(input);

    assert!(output.status.success());
    assert_eq!(
        String::from_utf8_lossy(&output.stdout).trim(),
        r#"{"results":[{"premium":225},{"payout":800,"remainingCap":3200}]}"#
    );
}
