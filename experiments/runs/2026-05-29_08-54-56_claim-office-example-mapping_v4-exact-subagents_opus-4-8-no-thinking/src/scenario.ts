import { quote, claim, type Item, type Incident } from "./claim-office.js";

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: Incident;
};

export type ScenarioStep = QuoteStep | ClaimStep;

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: ScenarioStep[];
};

export type StepResult = {
  premium?: number;
  payout?: number;
  remainingCap?: number;
};

export type ScenarioResult = {
  results: StepResult[];
};

// Tracks how much cap each policy (keyed by its quote step index) has left
// after the claims processed so far. Successive claims on the same policy
// draw the next claim down from this remaining cap.
type RemainingCapByPolicy = Map<number, number>;

const isQuoteStep = (step: ScenarioStep): step is QuoteStep => step.op === "quote";

const runQuoteStep = (
  step: QuoteStep,
  priorSteps: ScenarioStep[],
  yearsWithMHPCO: number
): StepResult => {
  const isFollowUp = priorSteps.some(isQuoteStep);
  return { premium: quote(step.items, { yearsWithMHPCO, isFollowUp }) };
};

const runClaimStep = (
  step: ClaimStep,
  steps: ScenarioStep[],
  remainingCapByPolicy: RemainingCapByPolicy
): StepResult => {
  const policyStep = steps[step.policy];
  if (!isQuoteStep(policyStep)) {
    throw new Error(`Claim policy index ${step.policy} does not reference a quote step`);
  }
  const priorCap = remainingCapByPolicy.get(step.policy);
  const result =
    priorCap === undefined
      ? claim(policyStep.items, step.incident)
      : claim(policyStep.items, step.incident, priorCap);
  remainingCapByPolicy.set(step.policy, result.remainingCap);
  return result;
};

export function runScenario(scenario: Scenario): ScenarioResult {
  const { yearsWithMHPCO } = scenario.customer;
  const { steps } = scenario;
  const remainingCapByPolicy: RemainingCapByPolicy = new Map();
  const results = steps.map((step, index): StepResult =>
    isQuoteStep(step)
      ? runQuoteStep(step, steps.slice(0, index), yearsWithMHPCO)
      : runClaimStep(step, steps, remainingCapByPolicy)
  );
  return { results };
}
