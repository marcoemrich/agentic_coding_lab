import { runScenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Array<Buffer> = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const main = async (): Promise<void> => {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input);
    const result = runScenario(scenario);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exit(1);
  }
};

main();
