//! The MHPCO's claim office at the command line: it reads a scenario as JSON on
//! stdin and writes the results as JSON on stdout. A scenario the office
//! refuses is reported on stderr and leaves a non-zero status.

use std::io::Read;
use std::process::ExitCode;

fn main() -> ExitCode {
    let mut document = String::new();
    if let Err(failure) = std::io::stdin().read_to_string(&mut document) {
        eprintln!("the scenario could not be read from stdin: {failure}");
        return ExitCode::FAILURE;
    }

    match kata::run_scenario_json(&document) {
        Ok(results) => {
            println!("{results}");
            ExitCode::SUCCESS
        }
        Err(refusal) => {
            eprintln!("{refusal}");
            ExitCode::FAILURE
        }
    }
}
