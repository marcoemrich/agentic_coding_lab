import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
};

// MHPCO reports refusals as a plain reason, never a stack trace.
const reasonOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const scenarioJson = await readStdin();

try {
  const scenario = JSON.parse(scenarioJson) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`${reasonOf(error)}\n`);
  process.exit(1);
}
