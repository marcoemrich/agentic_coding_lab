import { runScenario } from "./runner.js";
import { Scenario } from "./types.js";

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

async function main() {
  try {
    const input = await readStdin();
    const scenario: Scenario = JSON.parse(input);
    const output = runScenario(scenario);
    process.stdout.write(JSON.stringify(output));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(msg + "\n");
    process.exit(1);
  }
}

main();
