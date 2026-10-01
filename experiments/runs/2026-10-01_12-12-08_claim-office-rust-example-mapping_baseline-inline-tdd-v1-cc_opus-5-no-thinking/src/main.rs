use std::io::{Read, Write};
use std::process::ExitCode;

fn main() -> ExitCode {
    let mut input = String::new();
    if let Err(error) = std::io::stdin().read_to_string(&mut input) {
        return fail(&error.to_string());
    }
    match kata::run_json(&input) {
        Ok(output) => {
            println!("{output}");
            ExitCode::SUCCESS
        }
        Err(error) => fail(&error),
    }
}

fn fail(error: &str) -> ExitCode {
    let _ = writeln!(std::io::stderr(), "error: {error}");
    ExitCode::FAILURE
}
