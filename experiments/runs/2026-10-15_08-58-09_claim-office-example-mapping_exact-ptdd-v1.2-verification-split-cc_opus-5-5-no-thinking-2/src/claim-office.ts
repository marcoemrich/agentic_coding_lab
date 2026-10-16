import { type ClaimResult, type Damage, openPolicy, type Policy, settleClaim } from "./claim.js";
import { type Customer, quotePremium } from "./premium.js";
import type { InsuredItem } from "./price-list.js";

export type QuoteStep = { op: "quote"; items: InsuredItem[] };

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};

export type Scenario = {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
};

export type QuoteResult = { premium: number };

export function runScenario(scenario: Scenario): { results: (QuoteResult | ClaimResult)[] } {
  const { customer, steps } = scenario;
  const policies = new Map<number, Policy>();
  return {
    results: steps.map((step, index) => {
      if (step.op === "claim") {
        return settleClaim(policies.get(step.policy) as Policy, step.incident.damages);
      }
      const isFollowUpContract = policies.size > 0;
      policies.set(index, openPolicy(step.items));
      return { premium: quotePremium(customer, step.items, isFollowUpContract) };
    }),
  };
}
