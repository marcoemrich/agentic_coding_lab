import { runScenario, type Scenario } from "./claim-office.js";

/**
 * The `claim-office` executable: a JSON scenario arrives on stdin and the
 * corresponding results leave on stdout. The office's rules all live in
 * claim-office.ts; this file is only the paper tray.
 */
const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
};

/**
 * A refused scenario leaves a description on stderr and nothing on stdout: the
 * office says why it declined rather than dumping a stack at the customer. The
 * message comes from whichever rule objected — an unknown item type, a claim
 * naming goods the policy never covered, a negative damage.
 *
 * Only the deciding is guarded. Writing the results sits outside the try so a
 * failed write (EPIPE, say) is not reported as a refused scenario: the catch
 * would otherwise print a plumbing fault in the voice of a rule and exit as
 * though the customer's paperwork were at fault. Nothing is written until a
 * verdict is reached, so stdout stays empty on the refusal path either way.
 */
const decide = async (): Promise<string | undefined> => {
  try {
    const scenario = JSON.parse(await readStdin()) as Scenario;
    return JSON.stringify(runScenario(scenario));
  } catch (error) {
    const description = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${description}\n`);
    // Not process.exit: that terminates mid-flush, and the exit code is the
    // only thing that needs saying. Setting it lets stderr drain and the
    // process end of its own accord once stdin is done.
    process.exitCode = 1;
    return undefined;
  }
};

const results = await decide();
if (results !== undefined) process.stdout.write(`${results}\n`);
