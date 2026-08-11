import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: string[] = [];

  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    chunks.push(chunk as string);
  }

  return chunks.join("");
};

const resultJsonFor = (scenarioJson: string): string =>
  JSON.stringify(runScenario(JSON.parse(scenarioJson) as Scenario));

const FAILURE_EXIT_CODE = 1;

try {
  process.stdout.write(resultJsonFor(await readStdin()));
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(FAILURE_EXIT_CODE);
}
