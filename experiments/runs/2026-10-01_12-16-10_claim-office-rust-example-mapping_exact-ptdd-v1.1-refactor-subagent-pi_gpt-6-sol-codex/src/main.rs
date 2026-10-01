use std::io::{self, Read};

fn main() {
    let mut text = String::new();
    let result = io::stdin().read_to_string(&mut text)
        .map_err(|e| e.to_string())
        .and_then(|_| serde_json::from_str(&text).map_err(|e| e.to_string()))
        .and_then(|input| kata::scenario(&input))
        .and_then(|output| serde_json::to_string(&output).map_err(|e| e.to_string()));
    match result {
        Ok(output) => println!("{output}"),
        Err(error) => {
            eprintln!("{error}");
            std::process::exit(1);
        }
    }
}
