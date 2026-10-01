import { runScenario, type Scenario } from "./claimOffice.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

try {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  process.stdout.write(`${JSON.stringify({ results: runScenario(scenario) })}\n`);
} catch (error) {
  process.stderr.write(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
