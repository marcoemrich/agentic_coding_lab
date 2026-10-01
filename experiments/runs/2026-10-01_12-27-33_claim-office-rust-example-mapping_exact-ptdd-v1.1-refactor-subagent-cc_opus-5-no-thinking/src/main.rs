//! The `kata` binary: a thin counter window onto the MHPCO's office. It reads
//! a scenario from stdin, writes the office's answers to stdout, and refuses
//! with a non-zero status when the office will not take the business on.

use std::io::{Read, Write, stderr, stdin, stdout};
use std::process::ExitCode;

use kata::run_scenario;

fn main() -> ExitCode {
    let mut document = String::new();
    if let Err(error) = stdin().read_to_string(&mut document) {
        let _ = writeln!(stderr(), "cannot read the scenario: {error}");
        return ExitCode::FAILURE;
    }
    match run_scenario(&document) {
        Ok(results) => {
            let _ = writeln!(stdout(), "{results}");
            ExitCode::SUCCESS
        }
        Err(refusal) => {
            let _ = writeln!(stderr(), "the MHPCO refuses this scenario: {refusal:?}");
            ExitCode::FAILURE
        }
    }
}
