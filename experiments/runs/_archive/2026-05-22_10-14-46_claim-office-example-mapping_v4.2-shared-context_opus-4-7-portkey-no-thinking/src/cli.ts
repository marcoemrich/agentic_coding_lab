import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

const input = readFileSync(0, "utf8");
try {
  const output = JSON.stringify(runScenario(JSON.parse(input)));
  process.stdout.write(output);
} catch (err) {
  process.stderr.write(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
