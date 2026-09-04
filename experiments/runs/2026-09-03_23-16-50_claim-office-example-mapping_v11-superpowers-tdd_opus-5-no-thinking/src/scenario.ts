import { quote, type Customer, type Item } from './quote.js';
import { claim, createPolicy, type Incident, type Policy } from './claim.js';

export interface QuoteStepInput {
  op: 'quote';
  items: Item[];
}

export interface ClaimStepInput {
  op: 'claim';
  policy: number;
  incident: Incident;
}

export type Step = QuoteStepInput | ClaimStepInput;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let contractsSoFar = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const result = quote({ items: step.items }, scenario.customer, contractsSoFar);
      contractsSoFar += 1;
      policies.set(index, createPolicy(step.items));
      return { premium: result.premium };
    }

    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`claim refers to step ${step.policy}, which is not a quote`);
    }
    return claim(policy, step.incident);
  });
}
