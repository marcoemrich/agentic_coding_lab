import { runScenario, type Scenario } from "./claim-office.js";

async function main(): Promise<void> {
  try {
    let input = "";
    for await (const chunk of process.stdin) input += String(chunk);
    process.stdout.write(JSON.stringify(runScenario(JSON.parse(input) as Scenario)));
  } catch (error) {
    const description = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${description}\n`);
    process.exitCode = 1;
  }
}

await main();
