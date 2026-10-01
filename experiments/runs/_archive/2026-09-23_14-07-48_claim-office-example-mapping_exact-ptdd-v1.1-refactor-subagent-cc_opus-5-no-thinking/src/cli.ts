import { readFileSync } from "node:fs";
import { runScenario } from "./scenario.js";
import type { Scenario } from "./scenario.js";

function readStdin(): string {
  return readFileSync(0, "utf8");
}

// The MHPCO states why it refuses. Anything the office throws carries that
// statement as its message; anything else that reaches the counter is passed
// on as it stands.
function refusalReason(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}

// The MHPCO answers a scenario it accepts on stdout; one it refuses is
// reported on stderr, and no results are written at all.
try {
  const scenario = JSON.parse(readStdin()) as Scenario;
  const results = runScenario(scenario);
  process.stdout.write(`${JSON.stringify({ results })}\n`);
} catch (reason) {
  process.stderr.write(`${refusalReason(reason)}\n`);
  process.exit(1);
}
