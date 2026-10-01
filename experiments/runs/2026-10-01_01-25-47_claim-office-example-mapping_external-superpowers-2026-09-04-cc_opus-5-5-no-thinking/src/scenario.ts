import { createPolicy, processClaim, type ClaimResult, type Damage, type Policy } from './claim';
import { quotePremium, type Item } from './premium';

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

export type StepResult = { premium: number } | ClaimResult;

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        previousContracts: policies.size,
      });
      policies.set(index, createPolicy(step.items));
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Claim refers to step ${step.policy}, which did not create a policy`);
    return processClaim(policy, step.incident.damages);
  });
  return { results };
}
