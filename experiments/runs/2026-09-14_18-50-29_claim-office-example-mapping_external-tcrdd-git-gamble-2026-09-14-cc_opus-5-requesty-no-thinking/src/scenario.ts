import { quotePremium, insuranceSum, type Customer, type Item } from './premium';
import { settleClaim, type Damage } from './claim';

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

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

const CAP_MULTIPLIER = 2;

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  const results: StepResult[] = [];
  let contracts = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer, contracts);
      contracts += 1;
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      });
      results.push({ premium });
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error(`claim refers to a step that did not create a policy: ${step.policy}`);
    }
    const settled = settleClaim(policy, step.incident.damages);
    policy.remainingCap = settled.remainingCap;
    results.push(settled);
  });

  return results;
}
