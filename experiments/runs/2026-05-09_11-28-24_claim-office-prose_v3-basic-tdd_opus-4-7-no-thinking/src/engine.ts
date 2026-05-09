import { quote } from './quote.js';
import { processClaim } from './claim.js';
import type { ClaimResult, Policy, QuoteResult, Scenario, Step } from './types.js';

export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results: ScenarioResult['results'] = [];
  let contractIndex = 0;

  scenario.steps.forEach((step: Step, idx: number) => {
    if (step.op === 'quote') {
      const q: QuoteResult = quote(step.items, scenario.customer, contractIndex);
      const policy: Policy = {
        items: step.items,
        insuranceSum: q.insuranceSum,
        remainingCap: 2 * q.insuranceSum,
      };
      policies.set(idx, policy);
      results.push({ premium: q.premium });
      contractIndex += 1;
    } else if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim refers to non-existent policy at step ${step.policy}`);
      }
      const c: ClaimResult = processClaim(policy, step.incident);
      results.push({ payout: c.payout, remainingCap: c.remainingCap });
    } else {
      const _exhaustive: never = step;
      throw new Error(`Unknown step op: ${JSON.stringify(_exhaustive)}`);
    }
  });

  return { results };
}
