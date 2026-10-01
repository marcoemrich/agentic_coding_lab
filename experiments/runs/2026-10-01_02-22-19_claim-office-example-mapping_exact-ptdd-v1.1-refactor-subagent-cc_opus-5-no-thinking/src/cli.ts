import { runScenario, type Scenario } from "./claim-office.js";

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (input += chunk));
    process.stdin.on("end", () => resolve(input));
    process.stdin.on("error", reject);
  });
}

function describeFailure(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function main(): Promise<void> {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${describeFailure(error)}\n`);
  process.exitCode = 1;
});
