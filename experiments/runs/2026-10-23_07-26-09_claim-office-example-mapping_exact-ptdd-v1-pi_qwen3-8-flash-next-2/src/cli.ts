import { runScenario, type ScenarioInput } from "./scenario.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  const input = await readStdin();
  const scenario = JSON.parse(input) as ScenarioInput;
  const results = runScenario(scenario);
  process.stdout.write(`${JSON.stringify(results)}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${String(error)}\n`);
  process.exitCode = 1;
});
