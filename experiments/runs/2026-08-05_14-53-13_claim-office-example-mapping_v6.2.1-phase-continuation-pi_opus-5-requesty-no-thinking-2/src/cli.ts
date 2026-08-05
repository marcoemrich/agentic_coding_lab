import { text } from "node:stream/consumers";
import { runScenario, type Scenario } from "./claim-office.js";

const REJECTED_SCENARIO_EXIT_CODE = 1;

const scenarioResultsFromStdin = async (): Promise<string> => {
  const scenario = JSON.parse(await text(process.stdin)) as Scenario;
  return JSON.stringify(runScenario(scenario));
};

const descriptionOf = (rejection: unknown): string =>
  rejection instanceof Error ? rejection.message : String(rejection);

const reportRejectionToStderr = (rejection: unknown): void => {
  process.stderr.write(`${descriptionOf(rejection)}\n`);
  process.exitCode = REJECTED_SCENARIO_EXIT_CODE;
};

try {
  process.stdout.write(await scenarioResultsFromStdin());
} catch (rejection) {
  reportRejectionToStderr(rejection);
}
