import { processScenario, type Scenario } from "./claim-office.js";

function readStdin(): Promise<string> {
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
  const input = await readStdin();
  let scenario: Scenario;
  try {
    scenario = JSON.parse(input) as Scenario;
  } catch (error) {
    process.stderr.write(`invalid JSON: ${error}`);
    process.exit(1);
    return;
  }
  try {
    const results = processScenario(scenario);
    process.stdout.write(JSON.stringify({ results }) + "\n");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`claim-office error: ${message}`);
    process.exit(1);
  }
}

void main();