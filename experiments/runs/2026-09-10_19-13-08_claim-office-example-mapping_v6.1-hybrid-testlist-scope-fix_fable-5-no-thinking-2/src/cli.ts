import { text } from "node:stream/consumers";
import { runScenario, Scenario } from "./claim-office.js";

const main = async (): Promise<void> => {
  try {
    const scenario = JSON.parse(await text(process.stdin)) as Scenario;
    const result = runScenario(scenario);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (error) {
    process.stderr.write(`${(error as Error).message}\n`);
    process.exit(1);
  }
};

main();
