#!/usr/bin/env tsx
import { readFileSync } from "node:fs";
import { runScenario, type Scenario } from "./claim-office.js";

// The CLI is a thin shell around runScenario: one scenario in as JSON on stdin,
// one result object out as JSON on stdout. All the domain rules live in
// claim-office.ts; nothing here decides anything about premiums or payouts.
const runScenarioFromStdin = (): void => {
  const stdinText = readFileSync(0, "utf8");
  const scenario = JSON.parse(stdinText) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
};

// A rejected quote or claim is an expected outcome for this CLI, not a crash:
// the customer named an item the MHPCO does not insure, or filed a claim the
// policy does not cover. Those are answers, so the user gets the sentence that
// explains the decision rather than a stack trace through the pricing code.
// Nothing is written to stdout in that case — a caller parsing our output must
// never mistake a rejection for a result.
const describeFailure = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

try {
  runScenarioFromStdin();
} catch (error) {
  process.stderr.write(`${describeFailure(error)}\n`);
  process.exit(1);
}
