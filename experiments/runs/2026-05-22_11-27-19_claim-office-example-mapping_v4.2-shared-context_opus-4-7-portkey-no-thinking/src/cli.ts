import { runScenario } from "./claim-office.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  try {
    const input = JSON.parse(await readStdin());
    const result = runScenario(input);
    process.stdout.write(JSON.stringify(result));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(message + "\n");
    process.exit(1);
  }
}

main();
