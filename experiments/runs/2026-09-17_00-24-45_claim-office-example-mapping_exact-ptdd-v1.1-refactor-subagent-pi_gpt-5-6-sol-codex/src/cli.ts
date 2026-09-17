import { readFileSync } from "node:fs";
import { executeScenario, type Scenario } from "./claim-office.js";

function reportRejection(error: unknown): void {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(description);
  process.exitCode = 1;
}

try {
  const input = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify(executeScenario(input)));
} catch (error) {
  reportRejection(error);
}
