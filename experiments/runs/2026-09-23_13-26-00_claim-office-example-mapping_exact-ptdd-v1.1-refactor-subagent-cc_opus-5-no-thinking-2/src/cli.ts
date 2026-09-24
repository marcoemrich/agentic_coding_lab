import { runScenario, type Scenario } from "./scenario.js";

/** Reads the scenario document the customer submits on stdin. */
async function readScenarioDocument(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

const REFUSED_EXIT_CODE = 1;

/**
 * The MHPCO's counter: it takes a scenario on stdin and returns its results on
 * stdout. When the office refuses the scenario it writes the reason to stderr
 * and reports a non-zero status instead of any results. Only the translation
 * between the office's books and this channel lives here; what a scenario means
 * is the business of the scenario module.
 */
async function main(): Promise<void> {
  try {
    const scenario = JSON.parse(await readScenarioDocument()) as Scenario;
    process.stdout.write(JSON.stringify(runScenario(scenario)));
  } catch (refusal) {
    process.stderr.write(`${(refusal as Error).message}\n`);
    process.exitCode = REFUSED_EXIT_CODE;
  }
}

await main();
