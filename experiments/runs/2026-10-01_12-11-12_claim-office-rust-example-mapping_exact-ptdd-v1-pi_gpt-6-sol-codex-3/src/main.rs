use std::io::{self, Read};

fn main() {
    let result = (|| -> Result<String, String> {
        let mut input = String::new();
        io::stdin().read_to_string(&mut input).map_err(|e| e.to_string())?;
        let scenario = serde_json::from_str(&input).map_err(|e| e.to_string())?;
        kata::process(&scenario).map(|value| value.to_string())
    })();
    match result {
        Ok(json) => println!("{json}"),
        Err(error) => {
            eprintln!("{error}");
            std::process::exit(1);
        }
    }
}
