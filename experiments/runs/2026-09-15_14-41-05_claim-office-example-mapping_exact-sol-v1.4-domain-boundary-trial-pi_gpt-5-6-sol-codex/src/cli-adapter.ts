import { runScenario, type Scenario } from "./claim-office.js";

export interface CliExecution {
  status: number;
  stdout: string;
  stderr: string;
}

export function executeCli(input: string): CliExecution {
  try {
    const output = runScenario(JSON.parse(input) as Scenario);
    return { status: 0, stdout: JSON.stringify(output), stderr: "" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { status: 1, stdout: "", stderr: message };
  }
}
