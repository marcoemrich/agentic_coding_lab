import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

/**
 * Reads a scenario as JSON on stdin and writes its results as JSON on stdout.
 *
 * The calculation module knows nothing about processes: it THROWS on invalid
 * input, and translating that into stderr plus a non-zero exit is this file's
 * only other job. Stdout therefore carries the results document or nothing.
 */
const main = (): void => {
  try {
    // fd 0 read to EOF — the scenario is a single JSON document, so this avoids
    // stream plumbing and the races that come with it. Inside the try because an
    // unreadable or absent stdin must reach stderr like any other failure, not
    // escape as an uncaught stack trace.
    const input = readFileSync(0, "utf8");

    // UNVALIDATED BOUNDARY: this cast asserts a shape nothing has checked. The
    // library validates item types and damage amounts, but no code validates
    // that the document IS a Scenario — a malformed `{"steps": "nonsense"}`
    // fails somewhere inside runScenario with a confusing message, or throws a
    // TypeError. It still exits non-zero with SOME message, so the contract
    // holds; only the message quality suffers. No test or spec example covers a
    // malformed shape, so no validation is written here.
    const scenario = JSON.parse(input) as Scenario;
    process.stdout.write(JSON.stringify(runScenario(scenario)));
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exit(1);
  }
};

main();
