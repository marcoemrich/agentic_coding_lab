import { CAP_FACTOR, insuranceSum, settleClaim } from './claim.js';
import { quotePremium } from './premium.js';
import { ClaimOfficeError, type Customer, type Damage, type Item, type Policy } from './types.js';

interface QuoteStep {
  op: 'quote';
  items: Item[];
}

interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

export function runScenario(scenario: Scenario): Result[] {
  const policies = new Map<number, Policy>();
  let contracts = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer, contracts);
      contracts += 1;
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_FACTOR,
      });
      return { premium };
    }

    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new ClaimOfficeError(`no policy at step index ${step.policy}`);

      const settled = settleClaim(policy, step.incident.damages);
      policy.remainingCap = settled.remainingCap;
      return settled;
    }

    throw new ClaimOfficeError(`unknown operation: ${(step as { op: string }).op}`);
  });
}
