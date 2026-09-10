import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

const main = (): void => {
  try {
    const scenario = JSON.parse(readFileSync(process.stdin.fd, "utf8")) as Scenario;
    process.stdout.write(JSON.stringify(runScenario(scenario)) + "\n");
  } catch (error) {
    process.stderr.write(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
};

main();
