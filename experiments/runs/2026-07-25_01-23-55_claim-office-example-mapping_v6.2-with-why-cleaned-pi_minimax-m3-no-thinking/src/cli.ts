import { processScenario } from "./scenario.js";
import type { Scenario } from "./types.js";

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: string) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

async function main(): Promise<void> {
  try {
    const raw = await readStdin();
    const scenario = JSON.parse(raw) as Scenario;
    const { results } = processScenario(scenario);
    process.stdout.write(JSON.stringify({ results }));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(message + "\n");
    process.exit(1);
  }
}

main();
