import { runScenario } from "./claim-office.js";

// Read a scenario as JSON from stdin, write its results as JSON to stdout.
// Any parse or processing error is reported on stderr with a non-zero exit.
let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  try {
    const scenario = JSON.parse(input);
    process.stdout.write(JSON.stringify(runScenario(scenario)));
  } catch (error) {
    process.stderr.write(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
});
