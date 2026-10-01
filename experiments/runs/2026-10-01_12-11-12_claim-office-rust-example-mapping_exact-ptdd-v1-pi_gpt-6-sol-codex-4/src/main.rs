use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    let result = io::stdin().read_to_string(&mut input)
        .map_err(|error| error.to_string())
        .and_then(|_| serde_json::from_str(&input).map_err(|error| error.to_string()))
        .and_then(|input| kata::process(&input));
    match result {
        Ok(output) => println!("{output}"),
        Err(error) => {
            eprintln!("{error}");
            std::process::exit(1);
        }
    }
}
