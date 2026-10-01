//! The `claim-office` command: a scenario document on stdin, its results on stdout.

use std::io::Read;
use std::process::ExitCode;

use kata::{parse_scenario, render_results, run_scenario};

fn main() -> ExitCode {
    match settle_scenario_from_stdin() {
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

fn settle_scenario_from_stdin() -> Result<String, String> {
    let mut document = String::new();
    std::io::stdin()
        .read_to_string(&mut document)
        .map_err(|error| error.to_string())?;
    let scenario = parse_scenario(&document)?;
    Ok(render_results(&run_scenario(&scenario)?))
}
