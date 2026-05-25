import { runScenario, type Scenario } from './claim-office.js';

export interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export function runCli(input: string): CliResult {
  try {
    const scenario = JSON.parse(input) as Scenario;
    const out = runScenario(scenario);
    return { stdout: JSON.stringify(out), stderr: '', exitCode: 0 };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { stdout: '', stderr: msg + '\n', exitCode: 1 };
  }
}

const isMain = (() => {
  try {
    return import.meta.url === `file://${process.argv[1]}`;
  } catch {
    return false;
  }
})();

if (isMain) {
  const chunks: Buffer[] = [];
  process.stdin.on('data', c => chunks.push(c));
  process.stdin.on('end', () => {
    const input = Buffer.concat(chunks).toString('utf-8');
    const result = runCli(input);
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    process.exit(result.exitCode);
  });
}
