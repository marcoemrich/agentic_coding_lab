#!/usr/bin/env tsx
import { pathToFileURL } from "node:url";
import { runScenario, type Scenario } from "./claim-office.js";

/** The whole CLI, as a function: JSON scenario in, JSON results out. */
export const runCli = (input: string): string =>
  JSON.stringify(runScenario(JSON.parse(input) as Scenario));

const readAll = async (stream: NodeJS.ReadableStream): Promise<string> => {
  const chunks: string[] = [];

  stream.setEncoding("utf8");
  for await (const chunk of stream) chunks.push(chunk as string);

  return chunks.join("");
};

/**
 * Whether this module is the program node was asked to run, rather than one
 * imported by something else.
 *
 * ESM has no `require.main === module`, but it does expose the two halves of
 * the question exactly: `import.meta.url` is this file, and `process.argv[1]`
 * is the entry script. Comparing them asks what we mean. Matching the filename
 * against "cli.ts" only approximates it, and silently stops matching the day
 * the file is compiled to cli.js or renamed.
 */
const isEntryPoint = (): boolean =>
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

/** Importing this module from a test must not consume the runner's stdin. */
if (isEntryPoint()) {
  process.stdout.write(runCli(await readAll(process.stdin)));
}
