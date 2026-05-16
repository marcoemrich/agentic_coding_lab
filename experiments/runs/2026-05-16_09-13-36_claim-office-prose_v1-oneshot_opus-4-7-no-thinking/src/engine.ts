import { processClaim } from "./claims.js";
import { computePremium, totalInsuranceSum } from "./pricing.js";
import {
  ClaimResult,
  ClaimStep,
  Policy,
  QuoteResult,
  QuoteStep,
  Result,
  Scenario,
  ScenarioOutput,
  Step,
} from "./types.js";

function isQuote(step: Step): step is QuoteStep {
  return step.op === "quote";
}
function isClaim(step: Step): step is ClaimStep {
  return step.op === "claim";
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let contractIndex = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (isQuote(step)) {
      const premium = computePremium(step.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        contractIndex,
      });
      const insuranceSum = totalInsuranceSum(step.items);
      policies.set(i, {
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * 2,
      });
      contractIndex++;
      const r: QuoteResult = { premium };
      results.push(r);
    } else if (isClaim(step)) {
      const policy = policies.get(step.policy);
      if (!policy) {
        const r: ClaimResult = { payout: 0, remainingCap: 0 };
        results.push(r);
        continue;
      }
      const { payout, remainingCap } = processClaim(policy, step.incident);
      const r: ClaimResult = { payout, remainingCap };
      results.push(r);
    }
  }

  return { results };
}
