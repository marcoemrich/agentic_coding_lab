import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office.js";

const main = (): void => {
  try {
    const input = readFileSync(0, "utf8");
    const scenario = JSON.parse(input) as Scenario;
    process.stdout.write(JSON.stringify(processScenario(scenario)));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
};

main();
