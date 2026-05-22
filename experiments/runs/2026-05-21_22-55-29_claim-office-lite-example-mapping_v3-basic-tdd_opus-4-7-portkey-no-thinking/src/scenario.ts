import type { Customer, Item, Incident } from './types.js';
import { quote } from './quote.js';
import { claim } from './claim.js';

interface QuoteStep {
  op: 'quote';
  items: Item[];
}

interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

type StepResult = { premium: number } | { payout: number };

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const results: StepResult[] = [];
  const policies = new Map<number, Item[]>();
  let contractCount = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === 'quote') {
      const customer: Customer = {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        contractCount,
      };
      const premium = quote(customer, step.items);
      policies.set(i, step.items);
      contractCount++;
      results.push({ premium });
    } else if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references unknown policy index ${step.policy}`);
      }
      const payout = claim(policy, step.incident);
      results.push({ payout });
    } else {
      throw new Error(`Unknown step op: ${(step as any).op}`);
    }
  }

  return { results };
}
