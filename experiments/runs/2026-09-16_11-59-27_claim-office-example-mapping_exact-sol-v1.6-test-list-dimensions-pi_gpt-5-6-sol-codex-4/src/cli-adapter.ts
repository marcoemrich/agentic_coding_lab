import { processScenario, type Scenario } from "./claim-office.js";

export interface CliResult {
  status: number;
  stdout: string;
  stderr: string;
}

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const runCli = (input: string): CliResult => {
  try {
    return {
      status: 0,
      stdout: JSON.stringify(processScenario(JSON.parse(input) as Scenario)),
      stderr: "",
    };
  } catch (error) {
    return { status: 1, stdout: "", stderr: errorMessage(error) };
  }
};
