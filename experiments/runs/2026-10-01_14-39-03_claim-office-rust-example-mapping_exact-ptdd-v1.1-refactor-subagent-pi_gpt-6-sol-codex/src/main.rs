use std::io::{self, Read};

fn main() {
    let result = (|| -> Result<serde_json::Value, String> {
        let mut input = String::new();
        io::stdin().read_to_string(&mut input).map_err(|e| e.to_string())?;
        let scenario = serde_json::from_str(&input).map_err(|e| e.to_string())?;
        kata::run(&scenario)
    })();
    match result {
        Ok(output) => println!("{output}"),
        Err(error) => { eprintln!("{error}"); std::process::exit(1); }
    }
}
