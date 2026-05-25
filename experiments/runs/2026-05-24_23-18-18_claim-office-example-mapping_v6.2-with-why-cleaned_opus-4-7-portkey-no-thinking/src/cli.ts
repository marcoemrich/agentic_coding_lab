import { runScenario, isKnownItemType, type Item, type Scenario, type Step } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const quotedItems = (steps: Step[]): Item[] =>
  steps.flatMap((step) => (step.op === "quote" ? step.items : []));

const claimDamages = (steps: Step[]) =>
  steps.flatMap((step) => (step.op === "claim" ? step.incident.damages : []));

const rejectInvalid = <T>(
  values: T[],
  isInvalid: (value: T) => boolean,
  messageFor: (value: T) => string,
): void => {
  const offender = values.find(isInvalid);
  if (offender !== undefined) {
    throw new Error(messageFor(offender));
  }
};

const validateScenario = (scenario: Scenario): void => {
  rejectInvalid(
    quotedItems(scenario.steps),
    (item) => !isKnownItemType(item.type),
    (item) => `unknown item type: '${item.type}'`,
  );
  rejectInvalid(
    claimDamages(scenario.steps),
    (damage) => damage.amount < 0,
    (damage) => `damage amount must be non-negative, got ${damage.amount}`,
  );
};

const main = async (): Promise<void> => {
  const input = await readStdin();
  const scenario = JSON.parse(input) as Scenario;
  validateScenario(scenario);
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result));
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
