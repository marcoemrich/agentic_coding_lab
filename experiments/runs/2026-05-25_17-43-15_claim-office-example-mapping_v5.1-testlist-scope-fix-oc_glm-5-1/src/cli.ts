import { processScenario } from "./claim-office.js";
import * as readline from "readline";

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    const chunks: string[] = [];
    const rl = readline.createInterface({ input: process.stdin });
    rl.on("line", (chunk) => chunks.push(chunk));
    rl.on("close", () => resolve(chunks.join("\n")));
  });
}

async function main(): Promise<void> {
  try {
    const input = JSON.parse(await readStdin());
    const result = processScenario(input);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (err) {
    if (err instanceof Error) {
      process.stderr.write(err.message + "\n");
    }
    process.exit(1);
  }
}

main();
