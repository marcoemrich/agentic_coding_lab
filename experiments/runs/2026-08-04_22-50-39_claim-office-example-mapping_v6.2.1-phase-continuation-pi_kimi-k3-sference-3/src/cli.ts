import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

const input = readFileSync(0, "utf-8");
const scenario = JSON.parse(input);

try {
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result) + "\n");
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(1);
}
