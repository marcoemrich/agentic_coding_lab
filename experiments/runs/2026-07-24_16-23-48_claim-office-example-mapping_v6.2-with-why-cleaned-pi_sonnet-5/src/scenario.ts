import type { Item } from "./catalog.js";
import { computeQuotePremium } from "./quote.js";
import { computeCap, computeClaimPayout, type Incident } from "./claim.js";

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface ScenarioInput {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimStepResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimStepResult;

export interface ScenarioOutput {
  results: StepResult[];
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

const getPolicyOrThrow = (policiesByStepIndex: Map<number, Policy>, stepIndex: number): Policy => {
  const policy = policiesByStepIndex.get(stepIndex);
  if (!policy) {
    throw new Error(`No policy found at step index ${stepIndex}`);
  }
  return policy;
};

export const runScenario = (input: ScenarioInput): ScenarioOutput => {
  const policiesByStepIndex = new Map<number, Policy>();

  const handleQuoteStep = (step: QuoteStep, stepIndex: number): QuoteResult => {
    const premium = computeQuotePremium(input.customer, step.items, true);
    policiesByStepIndex.set(stepIndex, { items: step.items, remainingCap: computeCap(step.items) });
    return { premium };
  };

  const handleClaimStep = (step: ClaimStep): ClaimStepResult => {
    const policy = getPolicyOrThrow(policiesByStepIndex, step.policy);
    const { payout, remainingCap } = computeClaimPayout(policy.items, step.incident, policy.remainingCap);
    policy.remainingCap = remainingCap;
    return { payout, remainingCap };
  };

  const results: StepResult[] = input.steps.map((step, index) =>
    step.op === "quote" ? handleQuoteStep(step, index) : handleClaimStep(step)
  );
  return { results };
};
