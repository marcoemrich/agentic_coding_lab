import { text } from "node:stream/consumers";
import { runScenario, type Scenario } from "./claim-office.js";

const main = async (): Promise<void> => {
  const scenario = JSON.parse(await text(process.stdin)) as Scenario;
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result) + "\n");
};

main().catch((error: Error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
