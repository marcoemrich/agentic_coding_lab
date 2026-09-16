import { runScenario, type Scenario } from "./claim-office.js";

const EXIT_FAILURE = 1;

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function main(): Promise<void> {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  const results = runScenario(scenario);
  process.stdout.write(`${JSON.stringify({ results })}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${describeError(error)}\n`);
  process.exitCode = EXIT_FAILURE;
});
