import { runScenario } from "./claim-office.js";

async function readStdin(): Promise<string> {
  const chunks: Array<Buffer> = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  const input = await readStdin();
  const scenario = JSON.parse(input);
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output));
}

main();
