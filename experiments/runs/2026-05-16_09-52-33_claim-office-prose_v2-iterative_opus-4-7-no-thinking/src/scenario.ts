import type {
  Scenario,
  ScenarioResult,
  StepResult,
  PolicyRecord,
  QuoteStep,
  ClaimStep,
} from "./types.js";
import { computePremium, totalInsuranceSum } from "./pricing.js";
import { processClaim } from "./claims.js";

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  // Index of policy by step index
  const policies = new Map<number, PolicyRecord>();
  let contractIndex = 0;

  scenario.steps.forEach((step, idx) => {
    if (step.op === "quote") {
      const quoteStep = step as QuoteStep;
      const premium = computePremium(quoteStep.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        contractIndex,
      });
      const insuranceSum = totalInsuranceSum(quoteStep.items);
      policies.set(idx, {
        items: quoteStep.items,
        insuranceSum,
        remainingCap: 2 * insuranceSum,
      });
      contractIndex += 1;
      results.push({ premium });
    } else {
      const claimStep = step as ClaimStep;
      const policy = policies.get(claimStep.policy);
      if (!policy) {
        results.push({ payout: 0, remainingCap: 0 });
        return;
      }
      const claimResult = processClaim(policy, claimStep.incident);
      policy.remainingCap = claimResult.remainingCap;
      results.push(claimResult);
    }
  });

  return { results };
}
