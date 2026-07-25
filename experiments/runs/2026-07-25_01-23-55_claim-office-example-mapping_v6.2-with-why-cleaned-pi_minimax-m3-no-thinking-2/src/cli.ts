import { processScenario, type ScenarioInput, type ScenarioOutput } from "./scenario.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  let input: ScenarioInput;
  try {
    const text = await readStdin();
    input = JSON.parse(text) as ScenarioInput;
  } catch (err) {
    process.stderr.write(`failed to read/parse input: ${(err as Error).message}\n`);
    process.exit(1);
    return;
  }
  let output: ScenarioOutput;
  try {
    output = processScenario(input);
  } catch (err) {
    process.stderr.write(`${(err as Error).message}\n`);
    process.exit(1);
    return;
  }
  process.stdout.write(`${JSON.stringify(output)}\n`);
}

main().catch((err: unknown) => {
  process.stderr.write(`${(err as Error).message}\n`);
  process.exit(1);
});
