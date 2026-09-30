import { Result, Scenario } from './types';
import { quote } from './premium';
import { Policy } from './policy';

export type { Item, Damage, QuoteResult } from './types';

export function runScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === 'quote') {
        policies.set(index, new Policy(step.items));
        return { premium: quote(step.items, scenario.customer, index > 0) };
      }
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy ${step.policy}: step ${step.policy} did not create a policy`);
      return policy.claim(step.incident.damages);
    }),
  };
}
