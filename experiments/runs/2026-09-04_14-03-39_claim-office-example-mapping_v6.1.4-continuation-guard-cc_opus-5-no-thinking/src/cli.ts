import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  let input = "";

  process.stdin.setEncoding("utf8");

  for await (const chunk of process.stdin) {
    input += chunk;
  }

  return input;
};

// The CLI's contract on the happy path: a scenario in on stdin, its results
// out on stdout. Everything that can go wrong throws — reporting a failure is
// the caller's job, not this function's, so the success path reads straight
// through without being interleaved with error handling.
const runScenarioFromStdin = async (): Promise<void> => {
  const scenario = JSON.parse(await readStdin()) as Scenario;

  process.stdout.write(JSON.stringify(runScenario(scenario)));
};

try {
  await runScenarioFromStdin();
} catch (error) {
  // A rejected scenario is a described failure, not a crash. `exitCode` rather
  // than `exit(1)` so the pending stderr write flushes before the process ends.
  const description = error instanceof Error ? error.message : String(error);

  process.stderr.write(`${description}\n`);
  process.exitCode = 1;
}
