//! The `claim-office` CLI: a scenario document on stdin, its results on
//! stdout. Anything the MHPCO refuses to process is described on stderr and
//! reported through a non-zero exit status, with no results written.

use std::io::{self, Read, Write};
use std::process::ExitCode;

use kata::scenario::run_json;

fn main() -> ExitCode {
    let mut input = String::new();
    if let Err(error) = io::stdin().read_to_string(&mut input) {
        return fail(&format!("cannot read stdin: {error}"));
    }

    match run_json(&input) {
        Ok(results) => {
            println!("{results}");
            ExitCode::SUCCESS
        }
        Err(error) => fail(&error.to_string()),
    }
}

/// Describes the refusal on stderr and reports it to the shell.
fn fail(description: &str) -> ExitCode {
    let _ = writeln!(io::stderr(), "claim-office: {description}");
    ExitCode::FAILURE
}
