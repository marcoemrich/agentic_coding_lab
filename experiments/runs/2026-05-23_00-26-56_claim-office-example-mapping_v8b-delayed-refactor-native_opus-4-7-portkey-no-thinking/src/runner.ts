import { ClaimStep, Output, Policy, QuoteStep, Scenario, StepResult } from "./types.js";
import { computeInsuranceSum, computePremium } from "./pricing.js";
import { processClaim } from "./claim.js";

function newPolicy(step: QuoteStep): Policy {
  const insuranceSum = computeInsuranceSum(step.items);
  return {
    items: step.items,
    insuranceSum,
    cap: insuranceSum * 2,
    remainingCap: insuranceSum * 2,
  };
}

export function runScenario(scenario: Scenario): Output {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;

  scenario.steps.forEach((step, i) => {
    if (step.op === "quote") {
      results.push({
        premium: computePremium(step.items, {
          yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
          isFollowUpContract: quoteCount > 0,
        }),
      });
      policies.set(i, newPolicy(step));
      quoteCount++;
    } else {
      results.push(handleClaim(step, policies));
    }
  });

  return { results };
}

function handleClaim(step: ClaimStep, policies: Map<number, Policy>): StepResult {
  const policy = policies.get(step.policy);
  if (!policy) {
    throw new Error(`Claim references unknown policy index ${step.policy}`);
  }
  return processClaim(policy, step.incident.damages);
}
