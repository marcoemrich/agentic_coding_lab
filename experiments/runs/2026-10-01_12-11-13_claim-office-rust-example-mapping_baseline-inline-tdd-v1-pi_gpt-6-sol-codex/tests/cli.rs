use std::io::Write;
use std::process::{Command, Stdio};

#[test]
fn cli_json_and_errors() {
    let binary = env!("CARGO_BIN_EXE_kata");
    let mut child = Command::new(binary).stdin(Stdio::piped()).stdout(Stdio::piped()).spawn().unwrap();
    child.stdin.take().unwrap().write_all(br#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[]}]}"#).unwrap();
    let output = child.wait_with_output().unwrap();
    assert!(output.status.success());
    assert_eq!(output.stdout, br#"{"results":[{"premium":5}]}"#);

    let mut child = Command::new(binary).stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped()).spawn().unwrap();
    child.stdin.take().unwrap().write_all(br#"{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"broomstick"}]}]}"#).unwrap();
    let output = child.wait_with_output().unwrap();
    assert!(!output.status.success());
    assert!(output.stdout.is_empty());
    assert!(!output.stderr.is_empty());
}
