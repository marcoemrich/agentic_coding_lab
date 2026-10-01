import { ClaimResult, Damage, Policy } from './claim';
import { ClaimOfficeError, Customer, Item } from './items';
import { quotePremium } from './premium';

type Step =
  | { op: 'quote'; items: Item[] }
  | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | ClaimResult;

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  if (!scenario?.customer || !Array.isArray(scenario.steps)) {
    throw new ClaimOfficeError('Scenario requires a customer and a steps array');
  }
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index): StepResult => {
    if (step?.op === 'quote') {
      if (!Array.isArray(step.items)) throw new ClaimOfficeError(`Step ${index}: items must be an array`);
      const premium = quotePremium(step.items, scenario.customer, quoteCount > 0);
      policies.set(index, new Policy(step.items));
      quoteCount++;
      return { premium };
    }
    if (step?.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new ClaimOfficeError(`Step ${index}: no policy created at step ${step.policy}`);
      if (!Array.isArray(step.incident?.damages)) throw new ClaimOfficeError(`Step ${index}: damages must be an array`);
      return policy.claim(step.incident.damages);
    }
    throw new ClaimOfficeError(`Step ${index}: unknown op ${String((step as { op?: unknown })?.op)}`);
  });
  return { results };
}
