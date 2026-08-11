import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);

  return Buffer.concat(chunks).toString("utf8");
};

const REJECTED = 1;

try {
  const scenario = JSON.parse(await readStdin()) as Scenario;

  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(REJECTED);
}
