// MHPCO Claim Office CLI entry point (see prompt.md).
// Reads a JSON scenario from stdin and writes { results } to stdout.
import { processScenario, type Scenario } from "./claim-office.js";

let scenarioJson = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) {
  scenarioJson += chunk;
}

try {
  const scenario: Scenario = JSON.parse(scenarioJson);
  process.stdout.write(JSON.stringify(processScenario(scenario)));
} catch (error) {
  process.stderr.write((error as Error).message);
  process.exitCode = 1;
}
