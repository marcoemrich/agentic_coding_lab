import { Customer, Item, quotePremium } from './premium';
import { Incident, Policy, createPolicy, settleClaim } from './claim';

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
  const results: StepResult[] = [];
  let contractsSoFar = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer, contractsSoFar);
      contractsSoFar += 1;
      policies.set(index, createPolicy(step.items));
      results.push({ premium });
    } else if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (policy === undefined) {
        throw new Error(`no policy created by step ${step.policy}`);
      }
      const payout = settleClaim(policy, step.incident);
      results.push({ payout, remainingCap: policy.remainingCap });
    } else {
      throw new Error(`unknown operation: ${JSON.stringify((step as Step).op)}`);
    }
  });

  return results;
}
