import { readFileSync } from "node:fs";
import { processScenario, type ScenarioInput } from "./claim-office.js";

function runCli(): void {
  try {
    const rawInput = readFileSync(0, "utf8");
    const scenario = JSON.parse(rawInput) as ScenarioInput;
    const output = processScenario(scenario);
    process.stdout.write(`${JSON.stringify(output)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

runCli();
