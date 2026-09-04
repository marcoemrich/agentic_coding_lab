import { quote, type Item } from './quote.js';
import { createPolicy, type Policy } from './policy.js';
import { claim, type Damage } from './claim.js';

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const customer = {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        previousContracts: policies.size,
      };
      results.push({ premium: quote(customer, step.items) });
      policies.set(index, createPolicy(step.items));
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error(`Step ${step.policy} did not create a policy`);
    }
    results.push(claim(policy, step.incident.damages));
  });

  return results;
}
