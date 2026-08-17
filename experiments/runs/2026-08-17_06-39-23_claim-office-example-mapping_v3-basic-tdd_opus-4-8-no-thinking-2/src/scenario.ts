import type { Scenario, Step } from './types.js';
import { quotePremium } from './premium.js';
import { createPolicy, processClaim, PolicyError, type Policy } from './claim.js';

export interface QuoteResult {
  premium: number;
}

export interface ClaimResultOut {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResultOut;

export function runScenario(scenario: Scenario): StepResult[] {
  const { customer, steps } = scenario;
  const results: StepResult[] = [];
  // Policies created by quote steps, keyed by their step index.
  const policies = new Map<number, Policy>();
  let contractIndex = 0;

  steps.forEach((step: Step, index: number) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, customer, contractIndex);
      contractIndex += 1;
      const policy = createPolicy(step.items);
      policies.set(index, policy);
      results.push({ premium });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new PolicyError(
          `Claim references step ${step.policy}, which is not a quote step`,
        );
      }
      const result = processClaim(policy, step.incident);
      results.push(result);
    }
  });

  return results;
}
