import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

const STDIN_FD = 0;

try {
  const scenario = JSON.parse(readFileSync(STDIN_FD, "utf8"));
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`error: ${message}\n`);
  process.exitCode = 1;
}
