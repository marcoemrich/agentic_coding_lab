import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }

  return Buffer.concat(chunks).toString("utf8");
};

// A thrown value need not be an Error: a malformed-JSON SyntaxError is, but a
// `throw "..."` from anywhere would not be, and stringifying it beats printing
// "undefined" for its .message.
const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

// The scenario is computed in full before anything is written, so a rejected
// scenario leaves stdout empty rather than half-written.
const main = async (): Promise<void> => {
  const scenario = JSON.parse(await readStdin()) as Scenario;

  process.stdout.write(JSON.stringify(runScenario(scenario)));
};

main().catch((error: unknown) => {
  process.stderr.write(`${errorMessage(error)}\n`);
  process.exitCode = 1;
});
