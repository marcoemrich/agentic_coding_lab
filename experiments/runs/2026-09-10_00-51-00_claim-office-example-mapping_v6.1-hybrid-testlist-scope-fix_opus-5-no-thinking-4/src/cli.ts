import { runScenario, type Scenario } from "./claim-office.js";

// Chunks are concatenated as bytes, not strings: a multi-byte character can be
// split across two chunks, and decoding each chunk on its own would corrupt it.
const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
};

// The MHPCO trusts its own schema: input is taken to be a scenario as described
// there, which is what this cast asserts.
const parseScenario = (input: string): Scenario => JSON.parse(input) as Scenario;

// A rejected scenario gets a one-line description of *why* on stderr and an
// empty stdout -- never a stack trace, which is an implementation detail the
// clerk at the counter cannot act on.
const describeRejection = (reason: unknown): string =>
  reason instanceof Error ? reason.message : String(reason);

const EXIT_REJECTED = 1;

try {
  process.stdout.write(JSON.stringify(runScenario(parseScenario(await readStdin()))));
} catch (rejection) {
  process.stderr.write(`${describeRejection(rejection)}\n`);
  process.exit(EXIT_REJECTED);
}
