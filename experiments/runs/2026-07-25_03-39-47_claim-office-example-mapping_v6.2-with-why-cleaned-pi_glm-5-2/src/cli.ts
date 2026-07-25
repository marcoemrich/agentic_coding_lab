import { fileURLToPath } from "node:url";
import { executeScenario, type Scenario } from "./scenario.js";

export type CliOutput = { stdout: string; stderr: string; exit: number };

export const runCli = (input: string): CliOutput => {
  try {
    const scenario = JSON.parse(input) as Scenario;
    const results = executeScenario(scenario);
    return { stdout: JSON.stringify({ results }), stderr: "", exit: 0 };
  } catch (error) {
    return { stdout: "", stderr: toErrorMessage(error), exit: 1 };
  }
};

const toErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const run = async (): Promise<void> => {
  const output = runCli(await readStdin());
  if (output.stdout) {
    process.stdout.write(output.stdout);
  }
  if (output.stderr) {
    process.stderr.write(output.stderr);
  }
  process.exit(output.exit);
};

const isMainEntry = (): boolean => {
  const entry = process.argv[1];
  return entry !== undefined && fileURLToPath(import.meta.url) === entry;
};

if (isMainEntry()) {
  void run();
}
