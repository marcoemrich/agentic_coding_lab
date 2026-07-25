import { processScenario, type Scenario } from "./claim-office.js";

export type CliResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
};

const errorResult = (stderr: string): CliResult => ({
  exitCode: 1,
  stdout: "",
  stderr,
});

export const runCli = (input: string): CliResult => {
  let parsed: Scenario;
  try {
    parsed = JSON.parse(input) as Scenario;
  } catch (err) {
    return errorResult(`Invalid JSON: ${(err as Error).message}`);
  }

  try {
    const result = processScenario(parsed);
    return {
      exitCode: 0,
      stdout: JSON.stringify({ results: result.results }),
      stderr: "",
    };
  } catch (err) {
    return errorResult((err as Error).message);
  }
};
