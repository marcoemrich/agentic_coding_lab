import { Policy } from './policy.js';
import { quotePremium } from './quote.js';
import { ClaimOfficeError, type Scenario, type StepResult } from './types.js';

/** Processes the steps of a scenario in order, threading customer history. */
export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, {
        customer: scenario.customer,
        previousContracts: policies.size,
      });
      policies.set(index, new Policy(step.items));
      results.push({ premium });
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new ClaimOfficeError(`step ${step.policy} did not create a policy`);
    }
    results.push(policy.claim(step.incident));
  });

  return results;
}
