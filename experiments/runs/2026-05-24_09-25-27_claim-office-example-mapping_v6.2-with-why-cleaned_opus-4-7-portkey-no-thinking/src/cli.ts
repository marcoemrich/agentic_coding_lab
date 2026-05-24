import { runScenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf-8");
};

const main = async (): Promise<void> => {
  const input = await readStdin();
  const scenario = JSON.parse(input);
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output));
};

main().catch((err: unknown) => {
  process.stderr.write(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
