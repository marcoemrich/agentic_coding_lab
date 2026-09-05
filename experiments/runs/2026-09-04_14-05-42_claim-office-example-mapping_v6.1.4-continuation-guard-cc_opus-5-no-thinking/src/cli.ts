import { runScenario } from "./claim-office.js";
import type { Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  let input = "";
  for await (const chunk of process.stdin) input += chunk;

  return input;
};

// The clerk's refusal, not the machinery behind it: a stack trace is not an
// error description. Non-Error throws are stringified rather than trusted to
// have a `.message`, so the CLI never prints "undefined" at a customer.
const describe = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

try {
  const scenario = JSON.parse(await readStdin()) as Scenario;

  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  // stdout stays empty on a rejection, so no partial results are ever read.
  process.stderr.write(`${describe(error)}\n`);
  process.exit(1);
}
