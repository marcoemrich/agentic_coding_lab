import { runScenario } from "./scenario.js";

/** Read all of stdin as a UTF-8 string. */
async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => { data += chunk; });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

/** Write `err`'s message to stderr and exit the process with code 1. */
function reportErrorAndExit(err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(message + "\n");
  process.exit(1);
}

async function main(): Promise<void> {
  try {
    const scenario = JSON.parse(await readStdin());
    process.stdout.write(JSON.stringify(runScenario(scenario)));
  } catch (err) {
    reportErrorAndExit(err);
  }
}

main();
