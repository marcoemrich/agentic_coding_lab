import { ClaimOfficeError, Item } from './catalog';
import { Damage, Policy } from './claim';
import { quotePremium } from './premium';

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

interface QuoteStep {
  op: 'quote';
  items: Item[];
}

interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseStep(step: unknown, index: number): QuoteStep | ClaimStep {
  if (!isObject(step)) throw new ClaimOfficeError(`Step ${index} is not an object`);
  if (step.op === 'quote') {
    if (!Array.isArray(step.items) || !step.items.every((item) => isObject(item) && typeof item.type === 'string')) {
      throw new ClaimOfficeError(`Step ${index}: quote requires an items array with item types`);
    }
    return step as unknown as QuoteStep;
  }
  if (step.op === 'claim') {
    const incident = step.incident;
    if (
      !Number.isInteger(step.policy) ||
      !isObject(incident) ||
      !Array.isArray(incident.damages) ||
      !incident.damages.every((d) => isObject(d) && typeof d.itemType === 'string' && typeof d.amount === 'number')
    ) {
      throw new ClaimOfficeError(`Step ${index}: claim requires a policy index and incident damages`);
    }
    return step as unknown as ClaimStep;
  }
  throw new ClaimOfficeError(`Step ${index}: unknown op ${String(step.op)}`);
}

export function runScenario(scenario: unknown): { results: StepResult[] } {
  if (!isObject(scenario) || !isObject(scenario.customer) || !Array.isArray(scenario.steps)) {
    throw new ClaimOfficeError('Scenario requires a customer object and a steps array');
  }
  const yearsWithMHPCO = scenario.customer.yearsWithMHPCO;
  if (typeof yearsWithMHPCO !== 'number') throw new ClaimOfficeError('customer.yearsWithMHPCO must be a number');

  const policies = new Map<number, Policy>();
  let previousContracts = 0;
  const results = scenario.steps.map((rawStep, index): StepResult => {
    const step = parseStep(rawStep, index);
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, { yearsWithMHPCO, previousContracts });
      policies.set(index, new Policy(step.items));
      previousContracts++;
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new ClaimOfficeError(`Step ${index}: no policy created at step ${step.policy}`);
    const payout = policy.claim(step.incident.damages);
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
}
