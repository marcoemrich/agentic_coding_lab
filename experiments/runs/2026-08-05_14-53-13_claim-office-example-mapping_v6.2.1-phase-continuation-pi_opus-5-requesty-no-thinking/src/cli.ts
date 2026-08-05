import { text } from "node:stream/consumers";
import { runScenario, type Scenario } from "./claim-office.js";

/** The claim office as a pipe: a scenario arrives on stdin, its results leave on stdout. */
try {
  const scenario = JSON.parse(await text(process.stdin)) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  // A rejected scenario is reported as a description, not as a crash dump.
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
