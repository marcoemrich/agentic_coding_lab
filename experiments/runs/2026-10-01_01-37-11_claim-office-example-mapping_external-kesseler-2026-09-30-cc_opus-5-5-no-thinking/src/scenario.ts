import { Item } from './catalog';
import { quotePremium } from './premium';
import { Damage, Policy } from './policy';

export type { Item };

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

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

function policyAt(policies: Map<number, Policy>, stepIndex: number): Policy {
  const policy = policies.get(stepIndex);
  if (!policy) {
    throw new Error(`Unknown policy ${stepIndex}: step ${stepIndex} is not an earlier quote`);
  }
  return policy;
}

export function runScenario(scenario: Scenario): { results: (QuoteResult | ClaimResult)[] } {
  const { yearsWithMHPCO } = scenario.customer;
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === 'quote') {
        const premium = quotePremium(step.items, { yearsWithMHPCO, isFollowUp: policies.size > 0 });
        policies.set(index, new Policy(step.items));
        return { premium };
      }
      return policyAt(policies, step.policy).claim(step.incident.damages);
    }),
  };
}
