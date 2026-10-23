import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office.js";

function main(): void {
  try {
    const input = readFileSync(0, "utf8");
    const scenario = JSON.parse(input) as Scenario;
    const output = processScenario(scenario);
    process.stdout.write(`${JSON.stringify(output)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
}

main();
