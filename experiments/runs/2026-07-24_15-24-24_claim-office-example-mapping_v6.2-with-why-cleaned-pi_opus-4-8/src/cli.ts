import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

const STDIN_FD = 0;

function main(): void {
  const input = readFileSync(STDIN_FD, "utf8");
  const scenario = JSON.parse(input);
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output));
}

try {
  main();
} catch (error) {
  process.stderr.write(
    `Error: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
}
