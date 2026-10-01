import { Item } from './catalog';
import { Damage, Policy } from './policy';
import { quotePremium } from './premium';

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        isFollowUpContract: policies.size > 0,
      });
      policies.set(index, new Policy(step.items));
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Step ${index} refers to unknown policy ${step.policy}`);
    return policy.claim(step.incident.damages);
  });
  return { results };
}
