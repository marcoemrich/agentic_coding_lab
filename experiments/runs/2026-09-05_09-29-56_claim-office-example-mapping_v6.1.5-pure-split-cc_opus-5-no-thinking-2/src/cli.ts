import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  let input = "";

  process.stdin.setEncoding("utf8");

  for await (const chunk of process.stdin) input += chunk;

  return input;
};

// The CLI is a text-in/text-out shell around the engine: a scenario document
// arrives as JSON on stdin and its results leave as JSON on stdout.
const runScenarioDocument = (scenarioDocument: string): string =>
  JSON.stringify(runScenario(JSON.parse(scenarioDocument) as Scenario));

// A rejected scenario is reported as a plain message, not a crash: nothing
// reaches stdout and the exit status marks the refusal.
try {
  process.stdout.write(runScenarioDocument(await readStdin()));
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exitCode = 1;
}
