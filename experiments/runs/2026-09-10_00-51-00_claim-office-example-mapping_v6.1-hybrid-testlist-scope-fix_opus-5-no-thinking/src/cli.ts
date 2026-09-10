import { runScenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: string[] = [];
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    chunks.push(chunk as string);
  }
  return chunks.join("");
};

// The scenario arrives as untyped JSON on stdin; runScenario is what gives it
// meaning, so the parsed value is only ever handed straight to it.
const readScenario = async (): Promise<Parameters<typeof runScenario>[0]> =>
  JSON.parse(await readStdin());

const writeResults = (results: ReturnType<typeof runScenario>): void => {
  process.stdout.write(JSON.stringify(results));
};

const REJECTED_EXIT_CODE = 1;

// The MHPCO rejects a whole scenario it cannot process: nothing is written to
// stdout, only a description of the objection to stderr.
const reject = (reason: unknown): void => {
  process.stderr.write(`${reason instanceof Error ? reason.message : reason}\n`);
  process.exitCode = REJECTED_EXIT_CODE;
};

try {
  writeResults(runScenario(await readScenario()));
} catch (reason) {
  reject(reason);
}
