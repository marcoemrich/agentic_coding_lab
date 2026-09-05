import {
  runScenario,
  type Scenario,
  type ScenarioResult,
} from "./claim-office.js";

// stdin arrives in chunks of arbitrary size, so the whole scenario is
// collected before parsing rather than parsed incrementally.
const readAllStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const parseScenario = (input: string): Scenario => JSON.parse(input) as Scenario;

const writeResults = (result: ScenarioResult): void => {
  process.stdout.write(JSON.stringify(result));
};

const main = async (): Promise<void> => {
  writeResults(runScenario(parseScenario(await readAllStdin())));
};

try {
  await main();
} catch (error) {
  // The MHPCO rejects the whole scenario: a description on stderr, nothing
  // on stdout, and a non-zero exit code.
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(1);
}
