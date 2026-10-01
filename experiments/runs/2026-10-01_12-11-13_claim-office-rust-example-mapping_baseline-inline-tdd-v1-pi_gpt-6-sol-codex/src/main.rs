use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    let result = io::stdin().read_to_string(&mut input)
        .map_err(|e| e.to_string())
        .and_then(|_| kata::run(&input));
    match result {
        Ok(output) => print!("{output}"),
        Err(error) => {
            eprintln!("{error}");
            std::process::exit(1);
        }
    }
}
