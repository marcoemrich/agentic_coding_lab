import { QuoteItem, Customer, QuoteResult, computeQuote } from "./quote.js";
import { Damage, ClaimResult, computeClaim, capFor } from "./claim.js";

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

export type ScenarioStep = QuoteStep | ClaimStep;

export interface ScenarioInput {
  customer: Customer;
  steps: ScenarioStep[];
}

export interface ScenarioOutput {
  results: Array<QuoteResult | ClaimResult>;
}

interface PolicyState {
  items: QuoteItem[];
  remainingCap: number;
}

export const runScenario = (input: ScenarioInput): ScenarioOutput => {
  const policies: PolicyState[] = [];
  const results = input.steps.map((step) => {
    if (step.op === "quote") {
      policies.push({ items: step.items, remainingCap: capFor(step.items) });
      const { premium } = computeQuote(input.customer, step.items);
      return { premium };
    }
    const policy = policies[step.policy];
    const claimResult = computeClaim(
      policy.items,
      step.incident.damages,
      policy.remainingCap
    );
    policy.remainingCap = claimResult.remainingCap;
    return claimResult;
  });
  return { results };
};
