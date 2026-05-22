import { runScenario } from "./claim-office.js";

async function readStdin(): Promise<string> {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

async function main(): Promise<void> {
  try {
    const raw = await readStdin();
    const input = JSON.parse(raw);
    const output = runScenario(input);
    process.stdout.write(JSON.stringify(output));
  } catch (err) {
    process.stderr.write(`Error: ${(err as Error).message}\n`);
    process.exit(1);
  }
}

main();
