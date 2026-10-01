//! The `claim-office` CLI: a scenario on stdin, its results on stdout.

use std::io::{self, Read, Write};
use std::process::ExitCode;

use kata::scenario::{self, Scenario};

fn main() -> ExitCode {
    match run() {
        Ok(output) => {
            let mut stdout = io::stdout();
            // The contract allows no stdout output beyond the results document.
            let _ = writeln!(stdout, "{output}");
            ExitCode::SUCCESS
        }
        Err(message) => {
            eprintln!("MHPCO rejects this scenario: {message}");
            ExitCode::FAILURE
        }
    }
}

/// Reads the scenario, settles it, and renders the results document.
fn run() -> Result<String, String> {
    let mut input = String::new();
    io::stdin()
        .read_to_string(&mut input)
        .map_err(|e| format!("cannot read stdin: {e}"))?;
    let scenario: Scenario =
        serde_json::from_str(&input).map_err(|e| format!("malformed scenario: {e}"))?;
    let output = scenario::run(&scenario).map_err(|e| e.to_string())?;
    serde_json::to_string(&output).map_err(|e| format!("cannot render results: {e}"))
}
