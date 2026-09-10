import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const readScenarioFromStdin = (): Scenario =>
  JSON.parse(readFileSync(0, "utf8")) as Scenario;

const main = (): void => {
  try {
    const result = runScenario(readScenarioFromStdin());
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Error: ${message}\n`);
    process.exit(1);
  }
};

main();
