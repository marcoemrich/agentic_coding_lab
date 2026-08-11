import type { Readable } from "node:stream";
import { scoreArmy, type Card } from "./sphinx-score.js";

export async function runCli(stdin: Readable): Promise<string> {
  let input = "";
  for await (const chunk of stdin) input += chunk;

  const { army } = JSON.parse(input) as { army: Card[] };
  return JSON.stringify({ score: scoreArmy(army) });
}

const isEntryPoint = process.argv[1]?.endsWith("cli.ts");

if (isEntryPoint) {
  process.stdout.write(await runCli(process.stdin));
}
