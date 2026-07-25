import { processScenario } from "./claim-office.js";

async function main(): Promise<void> {
  let input = "";

  process.stdin.setEncoding("utf8");

  for await (const chunk of process.stdin) {
    input += chunk;
  }

  try {
    const scenario = JSON.parse(input);
    const results = processScenario(scenario.customer, scenario.steps);
    process.stdout.write(JSON.stringify({ results }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

main();
