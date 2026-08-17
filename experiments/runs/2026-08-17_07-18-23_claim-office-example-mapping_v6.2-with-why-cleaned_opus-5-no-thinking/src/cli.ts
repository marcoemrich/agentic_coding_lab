import { InvalidScenarioError, runScenario, type Scenario } from "./claim-office.js";

const REJECTED_EXIT_CODE = 1;

const readStdin = async (): Promise<string> => {
  const chunks: string[] = [];
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    chunks.push(chunk as string);
  }
  return chunks.join("");
};

// Stdin that is not JSON at all is the customer's input being wrong in the same
// way an unpriceable item type is, so it is reported the same way. Converting it
// here rather than widening the catch below keeps `InvalidScenarioError` meaning
// exactly one thing to the handler: the customer sent something MHPCO cannot
// price. A raw SyntaxError escaping as an unhandled rejection would print a
// stack trace through this module's internals.
// The assertion is the one place untrusted JSON becomes a Scenario, and it is
// deliberately not a validation: `runScenario` already rejects the parts it
// cannot price (unknown item types, claims on uninsured items) with the same
// error this reports, so re-checking the shape here would duplicate those rules
// in a second, weaker form. What this does guarantee is that the failure is a
// described rejection rather than a stack trace.
const parseScenario = (input: string): Scenario => {
  try {
    return JSON.parse(input) as Scenario;
  } catch (error) {
    throw new InvalidScenarioError(
      `Scenario is not valid JSON: ${(error as Error).message}`,
    );
  }
};

// Only a rejected scenario is reported as a description and an exit code.
// Anything else is a fault in here, and is left to crash loudly rather than be
// dressed up as bad input — the whole pipeline sits in the `try` so that split
// is decided by the error's type, not by which line happened to throw.
const main = async (): Promise<void> => {
  try {
    const scenario = parseScenario(await readStdin());
    process.stdout.write(JSON.stringify(runScenario(scenario)));
  } catch (error) {
    if (!(error instanceof InvalidScenarioError)) {
      throw error;
    }
    process.stderr.write(`${error.message}\n`);
    process.exitCode = REJECTED_EXIT_CODE;
  }
};

await main();
