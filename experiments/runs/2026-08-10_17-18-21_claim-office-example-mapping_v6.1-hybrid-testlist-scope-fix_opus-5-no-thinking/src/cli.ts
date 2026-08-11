import {
  runScenario,
  type Scenario,
  type ScenarioResult,
} from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  let input = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) input += chunk;
  return input;
};

const EXIT_FAILURE = 1;

/**
 * A scenario we cannot answer is reported as a one-line description on stderr;
 * the stack trace is of no use to whoever piped the JSON in, and stdout stays
 * empty so that no partial result can be mistaken for an answer. Only the
 * parsing and the run are guarded, so that a failure to write the answer is
 * never mistaken for a failure to compute it.
 */
const main = async (): Promise<void> => {
  const scenarioJson = await readStdin();

  let result: ScenarioResult;
  try {
    result = runScenario(JSON.parse(scenarioJson) as Scenario);
  } catch (error) {
    process.stderr.write(`${(error as Error).message}\n`);
    process.exitCode = EXIT_FAILURE;
    return;
  }

  process.stdout.write(JSON.stringify(result));
};

await main();
