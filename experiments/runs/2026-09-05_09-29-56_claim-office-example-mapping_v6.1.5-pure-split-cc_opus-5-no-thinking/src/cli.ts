// The `claim-office` command: reads a JSON scenario from stdin and writes the
// JSON results to stdout.
import { text } from "node:stream/consumers";
import { runScenario, type Scenario } from "./claim-office.js";

const main = async (): Promise<void> => {
  const scenario = JSON.parse(await text(process.stdin)) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
};

// A rejected scenario is reported as a description, not a crash: the message
// alone goes to stderr, nothing goes to stdout, and the exit code is non-zero.
try {
  await main();
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exitCode = 1;
}
