import { runScenario, type Scenario } from './office.js';

async function main(): Promise<void> {
  try {
    let input = '';
    for await (const chunk of process.stdin) input += chunk.toString();
    const scenario = JSON.parse(input) as Scenario;
    const output = runScenario(scenario);
    process.stdout.write(`${JSON.stringify(output)}\n`);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

void main();
