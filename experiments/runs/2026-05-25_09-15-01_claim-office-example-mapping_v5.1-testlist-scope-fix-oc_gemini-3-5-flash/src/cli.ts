import * as readline from "readline";
import { runScenario, Scenario } from "./claim-office.js";

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  let inputData = "";
  for await (const chunk of rl) {
    inputData += chunk;
  }

  if (!inputData.trim()) {
    process.exit(0);
  }

  try {
    const scenario: Scenario = JSON.parse(inputData);
    const result = runScenario(scenario);
    process.stdout.write(JSON.stringify(result));
    process.exit(0);
  } catch (error: any) {
    process.stderr.write(error.message || String(error));
    process.exit(1);
  }
}

main();
