import { type ClaimOutcome, type Damage, type Policy, openPolicy, processClaim } from "./claim.js";
import { type Item, quotePremium } from "./quote.js";

export interface QuoteResult {
  premium: number;
}

export interface ScenarioResult {
  results: Array<QuoteResult | ClaimOutcome>;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

const policyOf = (policies: Policy[], index: number): Policy => {
  const policy = policies[index];
  if (policy === undefined) {
    throw new Error(`Claim references policy ${index}, which is not an earlier quote step`);
  }
  return policy;
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      return processClaim(policyOf(policies, step.policy), step.incident.damages);
    }
    policies[index] = openPolicy(step.items);
    return { premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, index > 0) };
  });
  return { results };
};
