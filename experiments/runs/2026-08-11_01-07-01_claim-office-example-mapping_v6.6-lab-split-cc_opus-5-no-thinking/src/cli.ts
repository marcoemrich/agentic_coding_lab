import {
  runScenario,
  type Scenario,
  type ScenarioResult,
} from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: string[] = [];
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return chunks.join("");
};

// The one point where an untrusted string becomes a typed value. The assertion
// is unchecked: nothing here verifies that the parsed JSON is really a Scenario.
// Naming it marks the boundary so that the day a malformed-input case needs
// rejecting, there is a function to put the check in rather than a cast buried
// in a pipeline.
const parseScenario = (input: string): Scenario => JSON.parse(input) as Scenario;

const writeResult = (result: ScenarioResult): void => {
  process.stdout.write(JSON.stringify(result));
};

// The whole job, one stage per line, in the order they happen: read, parse,
// run, write. Nesting the four calls into one expression would say the same
// thing backwards.
const main = async (): Promise<void> => {
  const input = await readStdin();
  const scenario = parseScenario(input);
  const result = runScenario(scenario);
  writeResult(result);
};

// The mirror of parseScenario: an untyped value becoming a described one. A
// thrown value need not be an Error, so this narrows rather than asserts —
// String covers the case no throw site here produces.
const describeError = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

// A rejected scenario is a report to the customer, not a crash: stderr carries
// the description and the exit code carries the rejection. Setting exitCode
// rather than calling process.exit lets the streams flush first.
try {
  await main();
} catch (error) {
  process.stderr.write(`${describeError(error)}\n`);
  process.exitCode = 1;
}
