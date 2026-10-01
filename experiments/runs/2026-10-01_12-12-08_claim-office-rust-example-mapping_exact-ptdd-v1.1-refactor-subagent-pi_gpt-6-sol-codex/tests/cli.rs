use std::{io::Write, process::{Command, Stdio}};
use serde_json::json;

fn invoke(input: serde_json::Value) -> std::process::Output {
    let mut child = Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped()).spawn().unwrap();
    child.stdin.take().unwrap().write_all(input.to_string().as_bytes()).unwrap();
    child.wait_with_output().unwrap()
}
#[test] // previously inactive: "schema example: quote amulet then claim 200, JSON results premium 59 and payout 100 remainingCap 1100; no extra stdout"]
fn schema_example() {
    let out = invoke(json!({"customer":{"yearsWithMHPCO":5},"steps":[{"op":"quote","items":[{"type":"amulet","material":"silver","enchantment":2,"cursed":false}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}]}));
    assert!(out.status.success());
    assert_eq!(serde_json::from_slice::<serde_json::Value>(&out.stdout).unwrap(),json!({"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}));
}
#[test] // previously inactive: "unknown quote broomstick: CLI nonzero, stderr description, stdout has no results"]
fn cli_unknown_quote() { reject(json!([{"op":"quote","items":[{"type":"broomstick"}]}])); }
#[test] // previously inactive: "uninsured damage: CLI nonzero, stderr description"]
fn cli_uninsured() { reject(json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}])); }
#[test] // previously inactive: "unknown damage type: CLI nonzero, stderr description"]
fn cli_unknown_damage() { reject(json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"broomstick","amount":200}]}}])); }
#[test] // previously inactive: "more sword damages than insured swords: CLI nonzero, stderr description"]
fn cli_excess_damages() { reject(json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":200},{"itemType":"sword","amount":200}]}}])); }
#[test] // previously inactive: "negative -200 damage: CLI nonzero, stderr description"]
fn cli_negative_damage() { reject(json!([{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":-200}]}}])); }
fn reject(steps: serde_json::Value) {
    let out = invoke(json!({"customer":{"yearsWithMHPCO":0},"steps":steps}));
    assert!(!out.status.success());
    assert!(!out.stderr.is_empty());
    assert!(!String::from_utf8_lossy(&out.stdout).contains("results"));
}
