import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const STDIN_FILE_DESCRIPTOR = 0;

const readScenarioFromStdin = (): Scenario =>
  JSON.parse(readFileSync(STDIN_FILE_DESCRIPTOR, "utf8")) as Scenario;

const main = (): void => {
  try {
    const results = runScenario(readScenarioFromStdin());
    process.stdout.write(JSON.stringify(results));
  } catch (error) {
    process.stderr.write(`${(error as Error).message}\n`);
    process.exit(1);
  }
};

main();
