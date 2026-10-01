use std::io::{Read, Write, stdin, stdout};
use std::process::ExitCode;

use kata::settle_scenario_document;

/// Reads a scenario document from stdin and writes the office's results
/// document to stdout, refusing the scenario on stderr when MHPCO rejects it.
fn main() -> ExitCode {
    match answer_the_scenario_on_stdin() {
        Ok(()) => ExitCode::SUCCESS,
        Err(refusal) => {
            eprintln!("{refusal}");
            ExitCode::FAILURE
        }
    }
}

/// Puts the scenario waiting on stdin to the office and writes what it
/// answers to stdout. Anything that stops the office from answering -- a
/// scenario it cannot read, one it refuses, or an answer it cannot deliver
/// -- is reported as the single refusal that leaves this run unanswered.
fn answer_the_scenario_on_stdin() -> Result<(), String> {
    let mut document = String::new();
    stdin()
        .read_to_string(&mut document)
        .map_err(|error| error.to_string())?;
    let results = settle_scenario_document(&document)?;
    writeln!(stdout(), "{results}").map_err(|error| error.to_string())
}
