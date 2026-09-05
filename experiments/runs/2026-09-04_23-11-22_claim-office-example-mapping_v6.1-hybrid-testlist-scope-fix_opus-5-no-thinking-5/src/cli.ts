import { runScenario, type Scenario } from "./claim-office.js";

/** Resolves once stdin is exhausted — the whole scenario, never a partial one. */
const readAllStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

/** The sole point where untrusted input is taken on trust as a Scenario. */
const parseScenario = (input: string): Scenario => JSON.parse(input) as Scenario;

const messageOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

/** Every failure — reading, parsing, or running — leaves stdout empty. */
try {
  const scenario = parseScenario(await readAllStdin());
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`${messageOf(error)}\n`);
  process.exit(1);
}
