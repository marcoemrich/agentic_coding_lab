import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }

  return Buffer.concat(chunks).toString("utf8");
};

// The CLI is a thin transport shell around runScenario: read a scenario from
// stdin, run it, write the result to stdout. All domain rules live in
// claim-office.ts, so this file should stay free of them.
// A rejected scenario reports the reason on stderr and exits non-zero, leaving
// stdout empty — a caller parsing stdout must never see partial results.
try {
  const scenario = JSON.parse(await readStdin()) as Scenario;

  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(1);
}
