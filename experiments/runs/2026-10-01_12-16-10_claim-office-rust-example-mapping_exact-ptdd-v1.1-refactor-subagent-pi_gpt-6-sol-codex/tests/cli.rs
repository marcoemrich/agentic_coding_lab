use std::io::Write;
use std::process::{Command, Stdio};

fn run(input: &str) -> std::process::Output {
    let mut child = Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped())
        .spawn().unwrap();
    child.stdin.take().unwrap().write_all(input.as_bytes()).unwrap();
    child.wait_with_output().unwrap()
}

#[test]
fn schema_example_via_cli() {
    let output = run(r#"{"customer":{"yearsWithMHPCO":5},"steps":[{"op":"quote","items":[{"type":"amulet","material":"silver","enchantment":2,"cursed":false}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}]}"#);
    assert!(output.status.success());
    assert_eq!(serde_json::from_slice::<serde_json::Value>(&output.stdout).unwrap(),serde_json::json!({"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}));
}

#[test]
fn invalid_scenarios_exit_nonzero_with_stderr_and_no_results() {
    let cases = [
        r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"broomstick"}]}]}"#,
        r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}]}"#,
        r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"broomstick","amount":200}]}}]}"#,
        r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":200},{"itemType":"sword","amount":200}]}}]}"#,
        r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword"}]},{"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":-200}]}}]}"#,
    ];
    for input in cases {
        let output = run(input);
        assert!(!output.status.success(),"{input}");
        assert!(!output.stderr.is_empty(),"{input}");
        assert!(output.stdout.is_empty(),"{input}");
    }
}
