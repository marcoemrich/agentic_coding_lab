// cli.ts — claim-office CLI entry point. Reads JSON scenario from stdin, writes results JSON to stdout.
import { runScenario, type ScenarioInput } from "./scenario.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

async function main(): Promise<void> {
  let raw: string;
  try {
    raw = await readStdin();
  } catch (err) {
    process.stderr.write(`Failed to read stdin: ${(err as Error).message}\n`);
    process.exit(1);
    return;
  }

  let input: ScenarioInput;
  try {
    input = JSON.parse(raw) as ScenarioInput;
  } catch (err) {
    process.stderr.write(`Invalid JSON input: ${(err as Error).message}\n`);
    process.exit(1);
    return;
  }

  try {
    const output = runScenario(input);
    process.stdout.write(JSON.stringify(output) + "\n");
  } catch (err) {
    process.stderr.write(`${(err as Error).message}\n`);
    process.exit(1);
  }
}

main();
