import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
};

/** The office takes its work as one JSON scenario on stdin. */
const parseScenario = (json: string): Scenario => JSON.parse(json) as Scenario;

/** Read a scenario, run it, report the results -- the CLI is only this pipeline. */
const reportScenarioResults = async (): Promise<void> => {
  const scenario = parseScenario(await readStdin());
  process.stdout.write(JSON.stringify(runScenario(scenario)));
};

const REFUSED_EXIT_CODE = 1;

/**
 * The office refuses a scenario by throwing, and a refusal is an answer the
 * operator needs to read: the plain reason goes to stderr and the exit code is
 * non-zero, while stdout stays empty so a caller piping results downstream
 * never mistakes a refusal for an outcome.
 *
 * Letting the rejection go uncaught would produce the same status and the same
 * text, but wrapped in a Node stack trace and only as a side effect of nothing
 * handling it. Handling it here states the intended behaviour outright.
 */
try {
  await reportScenarioResults();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = REFUSED_EXIT_CODE;
}
