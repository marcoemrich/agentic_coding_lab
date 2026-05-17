import {
  quote,
  claim,
  insuranceValueFor,
  isKnownItemType,
  type Customer,
  type Item,
  type Policy,
  type Incident,
  type QuoteResult,
  type ClaimResult,
} from "./claim-office.js";

const CAP_MULTIPLIER = 2;

type QuoteStep = {
  op: "quote";
  items: Item[];
};

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: Incident;
};

type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: Customer;
  steps: Step[];
};

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const policyCapFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + CAP_MULTIPLIER * insuranceValueFor(item), 0);

const validateQuoteItems = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
};

const validateClaimDamages = (policy: Policy, damages: Incident["damages"]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) throw new Error(`Damage amount cannot be negative: ${negative.amount}`);
  const uncovered = damages.find(
    (damage) => !policy.items.some((item) => item.type === damage.itemType),
  );
  if (uncovered) throw new Error(`Damage references item not in policy: ${uncovered.itemType}`);
};

type StepResult = QuoteResult | ClaimResult;

const handleQuote = (
  customer: Customer,
  step: QuoteStep,
  policies: Policy[],
): QuoteResult => {
  validateQuoteItems(step.items);
  policies.push({ items: step.items, remainingCap: policyCapFor(step.items) });
  return quote({ customer, items: step.items });
};

const handleClaim = (step: ClaimStep, policies: Policy[]): ClaimResult => {
  const policy = policies[step.policy];
  validateClaimDamages(policy, step.incident.damages);
  const result = claim({ policy, incident: step.incident });
  policy.remainingCap = result.remainingCap;
  return result;
};

const runStep = (
  customer: Customer,
  step: Step,
  policies: Policy[],
): StepResult =>
  step.op === "quote"
    ? handleQuote(customer, step, policies)
    : handleClaim(step, policies);

const runScenario = (scenario: Scenario): StepResult[] => {
  const policies: Policy[] = [];
  return scenario.steps.map((step) => runStep(scenario.customer, step, policies));
};

const main = async () => {
  const input = await readStdin();
  const scenario: Scenario = JSON.parse(input);
  const results = runScenario(scenario);
  process.stdout.write(JSON.stringify({ results }));
};

main().catch((err) => {
  process.stderr.write(String(err));
  process.exit(1);
});
