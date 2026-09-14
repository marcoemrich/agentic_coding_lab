import { ClaimError, Incident } from './claim.js';
import { Item } from './policy.js';
import { Policy } from './policyAccount.js';
import { Customer, quotePremium } from './premium.js';

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
  let contracts = 0;
  return scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer, contracts);
      contracts += 1;
      policies.set(index, new Policy(step.items));
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new ClaimError(`no policy created by step ${step.policy}`);
    return policy.claim(step.incident);
  });
}
