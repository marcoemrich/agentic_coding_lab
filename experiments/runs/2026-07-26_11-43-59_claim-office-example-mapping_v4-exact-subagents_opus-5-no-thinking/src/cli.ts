#!/usr/bin/env tsx
import { pathToFileURL } from "node:url";
import { runScenario, type Scenario } from "./claim-office.js";

export interface CliOutcome {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

const messageOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const runCli = (inputJson: string): CliOutcome => {
  try {
    const scenario = JSON.parse(inputJson) as Scenario;
    return {
      exitCode: 0,
      stdout: JSON.stringify(runScenario(scenario)),
      stderr: "",
    };
  } catch (error) {
    return { exitCode: 1, stdout: "", stderr: messageOf(error) };
  }
};

// --- I/O edge: untested by design, kept as thin as possible ---

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
};

const main = async (): Promise<void> => {
  const outcome = runCli(await readStdin());
  if (outcome.stdout !== "") process.stdout.write(`${outcome.stdout}\n`);
  if (outcome.stderr !== "") process.stderr.write(`${outcome.stderr}\n`);
  process.exitCode = outcome.exitCode;
};

const entryPoint = process.argv[1];
const executedDirectly =
  entryPoint !== undefined && import.meta.url === pathToFileURL(entryPoint).href;

if (executedDirectly) await main();
