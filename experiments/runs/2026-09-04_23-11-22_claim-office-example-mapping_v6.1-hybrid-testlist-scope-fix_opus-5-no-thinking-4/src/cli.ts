import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

// The CLI's input contract: one JSON-encoded Scenario on stdin.
const readScenario = async (): Promise<Scenario> =>
  JSON.parse(await readStdin()) as Scenario;

// A rejected scenario produces an error description on stderr and a non-zero
// exit status — never a partial `results` document on stdout. Nothing is
// written until the whole document exists, so a rejection part-way through a
// scenario cannot leave earlier steps' results already on the wire.
const main = async (): Promise<void> => {
  let report: string;
  try {
    report = JSON.stringify(runScenario(await readScenario()));
  } catch (error) {
    process.stderr.write(`${(error as Error).message}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(report);
};

await main();
