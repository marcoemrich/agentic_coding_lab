import { run, BASE_PREMIUMS } from "./claim-office.js";

type Item = { type: string };
type Damage = { itemType: string; amount: number };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: { damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { steps: Step[] };

const isKnownItemType = (type: string): boolean => type in BASE_PREMIUMS;

const failWith = (message: string): never => {
  console.error(message);
  process.exit(1);
};

const validateQuote = (step: QuoteStep): void => {
  for (const item of step.items) {
    if (!isKnownItemType(item.type)) {
      failWith(`unknown item type: ${item.type}`);
    }
  }
};

const countByType = <T extends { [k: string]: unknown }>(items: T[], key: keyof T): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = item[key] as string;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
};

const validateDamage = (damage: Damage): void => {
  if (damage.amount < 0) {
    failWith(`negative damage amount: ${damage.amount}`);
  }
};

const validateClaim = (step: ClaimStep, scenario: Scenario): void => {
  const policyStep = scenario.steps[step.policy] as QuoteStep;
  const remainingByType = countByType(policyStep.items, "type");
  for (const damage of step.incident.damages) {
    validateDamage(damage);
    const remaining = remainingByType.get(damage.itemType) ?? 0;
    if (remaining <= 0) {
      failWith(`more damages of type ${damage.itemType} than policy covers`);
    }
    remainingByType.set(damage.itemType, remaining - 1);
  }
};

const validateScenario = (scenario: Scenario): void => {
  for (const step of scenario.steps) {
    if (step.op === "quote") validateQuote(step);
    else if (step.op === "claim") validateClaim(step, scenario);
  }
};

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const main = async (): Promise<void> => {
  const scenario = JSON.parse(await readStdin()) as Scenario;
  validateScenario(scenario);
  console.log(JSON.stringify(run(scenario)));
};

main();
