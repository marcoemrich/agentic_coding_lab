import { pathToFileURL } from "node:url";

import { runScenario, type Scenario } from "./claim-office.js";

export const runCli = (input: string): string =>
  JSON.stringify(runScenario(JSON.parse(input) as Scenario));

const readStdin = async (): Promise<string> => {
  const chunks: string[] = [];
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) chunks.push(chunk);

  return chunks.join("");
};

// Importing this module (as the spec does) must not consume stdin.
const isEntryPoint = import.meta.url === pathToFileURL(process.argv[1] ?? "").href;

if (isEntryPoint) {
  process.stdout.write(runCli(await readStdin()));
}
