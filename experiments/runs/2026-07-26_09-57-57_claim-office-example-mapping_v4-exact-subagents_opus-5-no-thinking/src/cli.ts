// Entry point for the scenario CLI. Reads a scenario JSON from stdin, writes
// results to stdout, and reports rejections on stderr with a non-zero status.
import type { Scenario } from "./scenario.js";
import { runScenario } from "./scenario.js";

const readStdin = async (): Promise<string> => {
  const chunks: string[] = [];
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    chunks.push(chunk as string);
  }
  return chunks.join("");
};

// The success path, start to finish. It is named for the work it does rather
// than for being the entry point, so that the try/catch below reads as the one
// thing it adds: a rejected scenario is a failed run, not an empty one.
const runScenarioFromStdin = async (): Promise<void> => {
  const input = await readStdin();
  const scenario = JSON.parse(input) as Scenario;
  const results = runScenario(scenario);
  process.stdout.write(`${JSON.stringify({ results })}\n`);
};

try {
  await runScenarioFromStdin();
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exitCode = 1;
}
