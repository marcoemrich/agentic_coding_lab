//! The `claim-office` command line adapter: a scenario document on stdin, its
//! results document on stdout, an error description on stderr.

use std::io::{Read, Write, stderr, stdin, stdout};
use std::process::ExitCode;

fn main() -> ExitCode {
    match run() {
        Ok(results) => {
            let mut out = stdout();
            if out.write_all(results.as_bytes()).is_err() {
                return ExitCode::FAILURE;
            }
            ExitCode::SUCCESS
        }
        Err(error) => {
            let _ = writeln!(stderr(), "{error}");
            ExitCode::FAILURE
        }
    }
}

fn run() -> Result<String, String> {
    let mut input = String::new();
    stdin()
        .read_to_string(&mut input)
        .map_err(|error| error.to_string())?;
    kata::run_scenario(&input)
}
