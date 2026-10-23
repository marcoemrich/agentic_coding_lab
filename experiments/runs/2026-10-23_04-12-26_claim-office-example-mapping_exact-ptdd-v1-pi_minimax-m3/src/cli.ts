// CLI entry point — reads a scenario JSON from stdin, runs processScenario,
// writes the results JSON to stdout. On error, writes the message to stderr
// and exits with a non-zero status.

import { processScenario } from "./scenario.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function writeStdout(text: string): void {
  process.stdout.write(text);
}

function writeStderr(text: string): void {
  process.stderr.write(text);
}

async function main(): Promise<void> {
  let raw: string;
  try {
    raw = await readStdin();
  } catch (err) {
    writeStderr(`failed to read stdin: ${(err as Error).message}\n`);
    process.exit(1);
    return;
  }

  let scenario: unknown;
  try {
    scenario = JSON.parse(raw);
  } catch (err) {
    writeStderr(`failed to parse JSON: ${(err as Error).message}\n`);
    process.exit(1);
    return;
  }

  try {
    const result = processScenario(scenario as Parameters<typeof processScenario>[0]);
    writeStdout(JSON.stringify(result));
    writeStdout("\n");
  } catch (err) {
    writeStderr(`error: ${(err as Error).message}\n`);
    process.exit(1);
    return;
  }
}

main();
