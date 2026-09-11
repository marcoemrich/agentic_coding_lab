import { text } from "node:stream/consumers";
import { runScenario, type Scenario } from "./claim-office.js";

const main = async (): Promise<void> => {
  const scenario = JSON.parse(await text(process.stdin)) as Scenario;
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output) + "\n");
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(message + "\n");
  process.exit(1);
});
