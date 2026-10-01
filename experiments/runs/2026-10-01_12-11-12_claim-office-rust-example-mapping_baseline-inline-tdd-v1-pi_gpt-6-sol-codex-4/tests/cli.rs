use std::io::Write;
use std::process::{Command, Stdio};

#[test]
fn cli_emits_only_json_and_reports_errors_to_stderr() {
    let bin = env!("CARGO_BIN_EXE_kata");
    for (input, success) in [
        (r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"sword","cursed":true}]}]}"#, true),
        (r#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"broomstick"}]}]}"#, false),
    ] {
        let mut process = Command::new(bin).stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped()).spawn().unwrap();
        process.stdin.take().unwrap().write_all(input.as_bytes()).unwrap();
        let output = process.wait_with_output().unwrap();
        assert_eq!(output.status.success(), success);
        if success {
            assert_eq!(serde_json::from_slice::<serde_json::Value>(&output.stdout).unwrap(),
                serde_json::json!({"results":[{"premium":165}]}));
        } else {
            assert!(output.stdout.is_empty());
            assert!(!output.stderr.is_empty());
        }
    }
}
