import type { Customer, Item } from "./quote.js";
import { assertKnownItemTypes, quotePremium } from "./quote.js";
import type { ClaimResult, Damage, Policy } from "./claims.js";
import { payoutCap, processClaim } from "./claims.js";

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | ClaimResult;

interface PolicyState {
  policy: Policy;
  remainingCap: number;
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, PolicyState>();
  const results: StepResult[] = [];
  let quoteCount = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      assertKnownItemTypes(step.items);
      const policy: Policy = { items: step.items };
      policies.set(index, { policy, remainingCap: payoutCap(policy) });
      const isFirstContract = quoteCount === 0;
      quoteCount += 1;
      results.push({
        premium: quotePremium(step.items, scenario.customer, isFirstContract),
      });
      return;
    }

    const state = policies.get(step.policy);
    if (state === undefined) {
      throw new Error(`claim refers to unknown policy step: ${step.policy}`);
    }
    const claim = processClaim(
      state.policy,
      step.incident.damages,
      state.remainingCap,
    );
    state.remainingCap = claim.remainingCap;
    results.push(claim);
  });

  return results;
}
