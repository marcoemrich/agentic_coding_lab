import { runScenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  process.stdin.setEncoding("utf8");
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input;
};

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const main = async (): Promise<void> => {
  const scenario = JSON.parse(await readStdin());
  process.stdout.write(JSON.stringify(runScenario(scenario)));
};

main().catch((error) => {
  process.stderr.write(errorMessage(error));
  process.exitCode = 1;
});
