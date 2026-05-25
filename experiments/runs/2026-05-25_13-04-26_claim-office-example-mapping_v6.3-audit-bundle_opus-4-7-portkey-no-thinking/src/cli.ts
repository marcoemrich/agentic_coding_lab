import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  let data = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    data += chunk;
  }
  return data;
};

const main = async (): Promise<void> => {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input) as Scenario;
    const result = runScenario(scenario);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(message + "\n");
    process.exit(1);
  }
};

main();
