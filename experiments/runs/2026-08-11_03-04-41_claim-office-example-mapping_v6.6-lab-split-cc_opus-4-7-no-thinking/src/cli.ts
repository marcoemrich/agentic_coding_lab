import { runScenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
};

const main = async (): Promise<void> => {
  try {
    const scenario = JSON.parse(await readStdin());
    process.stdout.write(JSON.stringify(runScenario(scenario)));
  } catch (err) {
    process.stderr.write(`${(err as Error).message}\n`);
    process.exit(1);
  }
};

void main();
