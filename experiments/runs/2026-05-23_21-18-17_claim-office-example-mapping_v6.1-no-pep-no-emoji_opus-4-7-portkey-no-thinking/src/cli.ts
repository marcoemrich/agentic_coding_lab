import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

try {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input);
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result));
} catch (error) {
  process.stderr.write(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
