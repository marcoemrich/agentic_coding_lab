//! The claim-office CLI: a scenario document on stdin, its results on stdout.

use std::io::{Read, Write};
use std::process::ExitCode;

fn main() -> ExitCode {
    let mut document = String::new();
    if let Err(error) = std::io::stdin().read_to_string(&mut document) {
        return refuse(&format!("the scenario could not be read: {error}"));
    }
    match kata::run_scenario(&document) {
        Ok(results) => {
            println!("{results}");
            ExitCode::SUCCESS
        }
        Err(refusal) => refuse(&refusal.to_string()),
    }
}

fn refuse(description: &str) -> ExitCode {
    let _ = writeln!(std::io::stderr(), "{description}");
    ExitCode::FAILURE
}
