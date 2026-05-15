import { runScenario, KNOWN_ITEM_TYPES } from "./claim-office.js";

type Item = { type: string };
type Damage = { itemType: string; amount: number };
type Incident = { damages: Damage[] };
type Step = { op: string; items?: Item[]; policy?: number; incident?: Incident };
type Scenario = { steps: Step[] };

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
};

const fail = (message: string): never => {
  process.stderr.write(`${message}\n`);
  process.exit(1);
};

const countByKey = <T>(items: T[], key: (item: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) counts[key(item)] = (counts[key(item)] ?? 0) + 1;
  return counts;
};

const quotedItems = (scenario: Scenario): Item[] =>
  scenario.steps.filter((step) => step.op === "quote").flatMap((step) => step.items ?? []);

const policyItemsFor = (scenario: Scenario, step: Step): Item[] =>
  step.policy !== undefined ? scenario.steps[step.policy]?.items ?? [] : [];

const validateQuotes = (scenario: Scenario): string | undefined => {
  const unknown = quotedItems(scenario).find((item) => !KNOWN_ITEM_TYPES.has(item.type));
  return unknown ? `Unknown item type: ${unknown.type}` : undefined;
};

const validateClaim = (scenario: Scenario, step: Step): string | undefined => {
  const policyItems = policyItemsFor(scenario, step);
  const damages = step.incident?.damages ?? [];

  const uninsured = damages.find(
    (damage) => !policyItems.some((item) => item.type === damage.itemType),
  );
  if (uninsured) return `Damage references item not in policy: ${uninsured.itemType}`;

  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) return `Damage amount must be non-negative: ${negative.amount}`;

  const insuredCounts = countByKey(policyItems, (item) => item.type);
  const damageCounts = countByKey(damages, (damage) => damage.itemType);
  const excessType = Object.keys(damageCounts).find(
    (type) => damageCounts[type] > (insuredCounts[type] ?? 0),
  );
  if (excessType) return `More damages of type "${excessType}" than insured items`;

  return undefined;
};

const validateScenario = (scenario: Scenario): string | undefined => {
  const quoteError = validateQuotes(scenario);
  if (quoteError) return quoteError;

  for (const step of scenario.steps) {
    if (step.op !== "claim") continue;
    const claimError = validateClaim(scenario, step);
    if (claimError) return claimError;
  }
  return undefined;
};

const main = async (): Promise<void> => {
  const scenario = JSON.parse(await readStdin());

  const error = validateScenario(scenario);
  if (error) fail(error);

  process.stdout.write(JSON.stringify(runScenario(scenario)) + "\n");
};

main().catch((err: Error) => fail(`Error: ${err.message}`));
