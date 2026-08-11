import { runScenario, type Scenario } from "./claim-office.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

try {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  // Written only once the whole scenario has succeeded, so a failing step
  // leaves stdout empty rather than emitting partial results.
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
