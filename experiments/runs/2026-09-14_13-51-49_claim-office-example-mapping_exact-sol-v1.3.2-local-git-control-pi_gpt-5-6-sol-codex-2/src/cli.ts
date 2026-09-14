import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

try {
  const input: unknown = JSON.parse(readFileSync(0, "utf8"));
  process.stdout.write(JSON.stringify(processScenario(input)));
} catch (error: unknown) {
  const description = error instanceof Error ? error.message : "Invalid scenario";
  process.stderr.write(`${description}\n`);
  process.exitCode = 1;
}
