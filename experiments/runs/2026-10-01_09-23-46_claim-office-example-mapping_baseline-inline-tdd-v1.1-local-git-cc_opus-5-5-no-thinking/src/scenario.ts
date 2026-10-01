import { ClaimOfficeError, Customer, Item } from './catalog';
import { ClaimResult, Damage, Policy } from './policy';
import { quotePremium } from './premium';

export type Step =
  | { op: 'quote'; items: Item[] }
  | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | ClaimResult;

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  if (!scenario || typeof scenario.customer !== 'object' || !Array.isArray(scenario.steps)) {
    throw new ClaimOfficeError('Scenario requires a customer object and a steps array');
  }
  const policies = new Map<number, Policy>();
  let quotesSoFar = 0;

  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === 'quote') {
      if (!Array.isArray(step.items)) throw new ClaimOfficeError(`Step ${index}: items must be an array`);
      const premium = quotePremium(step.items, scenario.customer, quotesSoFar > 0);
      policies.set(index, new Policy(step.items));
      quotesSoFar++;
      return { premium };
    }
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new ClaimOfficeError(`Step ${index}: no policy created at step ${step.policy}`);
      if (!Array.isArray(step.incident?.damages)) {
        throw new ClaimOfficeError(`Step ${index}: incident.damages must be an array`);
      }
      return policy.claim(step.incident.damages);
    }
    throw new ClaimOfficeError(`Step ${index}: unknown op ${(step as { op: unknown }).op}`);
  });

  return { results };
}
