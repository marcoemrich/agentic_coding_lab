import { parseScenario, runScenario } from "./claim-office.js";

const readStdin = (): Promise<string> =>
  new Promise((resolve) => {
    let input = "";

    process.stdin.on("data", (chunk) => (input += chunk));
    process.stdin.on("end", () => resolve(input));
  });

// The only write to stdout. A failure throws before reaching it, which is what
// keeps results off stdout on the error path.
const reportScenarioOutcome = async (): Promise<void> => {
  const outcome = runScenario(parseScenario(JSON.parse(await readStdin())));

  process.stdout.write(JSON.stringify(outcome));
};

// The only write to stderr: a description, not a stack trace. The domain errors
// are already phrased for a human reader, so the message is passed through
// as-is on a single line.
const reportFailure = (error: unknown): void => {
  const description = error instanceof Error ? error.message : String(error);

  process.stderr.write(`${description}\n`);
  process.exitCode = 1;
};

try {
  await reportScenarioOutcome();
} catch (error) {
  reportFailure(error);
}
