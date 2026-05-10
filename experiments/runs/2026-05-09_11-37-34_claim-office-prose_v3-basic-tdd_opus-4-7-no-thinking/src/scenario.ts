import type {
  Policy,
  Scenario,
  ScenarioOutput,
  StepResult,
} from './types.js';
import { computeQuote } from './quote.js';
import { computeInsuranceSum } from './items.js';
import { processClaim } from './claim.js';

/**
 * Run a full scenario: process steps in order, building up policies from
 * quote steps and consuming them in claim steps. Returns the per-step
 * results in the same order.
 */
export function runScenario(scenario: Scenario): ScenarioOutput {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];
  let contractCount = 0;

  scenario.steps.forEach((step, idx) => {
    if (step.op === 'quote') {
      const premium = computeQuote(scenario.customer, step.items, contractCount);
      const insuranceSum = computeInsuranceSum(step.items);
      policies.set(idx, {
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * 2,
      });
      contractCount++;
      results.push({ premium });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references unknown policy step ${step.policy}`);
      }
      const outcome = processClaim(policy, step.incident);
      results.push({ payout: outcome.payout, remainingCap: outcome.remainingCap });
    }
  });

  return { results };
}
