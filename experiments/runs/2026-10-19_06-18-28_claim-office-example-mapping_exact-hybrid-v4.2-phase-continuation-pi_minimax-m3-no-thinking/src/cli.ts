import type { Readable, Writable } from "node:stream";
import { runScenario, type ScenarioInput } from "./scenario.js";

async function readAll(stream: Readable): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function writeError(stderr: Writable, message: string): void {
  stderr.write(`Error: ${message}\n`);
}

export async function runCli(
  stdin: Readable,
  stdout: Writable,
  stderr: Writable = process.stderr
): Promise<number> {
  let input: string;
  try {
    input = await readAll(stdin);
  } catch (e) {
    writeError(stderr, `Failed to read stdin: ${errorMessage(e)}`);
    return 1;
  }

  let scenarioInput: ScenarioInput;
  try {
    scenarioInput = JSON.parse(input);
  } catch (e) {
    writeError(stderr, `Invalid JSON: ${errorMessage(e)}`);
    return 1;
  }

  try {
    const result = runScenario(scenarioInput);
    stdout.write(JSON.stringify(result));
    return 0;
  } catch (e) {
    writeError(stderr, errorMessage(e));
    return 1;
  }
}

// Run as standalone process
if (
  typeof process !== "undefined" &&
  process.argv[1] &&
  import.meta.url === `file://${process.argv[1]}`
) {
  runCli(process.stdin, process.stdout, process.stderr)
    .then((code) => {
      if (code !== 0) process.exit(code);
    })
    .catch((e) => {
      process.stderr.write(`Fatal: ${errorMessage(e)}\n`);
      process.exit(1);
    });
}
