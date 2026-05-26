import { runScenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const main = async (): Promise<void> => {
  const raw = await readStdin();
  const input: unknown = JSON.parse(raw);
  const output = runScenario(input);
  process.stdout.write(JSON.stringify(output) + "\n");
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(message + "\n");
  process.exit(1);
});
