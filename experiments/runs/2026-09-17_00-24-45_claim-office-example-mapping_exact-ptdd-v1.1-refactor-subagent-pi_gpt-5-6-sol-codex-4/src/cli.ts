import { executeScenario, type Scenario } from "./claim-office.js";

async function readStandardInput(): Promise<string> {
  let input = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) input += chunk;
  return input;
}

function executeJsonScenario(input: string): string {
  const scenario = JSON.parse(input) as Scenario;
  return JSON.stringify(executeScenario(scenario));
}

try {
  const input = await readStandardInput();
  process.stdout.write(executeJsonScenario(input));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
