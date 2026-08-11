import { createPolicy, settleClaim, type Policy } from './claim.js';
import { quotePremium } from './premium.js';
import { ClaimOfficeError, type Scenario, type StepResult } from './types.js';

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];
  let contractIndex = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === 'quote') {
      const quote = quotePremium(step.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        contractIndex,
      });
      contractIndex += 1;
      policies.set(stepIndex, createPolicy(step.items, quote.insuranceSum));
      results.push({ premium: quote.premium });
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new ClaimOfficeError(`step ${step.policy} did not create a policy`);
    }
    results.push(settleClaim(policy, step.incident));
  });

  return results;
}
