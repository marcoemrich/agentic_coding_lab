import { ClaimOfficeError, Item } from './catalog';
import { ClaimResult, Damage, Policy } from './claim';
import { quotePremium } from './premium';

type Step =
  | { op: 'quote'; items: Item[] }
  | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

type StepResult = { premium: number } | ClaimResult;

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  if (!scenario || typeof scenario.customer !== 'object' || !Array.isArray(scenario.steps)) {
    throw new ClaimOfficeError('Scenario requires a customer object and a steps array');
  }
  const policies = new Map<number, Policy>();
  let contracts = 0;
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === 'quote') {
      if (!Array.isArray(step.items)) throw new ClaimOfficeError(`Step ${index}: items must be an array`);
      const premium = quotePremium(step.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO ?? 0,
        previousContracts: contracts,
      });
      policies.set(index, new Policy(step.items));
      contracts += 1;
      return { premium };
    }
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new ClaimOfficeError(`Step ${index}: no policy created at step ${step.policy}`);
      const damages = step.incident?.damages;
      if (!Array.isArray(damages)) throw new ClaimOfficeError(`Step ${index}: incident.damages must be an array`);
      return policy.claim(damages);
    }
    throw new ClaimOfficeError(`Step ${index}: unknown op ${(step as { op: unknown }).op}`);
  });
  return { results };
}
