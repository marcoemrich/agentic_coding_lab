//! The office's counter: it reads a scenario document from stdin and writes
//! the results document to stdout. This is an adapter only -- every rule of
//! the MHPCO lives in the library.

use std::io::Read;

fn main() {
    match settle_what_the_window_received() {
        Ok(results) => println!("{results}"),
        Err(objection) => {
            eprintln!("{objection}");
            std::process::exit(1);
        }
    }
}

/// Takes the scenario document handed in at the window and reports either the
/// results document to publish or the office's objection to it. The two ways
/// the counter can fail to publish -- a document it could not read in, and a
/// scenario the office refused -- are reported in the same breath, because the
/// office rules them one answer: a description of what it objects to, and a
/// non-zero status. The counter has no finer ruling to make between them, so
/// the refusal is written once here rather than once per ground. A different
/// exit status per ground, or a refusal published as a document of its own,
/// would be the change that pulls them apart again.
fn settle_what_the_window_received() -> Result<String, String> {
    let mut scenario = String::new();
    std::io::stdin()
        .read_to_string(&mut scenario)
        .map_err(|error| error.to_string())?;
    kata::settle_the_scenario(&scenario)
}
