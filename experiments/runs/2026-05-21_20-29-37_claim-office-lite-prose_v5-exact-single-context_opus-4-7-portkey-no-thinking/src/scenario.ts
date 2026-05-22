import type { Customer, Item } from "./quote.js";
import { quote } from "./quote.js";
import { claim } from "./claim.js";

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number };

export interface ScenarioOutput {
  results: StepResult[];
}

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  const results: StepResult[] = [];
  const policiesByStep: Record<number, Item[]> = {};
  let quoteCount = 0;
  scenario.steps.forEach((step, idx) => {
    if (step.op === "quote") {
      const premium = quote({
        customer: scenario.customer,
        items: step.items,
        contractIndex: quoteCount,
      });
      policiesByStep[idx] = step.items;
      quoteCount += 1;
      results.push({ premium });
    } else {
      const policyItems = policiesByStep[step.policy] ?? [];
      const payout = claim({ policyItems, incident: step.incident });
      results.push({ payout });
    }
  });
  return { results };
};
