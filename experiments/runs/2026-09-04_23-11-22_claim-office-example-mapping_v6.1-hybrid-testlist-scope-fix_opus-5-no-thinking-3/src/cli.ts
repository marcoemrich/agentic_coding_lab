import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  let input = "";

  for await (const chunk of process.stdin) {
    input += chunk;
  }

  return input;
};

// `JSON.parse` yields `any`, which would silently erase the `Scenario` contract
// at the very boundary where untrusted input arrives. Naming the parsed value
// `unknown` keeps that gap visible: nothing here has checked the scenario yet,
// and the cast below is where the MHPCO takes it on trust.
const parsedScenario = (input: string): unknown => JSON.parse(input);

const main = async (): Promise<void> => {
  const scenario = parsedScenario(await readStdin()) as Scenario;

  process.stdout.write(JSON.stringify(runScenario(scenario)));
};

// The MHPCO reports a refusal as a plain description of what it objected to,
// and writes no results at all when it cannot process the scenario.
await main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
  process.exitCode = 1;
});
