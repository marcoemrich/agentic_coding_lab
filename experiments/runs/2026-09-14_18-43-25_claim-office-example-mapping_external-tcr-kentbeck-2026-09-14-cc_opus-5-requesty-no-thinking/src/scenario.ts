import { createPolicy, processClaim, type Incident, type Policy } from './claim';
import { lookup } from './pricelist';
import { quotePremium, type Customer, type Item } from './premium';

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let contractCount = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      for (const item of step.items) lookup(item.type);
      const premium = quotePremium(step.items, scenario.customer, contractCount > 0);
      contractCount += 1;
      policies.set(index, createPolicy(step.items));
      return { premium };
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error(`no policy created by step ${step.policy}`);
    }
    return processClaim(policy, step.incident);
  });
}
