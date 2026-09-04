import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: string[] = [];
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) chunks.push(chunk);
  return chunks.join("");
};

try {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  // The results are computed in full before anything is written, so a
  // rejected scenario leaves stdout empty rather than half-written.
  const results = JSON.stringify(runScenario(scenario));
  process.stdout.write(results);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
