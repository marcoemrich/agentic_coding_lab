#!/usr/bin/env node
import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf8");
};

const main = async (): Promise<void> => {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
};

// Any rejection — malformed JSON or a claim the office refuses — is reported on
// stderr with a non-zero exit, leaving stdout empty.
main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
