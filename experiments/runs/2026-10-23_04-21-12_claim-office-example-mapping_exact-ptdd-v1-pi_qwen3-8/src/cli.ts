import { processScenario, type Scenario } from "./claim-office.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  try {
    const scenario = JSON.parse(await readStdin()) as Scenario;
    const outcome = processScenario(scenario);
    process.stdout.write(`${JSON.stringify(outcome)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office: ${message}\n`);
    process.exit(1);
  }
}

void main();
