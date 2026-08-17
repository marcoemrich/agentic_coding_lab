import { processScenario, type Scenario } from "./claim-office.js";

let input = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) input += chunk;

try {
  const scenario = JSON.parse(input) as Scenario;
  process.stdout.write(JSON.stringify(processScenario(scenario)));
} catch (error: unknown) {
  const description = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${description}\n`);
  process.exitCode = 1;
}
