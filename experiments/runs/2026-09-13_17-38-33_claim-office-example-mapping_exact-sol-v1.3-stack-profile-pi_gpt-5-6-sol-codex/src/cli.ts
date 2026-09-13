import { readFileSync } from "node:fs";
import { executeScenario, type Scenario } from "./claim-office.js";

const EXIT_FAILURE = 1;

try {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify(executeScenario(scenario)));
} catch (error) {
  process.stderr.write(String(error));
  process.exitCode = EXIT_FAILURE;
}
