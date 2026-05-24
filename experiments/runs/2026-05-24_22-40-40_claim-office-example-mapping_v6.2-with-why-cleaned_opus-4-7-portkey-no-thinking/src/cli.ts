import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

try {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input);
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result) + "\n");
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(1);
}
