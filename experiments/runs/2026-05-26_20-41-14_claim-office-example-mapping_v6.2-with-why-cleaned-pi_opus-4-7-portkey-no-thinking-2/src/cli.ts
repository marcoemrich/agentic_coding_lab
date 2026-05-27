import { text } from "node:stream/consumers";
import { runScenario, type Scenario } from "./claim-office.js";

const main = async (): Promise<void> => {
  try {
    const scenario = JSON.parse(await text(process.stdin)) as Scenario;
    const result = runScenario(scenario);
    process.stdout.write(JSON.stringify(result));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
};

void main();
