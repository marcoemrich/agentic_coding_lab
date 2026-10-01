use std::io::{self, Read};

fn run() -> Result<(), String> {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).map_err(|e| e.to_string())?;
    let scenario = serde_json::from_str(&input).map_err(|e| e.to_string())?;
    let output = kata::process(scenario)?;
    println!("{output}");
    Ok(())
}

fn main() {
    if let Err(error) = run() {
        eprintln!("{error}");
        std::process::exit(1);
    }
}
