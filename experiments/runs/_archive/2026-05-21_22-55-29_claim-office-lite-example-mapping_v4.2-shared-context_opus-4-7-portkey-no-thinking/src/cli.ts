import { runScenario } from "./claim-office.js";

// Pure transformation: scenario JSON in → results JSON out. Isolated from
// stdin/stdout plumbing so upcoming CLI validation tests (unknown item
// types, claim referencing absent policy item, negative amounts, etc.)
// can design error paths against this function directly without spawning
// a subprocess.
function scenarioJsonToResultJson(scenarioJson: string): string {
  const scenario = JSON.parse(scenarioJson);
  const result = runScenario(scenario);
  return JSON.stringify(result);
}

function readAllStdin(): Promise<string> {
  return new Promise((resolve) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      input += chunk;
    });
    process.stdin.on("end", () => {
      resolve(input);
    });
  });
}

async function main(): Promise<void> {
  const scenarioJson = await readAllStdin();
  try {
    const output = scenarioJsonToResultJson(scenarioJson);
    process.stdout.write(output);
    process.exit(0);
  } catch (err) {
    process.stderr.write((err as Error).message + "\n");
    process.exit(1);
  }
}

main();
