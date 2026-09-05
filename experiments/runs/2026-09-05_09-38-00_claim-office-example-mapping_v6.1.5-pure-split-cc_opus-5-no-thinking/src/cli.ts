import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
};

// A scenario in, its results out: the whole CLI is this one pipeline.
const main = async (): Promise<void> => {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
};

// A rejected scenario is a refusal by the office, not a crash of the program:
// the customer is told why in one line, and nothing is written to stdout. The
// default unhandled-rejection report would satisfy the same exit status, but
// it would answer with a stack trace over the office's own words.
const FAILURE_EXIT_CODE = 1;

const describe = (reason: unknown): string =>
  reason instanceof Error ? reason.message : String(reason);

try {
  await main();
} catch (reason) {
  process.stderr.write(`${describe(reason)}\n`);
  process.exitCode = FAILURE_EXIT_CODE;
}
