import { processScenario, type Scenario } from "./claim-office.js";

let input = "";
for await (const chunk of process.stdin) input += String(chunk);

try {
  const scenario = JSON.parse(input) as Scenario;
  process.stdout.write(JSON.stringify(processScenario(scenario)));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
