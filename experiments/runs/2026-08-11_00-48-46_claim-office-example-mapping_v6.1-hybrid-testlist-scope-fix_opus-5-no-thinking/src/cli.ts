import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
};

/** Takes the caller's JSON at its word — an ill-formed scenario surfaces as a claim it fails. */
const decodeScenario = (input: string): Scenario => JSON.parse(input) as Scenario;

/** The MHPCO reports the objection itself, not the machinery behind it. */
const describe = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const main = async (): Promise<void> => {
  const result = runScenario(decodeScenario(await readStdin()));
  process.stdout.write(JSON.stringify(result));
};

try {
  await main();
} catch (error) {
  process.stderr.write(`${describe(error)}\n`);
  process.exitCode = 1;
}
