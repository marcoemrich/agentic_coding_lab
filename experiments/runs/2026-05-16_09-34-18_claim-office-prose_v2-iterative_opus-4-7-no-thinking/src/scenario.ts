import type { Output, Policy, Scenario, StepResult } from "./types.js";
import { computePremium } from "./quote.js";
import { totalInsuranceSum } from "./pricing.js";
import { processClaim } from "./claim.js";

export function runScenario(scenario: Scenario): Output {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contractsSoFar = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];

    if (step.op === "quote") {
      const premium = computePremium(step.items, {
        customer: scenario.customer,
        contractsSoFar,
      });
      const insuranceSum = totalInsuranceSum(step.items);
      const cap = insuranceSum * 2;
      policies.set(i, {
        items: step.items,
        insuranceSum,
        cap,
        remainingCap: cap,
      });
      contractsSoFar += 1;
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(
          `Claim step ${i} references non-existent policy ${step.policy}`,
        );
      }
      const { payout, remainingCap } = processClaim(policy, step.incident);
      results.push({ payout, remainingCap });
    } else {
      const _exhaustive: never = step;
      throw new Error(`Unknown op: ${JSON.stringify(_exhaustive)}`);
    }
  }

  return { results };
}
