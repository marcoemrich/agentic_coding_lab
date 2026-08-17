import { runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
};

const describe = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

/**
 * A rejected scenario yields no results at all, so the whole scenario is settled
 * before anything reaches stdout: settling throws on invalid input, and the throw
 * has to beat the first write.
 */
const settleScenarioFromStdin = async (): Promise<void> => {
  try {
    const scenario = JSON.parse(await readStdin()) as Scenario;
    const settled = JSON.stringify(runScenario(scenario));
    process.stdout.write(settled);
  } catch (error) {
    process.stderr.write(`${describe(error)}\n`);
    process.exitCode = 1;
  }
};

await settleScenarioFromStdin();
