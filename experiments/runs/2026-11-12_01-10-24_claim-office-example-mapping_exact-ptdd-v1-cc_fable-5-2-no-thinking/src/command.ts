import { processScenario, type Scenario } from "./claim-office.js";

export interface CommandOutcome {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export function execute(stdin: string): CommandOutcome {
  try {
    const scenario = JSON.parse(stdin) as Scenario;
    return { exitCode: 0, stdout: `${JSON.stringify(processScenario(scenario))}\n`, stderr: "" };
  } catch (error) {
    return { exitCode: 1, stdout: "", stderr: `${String(error)}\n` };
  }
}
