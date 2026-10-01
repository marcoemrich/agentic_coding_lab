use std::io::{self, Read};

fn execute() -> Result<(), Box<dyn std::error::Error>> {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input)?;
    let scenario: kata::Scenario = serde_json::from_str(&input)?;
    let output = kata::run(scenario)?;
    serde_json::to_writer(io::stdout().lock(), &output)?;
    Ok(())
}

fn main() {
    if let Err(error) = execute() {
        eprintln!("{error}");
        std::process::exit(1);
    }
}
