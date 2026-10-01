//! Thin adapter: reads a scenario from stdin, runs it, writes results to
//! stdout. All insurance rules live in the library.

use std::io::Read;
use std::process::ExitCode;

use kata::run_scenario;

fn main() -> ExitCode {
    let mut scenario = String::new();
    if let Err(error) = std::io::stdin().read_to_string(&mut scenario) {
        eprintln!("failed to read the scenario: {error}");
        return ExitCode::FAILURE;
    }

    match run_scenario(&scenario) {
        Ok(results) => {
            println!("{results}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("{error}");
            ExitCode::FAILURE
        }
    }
}
