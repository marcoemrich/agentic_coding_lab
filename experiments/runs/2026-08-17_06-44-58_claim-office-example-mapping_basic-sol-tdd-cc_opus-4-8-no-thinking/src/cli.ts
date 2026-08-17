import { readFileSync } from "node:fs";
import { runScenario } from "./claimOffice.js";

function main(): void {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input) as Parameters<typeof runScenario>[0];
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result));
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
