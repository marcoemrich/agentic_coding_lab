import { runScenario, type Scenario } from "./claim-office.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  const results = runScenario(scenario);
  process.stdout.write(`${JSON.stringify({ results })}\n`);
}

// The MHPCO rejects a whole scenario it cannot process: nothing on stdout,
// a description on stderr, and a non-zero status.
function rejectScenario(error: unknown): void {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${description}\n`);
  process.exitCode = 1;
}

main().catch(rejectScenario);
