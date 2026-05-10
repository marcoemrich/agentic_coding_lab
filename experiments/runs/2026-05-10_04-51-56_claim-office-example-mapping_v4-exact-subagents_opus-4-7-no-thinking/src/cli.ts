import { readFileSync } from "node:fs";
import { quote, claim, cap, isKnownItemType, type Item, type Damage, type Incident } from "./claim-office.js";

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

type Policy = { items: Item[]; remainingCap: number };
type StepResult = Record<string, number>;

type ScenarioState = {
  customer: { yearsWithMHPCO: number };
  policies: Policy[];
  previousContracts: number;
};

const exitWithError = (message: string): never => {
  process.stderr.write(`error: ${message}\n`);
  process.exit(1);
};

const countByType = <T extends { type: string }>(items: T[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

type ClaimValidator = (policy: Policy, damages: Damage[]) => string | undefined;

const negativeAmountError: ClaimValidator = (_policy, damages) => {
  const negative = damages.find((damage) => damage.amount < 0);
  return negative && `damage amount cannot be negative (${negative.amount})`;
};

const unknownDamageTypeError: ClaimValidator = (policy, damages) => {
  const policyTypes = new Set(policy.items.map((item) => item.type));
  const unknown = damages.find((damage) => !policyTypes.has(damage.itemType));
  return unknown && `damage itemType "${unknown.itemType}" not in policy`;
};

const excessDamageError: ClaimValidator = (policy, damages) => {
  const policyCounts = countByType(policy.items);
  const damageCounts = countByType(damages.map((d) => ({ type: d.itemType })));
  for (const [type, count] of damageCounts) {
    if (count > (policyCounts.get(type) ?? 0)) {
      return `more damages of type "${type}" than insured`;
    }
  }
  return undefined;
};

const claimValidators: ClaimValidator[] = [
  negativeAmountError,
  unknownDamageTypeError,
  excessDamageError,
];

const validateClaim = (policy: Policy, damages: Damage[]): void => {
  for (const validate of claimValidators) {
    const error = validate(policy, damages);
    if (error !== undefined) exitWithError(error);
  }
};

const handleQuoteStep = (state: ScenarioState, step: QuoteStep): StepResult => {
  const premium = quote({
    customer: {
      yearsWithMHPCO: state.customer.yearsWithMHPCO,
      previousContracts: state.previousContracts,
    },
    items: step.items,
  });
  state.policies.push({ items: step.items, remainingCap: cap(step.items) });
  state.previousContracts += 1;
  return { premium };
};

const handleClaimStep = (state: ScenarioState, step: ClaimStep): StepResult => {
  const policy = state.policies[step.policy];
  validateClaim(policy, step.incident.damages);
  const result = claim({ policy, incident: step.incident });
  policy.remainingCap = result.remainingCap;
  return { payout: result.payout, remainingCap: result.remainingCap };
};

const processStep = (state: ScenarioState, step: Step): StepResult =>
  step.op === "quote" ? handleQuoteStep(state, step) : handleClaimStep(state, step);

const runScenario = (scenario: Scenario): StepResult[] => {
  const state: ScenarioState = {
    customer: scenario.customer,
    policies: [],
    previousContracts: 0,
  };
  return scenario.steps.map((step) => processStep(state, step));
};

const findUnknownItemType = (scenario: Scenario): string | undefined => {
  for (const step of scenario.steps) {
    if (step.op !== "quote") continue;
    for (const item of step.items) {
      if (!isKnownItemType(item.type)) return item.type;
    }
  }
  return undefined;
};

const validateScenario = (scenario: Scenario): void => {
  const unknownType = findUnknownItemType(scenario);
  if (unknownType !== undefined) exitWithError(`unknown item type "${unknownType}"`);
};

const scenario: Scenario = JSON.parse(readFileSync(0, "utf-8"));
validateScenario(scenario);
process.stdout.write(JSON.stringify({ results: runScenario(scenario) }));
