import { runScenario } from './scenario';

export interface CliOutput {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export function runCli(stdin: string): CliOutput {
  try {
    return { exitCode: 0, stdout: JSON.stringify(runScenario(JSON.parse(stdin))), stderr: '' };
  } catch (error) {
    return { exitCode: 1, stdout: '', stderr: `${(error as Error).message}\n` };
  }
}
