import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { runScenario, type Scenario } from "./claim-office.js";

export const processScenarioJson = (input: string): string =>
  JSON.stringify(runScenario(JSON.parse(input) as Scenario));

// The executable itself: the whole of stdin in, the results out. Kept behind a
// guard so importing this module for its function does not consume stdin.
const isEntryPoint = process.argv[1] === fileURLToPath(import.meta.url);

if (isEntryPoint) {
  process.stdout.write(processScenarioJson(readFileSync(0, "utf8")));
}
