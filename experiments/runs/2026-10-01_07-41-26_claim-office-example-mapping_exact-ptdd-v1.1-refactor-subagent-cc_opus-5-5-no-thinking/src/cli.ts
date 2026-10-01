import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

try {
  const scenario = JSON.parse(readFileSync(0, "utf8"));
  process.stdout.write(JSON.stringify(processScenario(scenario)));
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
