//! The `kata` command line adapter: it reads a scenario as JSON on stdin and
//! writes the MHPCO's results as JSON on stdout. All insurance decisions belong
//! to the library; this binary only translates and reports failures.

use std::fmt::Display;
use std::io::{Read, Write};
use std::process::ExitCode;

use kata::{process_scenario, results_to_json, scenario_from_json};

/// How the console hears about a failure. Whatever went wrong -- the stream, the
/// JSON document, or the MHPCO's own refusal -- the console is told only its
/// description, which is all this adapter can write to stderr.
struct Refusal(String);

impl<Cause: Display> From<Cause> for Refusal {
    fn from(cause: Cause) -> Self {
        Self(cause.to_string())
    }
}

fn main() -> ExitCode {
    match run() {
        Ok(results) => {
            println!("{results}");
            ExitCode::SUCCESS
        }
        Err(Refusal(description)) => {
            let _ = writeln!(std::io::stderr(), "{description}");
            ExitCode::FAILURE
        }
    }
}

fn run() -> Result<String, Refusal> {
    let mut stdin = String::new();
    std::io::stdin().read_to_string(&mut stdin)?;
    let scenario = scenario_from_json(&stdin)?;
    let results = process_scenario(&scenario)?;
    Ok(results_to_json(&results)?)
}
