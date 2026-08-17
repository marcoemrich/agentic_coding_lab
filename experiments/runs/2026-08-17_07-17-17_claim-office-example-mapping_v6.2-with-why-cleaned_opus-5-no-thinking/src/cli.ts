import { runScenario, type Scenario } from "./claim-office.js";

// Chunks are collected as Buffers and decoded once at the end, rather than
// decoded per chunk: a multi-byte UTF-8 character can straddle a chunk
// boundary, and decoding the halves separately yields replacement characters.
const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);

  return Buffer.concat(chunks).toString("utf8");
};

const parseScenario = (json: string): Scenario => JSON.parse(json) as Scenario;

// A refused scenario earns an explanation, not a stack trace: the office states
// its objection on stderr, writes no results, and returns a non-zero status.
try {
  const scenario = parseScenario(await readStdin());

  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (refusal) {
  process.stderr.write(`${(refusal as Error).message}\n`);
  process.exit(1);
}
