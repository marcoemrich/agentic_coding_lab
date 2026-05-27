import { processScenario, Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const main = async (): Promise<void> => {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input) as Scenario;
    const output = processScenario(scenario);
    process.stdout.write(JSON.stringify(output));
  } catch (err) {
    process.stderr.write(
      err instanceof Error ? err.message : String(err),
    );
    process.exit(1);
  }
};

void main();
