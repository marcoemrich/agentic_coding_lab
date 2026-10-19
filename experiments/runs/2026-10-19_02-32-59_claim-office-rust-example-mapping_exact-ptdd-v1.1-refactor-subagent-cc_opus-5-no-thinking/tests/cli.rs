//! The `kata` binary is the office's counter: it reads a scenario document
//! from stdin and writes the results document to stdout.

use std::io::Write;
use std::process::{Command, Stdio};

const SCHEMA_EXAMPLE: &str = r#"{
    "customer": {"yearsWithMHPCO": 5},
    "steps": [
        {"op": "quote", "items": [
            {"type": "amulet", "material": "silver",
             "enchantment": 2, "cursed": false}
        ]},
        {"op": "claim", "policy": 0, "incident": {
            "cause": "fire",
            "damages": [{"itemType": "amulet", "amount": 200}]
        }}
    ]
}"#;

/// Runs the office's counter over a scenario document, reporting what it
/// wrote to stdout, what it wrote to stderr, and whether it accepted the
/// scenario.
fn settle_at_the_counter(scenario: &str) -> (String, String, bool) {
    let mut counter = Command::new(env!("CARGO_BIN_EXE_kata"))
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("the kata binary runs");
    counter
        .stdin
        .take()
        .expect("the counter reads stdin")
        .write_all(scenario.as_bytes())
        .expect("the scenario is written");
    let finished = counter.wait_with_output().expect("the counter finishes");
    (
        String::from_utf8(finished.stdout).expect("stdout is text"),
        String::from_utf8(finished.stderr).expect("stderr is text"),
        finished.status.success(),
    )
}

#[test]
fn the_binary_writes_the_results_document_to_stdout() {
    let (stdout, _, accepted) = settle_at_the_counter(SCHEMA_EXAMPLE);
    assert!(accepted, "the schema example is a valid scenario");
    assert_eq!(
        stdout.trim(),
        r#"{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}"#
    );
}

#[test]
fn the_binary_writes_no_other_stdout_output() {
    // The exact bytes: the results document and the single newline that
    // terminates it, with no banner, prompt, or progress output. A newline
    // ending one document is line-oriented output, not additional output.
    let (stdout, stderr, accepted) = settle_at_the_counter(SCHEMA_EXAMPLE);
    assert!(accepted, "the schema example is a valid scenario");
    assert_eq!(
        stdout,
        "{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}\n"
    );
    assert_eq!(stderr, "", "an accepted scenario writes nothing to stderr");
}

#[test]
fn a_refused_scenario_exits_non_zero_with_a_description_on_stderr() {
    let refused = r#"{
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]
    }"#;
    let (stdout, stderr, accepted) = settle_at_the_counter(refused);
    assert!(!accepted, "the office does not insure a broomstick");
    assert_eq!(stdout, "", "no results are written for a refused scenario");
    assert!(
        stderr.contains("broomstick"),
        "the description names the offending item type, got {stderr:?}"
    );
}
