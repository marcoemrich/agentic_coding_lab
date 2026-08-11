import { ClaimOfficeError, type Customer, type Damage, type Item } from './types.js';
import { openPolicy, settleClaim, type ClaimResult, type Policy } from './claim.js';
import { quotePremium } from './premium.js';

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
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | ClaimResult;

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let contracts = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer, contracts);
      contracts += 1;
      policies.set(index, openPolicy(step.items));
      return { premium };
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new ClaimOfficeError(`step ${step.policy} did not create a policy`);
    }
    return settleClaim(policy, step.incident.damages);
  });
}
