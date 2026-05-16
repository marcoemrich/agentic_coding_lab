import { processClaim } from "./claim.js";
import { computePremium, totalInsuredSum } from "./pricing.js";
import type {
  Policy,
  Scenario,
  StepResult,
  Output,
} from "./types.js";

export function runScenario(scenario: Scenario): Output {
  const results: StepResult[] = [];
  const policies: Map<number, Policy> = new Map();
  let quoteCount = 0;

  scenario.steps.forEach((step, idx) => {
    if (step.op === "quote") {
      const premium = computePremium(step.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        prevQuoteCount: quoteCount,
      });
      const insuranceSum = totalInsuredSum(step.items);
      policies.set(idx, {
        items: step.items,
        insuranceSum,
        capRemaining: 2 * insuranceSum,
      });
      quoteCount++;
      results.push({ premium });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(
          `Claim step ${idx} references unknown policy ${step.policy}`,
        );
      }
      const { payout, remainingCap } = processClaim(policy, step.incident);
      results.push({ payout, remainingCap });
    }
  });

  return { results };
}
