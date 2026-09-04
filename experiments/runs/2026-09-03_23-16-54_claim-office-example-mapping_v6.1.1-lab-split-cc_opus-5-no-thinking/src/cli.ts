import { ClaimOfficeError, runScenario, type Scenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);

  return Buffer.concat(chunks).toString("utf8");
};

const scenario = JSON.parse(await readStdin()) as Scenario;

/**
 * The single stdout write sits inside the try deliberately: nothing is written
 * at all unless the whole scenario ran, so a rejected scenario cannot leave
 * partial results on stdout ahead of the message on stderr.
 */
try {
  process.stdout.write(`${JSON.stringify(runScenario(scenario))}\n`);
} catch (error) {
  /**
   * A scenario the office declines is reported plainly. Any other failure is a
   * defect rather than a verdict on the scenario, so it is left to surface with
   * its stack trace intact.
   */
  if (!(error instanceof ClaimOfficeError)) throw error;

  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
