import { processScenario, type ScenarioInput, type ScenarioResult } from "./claim-office.js";
import * as readline from "readline";

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: string[] = [];
    const rl = readline.createInterface({ input: process.stdin });
    rl.on("line", (line) => chunks.push(line));
    rl.on("close", () => resolve(chunks.join("\n")));
    rl.on("error", reject);
  });
}

async function main(): Promise<void> {
  try {
    const input = await readStdin();
    const scenario: ScenarioInput = JSON.parse(input);
    const result: ScenarioResult = processScenario(scenario);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(message + "\n");
    process.exit(1);
  }
}

main();
