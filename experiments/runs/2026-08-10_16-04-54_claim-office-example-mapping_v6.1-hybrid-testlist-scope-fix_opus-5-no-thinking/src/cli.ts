import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

// Nothing is written to stdout until the whole scenario has been settled: a
// scenario that throws half way through must leave stdout EMPTY, not holding the
// results of the steps that happened to succeed before the failure.
const reportScenario = async (): Promise<void> => {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  const results = runScenario(scenario);

  process.stdout.write(JSON.stringify({ results }));
};

const descriptionOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

// The failure half of the CLI contract: a rejected scenario — malformed JSON, an
// unknown item type, an uncovered damage — is a description on stderr and a
// non-zero exit, never a partial result on stdout.
const reportFailure = (error: unknown): void => {
  process.stderr.write(`${descriptionOf(error)}\n`);
  process.exit(1);
};

reportScenario().catch(reportFailure);
