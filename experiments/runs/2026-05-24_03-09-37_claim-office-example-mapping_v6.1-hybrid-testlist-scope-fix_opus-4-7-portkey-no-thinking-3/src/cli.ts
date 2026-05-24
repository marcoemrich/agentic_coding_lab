import { processScenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  let data = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) data += chunk;
  return data;
};

const main = async (): Promise<void> => {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input);
    const output = processScenario(scenario);
    process.stdout.write(JSON.stringify(output));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`${msg}\n`);
    process.exit(1);
  }
};

void main();
