import { processScenario } from "./claim-office.js";
import { readFileSync } from "fs";

try {
  const input = readFileSync("/dev/stdin", "utf-8");
  const scenario = JSON.parse(input);
  const result = processScenario(scenario);
  process.stdout.write(JSON.stringify(result) + "\n");
} catch (e: any) {
  process.stderr.write(e.message + "\n");
  process.exit(1);
}
