import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

try {
  const scenario = JSON.parse(readFileSync(0, "utf8"));
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
