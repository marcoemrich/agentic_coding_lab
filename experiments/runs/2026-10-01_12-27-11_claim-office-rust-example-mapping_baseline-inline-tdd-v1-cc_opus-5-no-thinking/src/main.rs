//! The `claim-office` CLI: a scenario on stdin, its results on stdout.

use std::io::Read;
use std::process::ExitCode;

use kata::{json, scenario};

/// Reads stdin, processes the scenario, and renders the results.
fn process(input: &str) -> Result<String, String> {
    let scenario = json::parse_scenario(input).map_err(|error| error.to_string())?;
    let results = scenario::run(&scenario).map_err(|error| error.to_string())?;
    Ok(json::render_results(&results))
}

fn main() -> ExitCode {
    let mut input = String::new();
    if let Err(error) = std::io::stdin().read_to_string(&mut input) {
        eprintln!("could not read the scenario from stdin: {error}");
        return ExitCode::FAILURE;
    }
    match process(&input) {
        Ok(output) => {
            println!("{output}");
            ExitCode::SUCCESS
        }
        Err(message) => {
            eprintln!("{message}");
            ExitCode::FAILURE
        }
    }
}
