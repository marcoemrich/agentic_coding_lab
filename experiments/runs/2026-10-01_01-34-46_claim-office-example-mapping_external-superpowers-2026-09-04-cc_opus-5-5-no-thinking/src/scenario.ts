import { Item } from './catalog';
import { Damage, Policy } from './policy';
import { Customer, quote } from './quote';

export type Step =
  | { op: 'quote'; items: Item[] }
  | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === 'quote') {
      const premium = quote(step.items, scenario.customer, { previousContracts: policies.size });
      policies.set(index, new Policy(step.items));
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`No policy created at step ${step.policy}`);
    return policy.claim(step.incident.damages);
  });
  return { results };
}
