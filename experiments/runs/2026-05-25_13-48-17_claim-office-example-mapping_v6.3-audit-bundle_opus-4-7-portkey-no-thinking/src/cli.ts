import { runScenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const main = async (): Promise<void> => {
  const input = await readStdin();
  const scenario = JSON.parse(input);
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output));
};

main().catch((err) => {
  process.stderr.write(String(err instanceof Error ? err.message : err) + "\n");
  process.exit(1);
});
