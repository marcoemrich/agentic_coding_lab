import { readFileSync } from "node:fs";
import { argv, exit, stderr, stdout } from "node:process";
import { processScenario, type Scenario } from "./claim-office.js";

export interface CliIo {
  writeStdout: (text: string) => void;
  writeStderr: (text: string) => void;
}

function formatCliError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function runCli(rawInput: string, io: CliIo): number {
  try {
    const scenario = JSON.parse(rawInput) as Scenario;
    const output = processScenario(scenario);
    io.writeStdout(`${JSON.stringify(output)}\n`);
    return 0;
  } catch (error) {
    io.writeStderr(`${formatCliError(error)}\n`);
    return 1;
  }
}

export function isCliEntryScript(scriptPath: string | undefined): boolean {
  const normalized = scriptPath ?? "";
  return normalized.endsWith("cli.ts") || normalized.endsWith("cli.js");
}

if (isCliEntryScript(argv[1])) {
  const code = runCli(readFileSync(0, "utf8"), {
    writeStdout: (text) => stdout.write(text),
    writeStderr: (text) => stderr.write(text),
  });
  exit(code);
}
