import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

// This module is only ever run as a script (stdin in, stdout/stderr out), so
// `main` is not exported: there is no in-process caller to export it for.
const main = (): void => {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input) as Scenario;
  try {
    process.stdout.write(JSON.stringify(runScenario(scenario)));
  } catch (error) {
    process.stderr.write((error as Error).message);
    process.exit(1);
  }
};

main();
