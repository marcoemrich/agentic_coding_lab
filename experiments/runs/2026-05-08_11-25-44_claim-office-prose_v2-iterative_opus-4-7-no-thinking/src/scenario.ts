import { processClaim } from './claims.js';
import { computePremium, totalInsuranceSum } from './pricing.js';
import type {
  ClaimResult,
  Policy,
  QuoteResult,
  Scenario,
  ScenarioResult,
  StepResult,
} from './types.js';

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contractIndex = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === 'quote') {
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
      const result: QuoteResult = { premium };
      results.push(result);
      contractIndex++;
    } else if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`No policy at step ${step.policy}`);
      }
      const outcome = processClaim(policy, step.incident);
      const result: ClaimResult = {
        payout: outcome.payout,
        remainingCap: outcome.remainingCap,
      };
      results.push(result);
    }
  }
  return { results };
}
