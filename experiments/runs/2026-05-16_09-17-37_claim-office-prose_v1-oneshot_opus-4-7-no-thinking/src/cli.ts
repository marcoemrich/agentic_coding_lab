import { runScenario } from "./scenario.js";
import type { Scenario } from "./types.js";

declare const process: any;
declare const Buffer: any;

async function readStdin(): Promise<string> {
  const chunks: any[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  const raw = await readStdin();
  const scenario = JSON.parse(raw) as Scenario;
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output) + "\n");
}

main().catch((err) => {
  process.stderr.write(`Error: ${(err as Error).message}\n`);
  process.exit(1);
});
