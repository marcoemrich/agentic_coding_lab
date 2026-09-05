import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  process.stdin.setEncoding("utf8");
  let text = "";
  for await (const chunk of process.stdin) {
    text += chunk;
  }
  return text;
};

const reportScenarioResults = async (): Promise<void> => {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
};

/** Callers get the description of what went wrong, not the stack trace that led there. */
const description = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const FAILURE = 1;

try {
  await reportScenarioResults();
} catch (error) {
  process.stderr.write(`${description(error)}\n`);
  process.exit(FAILURE);
}
