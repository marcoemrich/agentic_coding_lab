import { runScenario } from "./claim-office.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function translateStep(step: { op: string } & Record<string, unknown>): unknown {
  const { op, ...rest } = step;
  return { type: op, ...rest };
}

async function main(): Promise<void> {
  const input = await readStdin();
  const parsed = JSON.parse(input) as {
    customer: unknown;
    steps: ({ op: string } & Record<string, unknown>)[];
  };
  const scenario = {
    customer: parsed.customer,
    steps: parsed.steps.map(translateStep),
  };
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output) + "\n");
}

main().catch((err: Error) => {
  process.stderr.write(`${err.message}\n`);
  process.exit(1);
});
