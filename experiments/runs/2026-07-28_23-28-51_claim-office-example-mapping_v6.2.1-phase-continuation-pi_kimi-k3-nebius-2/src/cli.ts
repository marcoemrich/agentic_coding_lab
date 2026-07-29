import { runScenario, type Scenario } from "./claim-office.js";

function runScenarioJson(input: string): string {
  const scenario = JSON.parse(input) as Scenario;
  return JSON.stringify({ results: runScenario(scenario) });
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

const chunks: Buffer[] = [];
process.stdin.on("data", (chunk: Buffer) => chunks.push(chunk));
process.stdin.on("end", () => {
  try {
    process.stdout.write(runScenarioJson(Buffer.concat(chunks).toString("utf-8")));
  } catch (error) {
    process.stderr.write(errorMessage(error));
    process.exit(1);
  }
});
