import { runScenario } from "./claim-office.js";
import type { Scenario } from "./scenario.js";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    process.stdin.on("data", (chunk: Buffer) => chunks.push(chunk));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    process.stdin.on("error", (err) => reject(err));
  });
}

async function main(): Promise<void> {
  try {
    const raw = await readStdin();
    const scenario = JSON.parse(raw) as Scenario;
    const results = runScenario(scenario);
    process.stdout.write(JSON.stringify({ results }));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(message + "\n");
    process.exit(1);
  }
}

main();
