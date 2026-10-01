//! The `claim-office` CLI: reads a scenario as JSON from stdin, writes the
//! results as JSON to stdout. Errors go to stderr with a non-zero exit status
//! and no `results` on stdout.

use kata::scenario::{run, Scenario};
use std::io::Read;
use std::process::ExitCode;

fn main() -> ExitCode {
    match execute() {
        Ok(json) => {
            println!("{json}");
            ExitCode::SUCCESS
        }
        Err(message) => {
            eprintln!("{message}");
            ExitCode::FAILURE
        }
    }
}

fn execute() -> Result<String, String> {
    let mut input = String::new();
    std::io::stdin()
        .read_to_string(&mut input)
        .map_err(|error| format!("cannot read stdin: {error}"))?;

    let scenario: Scenario = serde_json::from_str(&input)
        .map_err(|error| format!("invalid scenario JSON: {error}"))?;
    let output = run(&scenario).map_err(|error| error.to_string())?;

    serde_json::to_string(&output).map_err(|error| format!("cannot write output: {error}"))
}
