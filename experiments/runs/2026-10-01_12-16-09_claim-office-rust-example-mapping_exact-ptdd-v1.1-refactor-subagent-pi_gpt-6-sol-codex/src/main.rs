use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).expect("read scenario");
    let result = serde_json::from_str(&input)
        .map_err(|error| error.to_string())
        .and_then(|scenario| kata::scenario(&scenario));
    match result {
        Ok(output) => println!("{output}"),
        Err(error) => {
            eprintln!("{error}");
            std::process::exit(1);
        }
    }
}
