import {
  runScenario,
  type Scenario,
  type ScenarioResults,
} from "./claim-office.js";

/** The scenario arrives as one JSON document, so stdin is read to the end. */
const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }

  return Buffer.concat(chunks).toString("utf8");
};

const readScenario = async (): Promise<Scenario> =>
  JSON.parse(await readStdin()) as Scenario;

const writeResults = (results: ScenarioResults): void => {
  process.stdout.write(JSON.stringify(results));
};

/** Anything thrown is described by its message; a stack trace is not an answer. */
const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

/** A scenario the MHPCO refuses is reported to stderr; stdout stays empty. */
const reportFailure = (error: unknown): never => {
  process.stderr.write(`${errorMessage(error)}\n`);
  process.exit(1);
};

try {
  writeResults(runScenario(await readScenario()));
} catch (error) {
  reportFailure(error);
}
