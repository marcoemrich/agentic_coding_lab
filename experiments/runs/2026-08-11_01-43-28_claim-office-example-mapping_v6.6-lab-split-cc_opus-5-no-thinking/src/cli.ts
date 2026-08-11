import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  let input = "";

  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) input += chunk;

  return input;
};

// The scenario is trusted, not validated: this is a happy-path CLI, so a
// malformed payload surfaces as a JSON.parse or runScenario failure rather
// than a schema error.
const parseScenario = (input: string): Scenario => JSON.parse(input) as Scenario;

/**
 * A rejection, rendered for someone reading a terminal rather than a stack
 * trace. `Error` is the only shape this CLI throws on purpose — anything else
 * reaching here is unforeseen, so it is stringified rather than assumed.
 */
const describeError = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const main = async (): Promise<void> => {
  const scenario = parseScenario(await readStdin());

  process.stdout.write(JSON.stringify(runScenario(scenario)));
};

try {
  await main();
} catch (error) {
  // Nothing is written to stdout before the scenario has run to completion, so
  // a rejection leaves stdout empty: the caller never sees partial results.
  process.stderr.write(`${describeError(error)}\n`);
  process.exitCode = 1;
}
