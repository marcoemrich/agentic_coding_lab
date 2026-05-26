// CLI entry point: reads a scenario JSON from stdin, runs it through
// the claim office engine, and writes the result JSON to stdout.
// On any error, the message goes to stderr and the process exits non-zero.

import { runScenario } from "./claim-office.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  const raw = await readStdin();
  const input = JSON.parse(raw);
  const result = runScenario(input);
  process.stdout.write(JSON.stringify(result) + "\n");
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(message + "\n");
  process.exit(1);
});
