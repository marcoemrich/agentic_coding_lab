import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

const main = (): void => {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input);
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output) + "\n");
};

try {
  main();
} catch (error) {
  process.stderr.write(
    `claim-office: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
}
