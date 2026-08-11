import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  let input = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) input += chunk;
  return input;
};

try {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
