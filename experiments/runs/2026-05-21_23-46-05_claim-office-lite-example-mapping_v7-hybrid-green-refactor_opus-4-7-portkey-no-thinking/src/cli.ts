import { runScenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data;
};

const main = async (): Promise<void> => {
  try {
    const input = JSON.parse(await readStdin());
    const output = runScenario(input);
    process.stdout.write(JSON.stringify(output));
  } catch (error) {
    process.stderr.write(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

void main();
