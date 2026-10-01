use std::io::{self, Read};

fn main() {
    let result = (|| -> Result<String, String> {
        let mut input = String::new();
        io::stdin().read_to_string(&mut input).map_err(|error| error.to_string())?;
        let scenario = serde_json::from_str(&input).map_err(|error| error.to_string())?;
        let output = kata::process(scenario)?;
        serde_json::to_string(&output).map_err(|error| error.to_string())
    })();
    match result {
        Ok(json) => println!("{json}"),
        Err(error) => {
            eprintln!("{error}");
            std::process::exit(1);
        }
    }
}
