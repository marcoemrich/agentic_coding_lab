import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

try {
  const input: unknown = JSON.parse(readFileSync(0, "utf8"));
  process.stdout.write(JSON.stringify(runScenario(input)));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
