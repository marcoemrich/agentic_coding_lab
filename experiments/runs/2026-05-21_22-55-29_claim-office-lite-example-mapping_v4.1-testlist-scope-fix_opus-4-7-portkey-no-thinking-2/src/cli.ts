import { runScenario } from "./claim-office.js";

async function readAllStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

try {
  const input = await readAllStdin();
  const scenario = JSON.parse(input);
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result));
} catch (err) {
  process.stderr.write((err as Error).message);
  process.exit(1);
}
