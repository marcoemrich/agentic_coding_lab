import { policyCap, processClaim } from "./claimSettlement.js";
import { quotePremium } from "./premium.js";
import type { ClaimResult, InsuredItem, QuoteResult, Scenario } from "./types.js";

export type * from "./types.js";

type Policy = { items: InsuredItem[]; remainingCap: number };

export function runScenario(scenario: Scenario): { results: (QuoteResult | ClaimResult)[] } {
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "claim") {
        const policy = policies.get(step.policy) as Policy;
        const result = processClaim(policy.items, step.incident.damages, policy.remainingCap);
        policy.remainingCap = result.remainingCap;
        return result;
      }
      const premium = quotePremium(step.items, scenario.customer, policies.size > 0);
      policies.set(index, { items: step.items, remainingCap: policyCap(step.items) });
      return { premium };
    }),
  };
}
