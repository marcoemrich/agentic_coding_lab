import { quote, type Customer, type Item } from './quote.js';
import { claim, createPolicy, type Incident, type Policy } from './claim.js';

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

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

/**
 * Processes the steps in order. Each quote creates a policy addressed by its
 * step index; every quote after the first counts as a follow-up contract.
 */
export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const premium = quote(scenario.customer, step.items, policies.size);
      policies.set(index, createPolicy(step.items));
      results.push({ premium });
      return;
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`claim refers to an unknown policy: step ${step.policy}`);
    results.push(claim(policy, step.incident));
  });

  return results;
}
