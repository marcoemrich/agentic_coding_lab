// Scenario processing: iterates over steps, tracks policies and the
// contract count, and produces the corresponding results.

import type { Policy, Scenario, Step } from "./domain.js";
import { calculatePremium } from "./premium.js";
import { calculateClaimPayout } from "./claim.js";
import { createPolicy } from "./policy.js";

export function runScenario(scenario: Scenario): { results: { premium?: number; payout?: number; remainingCap?: number }[] } {
  const policies: Policy[] = [];
  const results: { premium?: number; payout?: number; remainingCap?: number }[] = [];
  let contractCount = 0;

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const isFollowUp = contractCount >= 1;
      const premium = calculatePremium(step.items, scenario.customer, isFollowUp);
      const policy = createPolicy(step.items);
      policies.push(policy);
      results.push({ premium });
      contractCount += 1;
    } else {
      // claim
      const policy = policies[step.policy];
      const { payout, remainingCap } = calculateClaimPayout(policy, step.incident.damages);
      policy.remainingCap = remainingCap;
      results.push({ payout, remainingCap });
    }
  }

  return { results };
}
