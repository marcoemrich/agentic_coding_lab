import { processClaim } from './claims.js';
import { computeInsuranceSum, computePremium } from './pricing.js';
import {
  ClaimResult,
  Policy,
  QuoteResult,
  Scenario,
  ScenarioResult,
  StepResult,
} from './types.js';

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  const policiesByStepIndex = new Map<number, Policy>();
  let contractIndex = 0;

  scenario.steps.forEach((step, idx) => {
    if (step.op === 'quote') {
      const insuranceSum = computeInsuranceSum(step.items);
      const premium = computePremium(step.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        contractIndex,
      });
      contractIndex += 1;
      const policy: Policy = {
        items: step.items,
        insuranceSum,
        remainingCap: 2 * insuranceSum,
      };
      policiesByStepIndex.set(idx, policy);
      const result: QuoteResult = { premium };
      results.push(result);
    } else {
      // claim
      const policy = policiesByStepIndex.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references missing policy at step ${step.policy}`);
      }
      const outcome = processClaim(policy, step.incident);
      const result: ClaimResult = {
        payout: outcome.payout,
        remainingCap: outcome.remainingCap,
      };
      results.push(result);
    }
  });

  return { results };
}
