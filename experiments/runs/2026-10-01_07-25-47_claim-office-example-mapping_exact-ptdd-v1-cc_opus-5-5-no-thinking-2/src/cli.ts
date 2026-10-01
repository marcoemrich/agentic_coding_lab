import { runScenario, type Scenario } from "./claim-office.js";

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (input += chunk));
    process.stdin.on("end", () => resolve(input));
  });
}

try {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
