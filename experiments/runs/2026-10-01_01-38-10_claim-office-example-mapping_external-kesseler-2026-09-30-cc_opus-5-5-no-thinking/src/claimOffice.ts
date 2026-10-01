import { Item } from './catalog';
import { ClaimResult, Damage, Policy } from './policy';
import { Customer, quotePremium } from './premium';

export type { Item } from './catalog';
export type { ClaimResult, Damage } from './policy';
export type { Customer } from './premium';
export { basePremium } from './premium';

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

export interface QuoteResult {
  premium: number;
}

export type StepResult = QuoteResult | ClaimResult;

function findPolicy(policies: Map<number, Policy>, stepIndex: number): Policy {
  const policy = policies.get(stepIndex);
  if (!policy) {
    throw new Error(`No policy was created at step ${stepIndex}`);
  }
  return policy;
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === 'claim') {
        return findPolicy(policies, step.policy).claim(step.incident.damages);
      }
      const isFollowUp = policies.size > 0;
      policies.set(index, new Policy(step.items));
      return { premium: quotePremium(step.items, scenario.customer, isFollowUp) };
    }),
  };
}
