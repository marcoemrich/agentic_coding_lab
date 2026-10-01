import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

const STDIN_FILE_DESCRIPTOR = 0;

try {
  const scenario = JSON.parse(readFileSync(STDIN_FILE_DESCRIPTOR, "utf8"));
  process.stdout.write(JSON.stringify(processScenario(scenario)));
} catch (error) {
  process.stderr.write(`${String(error)}\n`);
  process.exitCode = 1;
}
