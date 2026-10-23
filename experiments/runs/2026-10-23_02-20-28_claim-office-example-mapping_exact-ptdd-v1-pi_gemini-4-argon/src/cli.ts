import { readFileSync } from "node:fs";
import { processScenario, type Scenario } from "./claim-office.js";

export function runCli(
  input: string,
  writeStdout: (text: string) => void,
  writeStderr: (text: string) => void,
): number {
  try {
    const scenario = JSON.parse(input) as Scenario;
    const output = processScenario(scenario);
    writeStdout(`${JSON.stringify(output)}\n`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeStderr(`${message}\n`);
    return 1;
  }
}

/* c8 ignore start */
if (process.argv[1]?.includes("cli.")) {
  process.exitCode = runCli(
    readFileSync(0, "utf8"),
    (text) => process.stdout.write(text),
    (text) => process.stderr.write(text),
  );
}
/* c8 ignore stop */
