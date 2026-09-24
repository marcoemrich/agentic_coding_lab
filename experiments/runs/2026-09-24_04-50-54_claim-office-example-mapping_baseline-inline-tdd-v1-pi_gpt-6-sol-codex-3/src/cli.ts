import { runScenario, type Scenario } from './office.js';

try {
  let input = '';
  for await (const chunk of process.stdin) input += chunk.toString();
  const result = runScenario(JSON.parse(input) as Scenario);
  process.stdout.write(`${JSON.stringify(result)}\n`);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
