/**
 * CLI entry point for the claim-office executable: reads a scenario JSON
 * document from stdin, runs it, and writes the results JSON document to
 * stdout.
 */
import { runScenario, type Scenario } from "./claim-office.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  const input = await readStdin();
  const results = runScenario(JSON.parse(input) as Scenario);
  process.stdout.write(JSON.stringify({ results }));
}

main().catch((error: unknown) => {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(1);
});
