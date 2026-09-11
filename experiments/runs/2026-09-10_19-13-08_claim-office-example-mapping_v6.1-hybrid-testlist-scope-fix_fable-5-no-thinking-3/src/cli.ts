import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input;
};

const main = async (): Promise<void> => {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  try {
    process.stdout.write(JSON.stringify(runScenario(scenario)) + "\n");
  } catch (error) {
    process.stderr.write(`${(error as Error).message}\n`);
    process.exitCode = 1;
  }
};

main();
