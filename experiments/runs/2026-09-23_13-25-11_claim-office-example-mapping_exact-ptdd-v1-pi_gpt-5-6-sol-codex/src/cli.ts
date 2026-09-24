import { executeScenario, type Scenario } from "./claim-office.js";

async function main(): Promise<void> {
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
    const scenario = JSON.parse(Buffer.concat(chunks).toString()) as Scenario;
    process.stdout.write(JSON.stringify(executeScenario(scenario)));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(message);
    process.exitCode = 1;
  }
}

await main();
