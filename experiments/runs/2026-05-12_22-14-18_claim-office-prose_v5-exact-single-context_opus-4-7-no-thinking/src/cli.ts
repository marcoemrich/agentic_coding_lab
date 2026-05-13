import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  let data = "";
  for await (const chunk of process.stdin) {
    data += chunk;
  }
  return data;
};

const main = async (): Promise<void> => {
  const input = await readStdin();
  const scenario = JSON.parse(input) as Scenario;
  const output = runScenario(scenario);
  process.stdout.write(JSON.stringify(output));
};

main().catch((err) => {
  process.stderr.write(String(err));
  process.exit(1);
});
