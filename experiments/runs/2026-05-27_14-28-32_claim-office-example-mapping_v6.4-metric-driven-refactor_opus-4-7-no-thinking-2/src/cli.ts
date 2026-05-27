import { processScenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf-8");
};

const formatError = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);

const main = async (): Promise<void> => {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input);
    const result = processScenario(scenario);
    process.stdout.write(JSON.stringify(result));
  } catch (err) {
    process.stderr.write(formatError(err));
    process.exit(1);
  }
};

void main();
