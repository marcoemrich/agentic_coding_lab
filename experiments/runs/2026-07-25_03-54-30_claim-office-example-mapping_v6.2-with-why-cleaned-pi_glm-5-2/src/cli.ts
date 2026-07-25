import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

const readStdin = (): string => {
  return readFileSync(0, "utf-8");
};

const main = (): void => {
  const input = readStdin();
  const scenario = JSON.parse(input);
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output));
};

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
