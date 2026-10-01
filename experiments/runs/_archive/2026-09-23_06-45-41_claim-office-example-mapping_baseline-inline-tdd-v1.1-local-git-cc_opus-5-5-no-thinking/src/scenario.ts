import { Item, ValidationError } from './catalog';
import { ClaimResult, Damage, Policy } from './claim';
import { quotePremium } from './premium';

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

type Step =
  | { op: 'quote'; items: Item[] }
  | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };

type StepResult = { premium: number } | ClaimResult;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateStep(step: unknown, i: number): void {
  if (!isObject(step)) throw new ValidationError(`Step ${i} must be an object`);
  if (step.op === 'quote') {
    if (!Array.isArray(step.items) || !step.items.every((item) => isObject(item) && typeof item.type === 'string')) {
      throw new ValidationError(`Step ${i}: quote requires an items array of typed items`);
    }
    return;
  }
  if (step.op !== 'claim') throw new ValidationError(`Step ${i}: unknown op ${String(step.op)}`);
  const incident = step.incident;
  if (typeof step.policy !== 'number' || !isObject(incident) || !Array.isArray(incident.damages)) {
    throw new ValidationError(`Step ${i}: claim requires a policy index and an incident with damages`);
  }
  if (!incident.damages.every((d) => isObject(d) && typeof d.itemType === 'string' && typeof d.amount === 'number')) {
    throw new ValidationError(`Step ${i}: each damage requires itemType and amount`);
  }
}

function validate(input: unknown): Scenario {
  if (!isObject(input) || !isObject(input.customer) || !Array.isArray(input.steps)) {
    throw new ValidationError('Scenario requires a customer object and a steps array');
  }
  if (typeof input.customer.yearsWithMHPCO !== 'number') {
    throw new ValidationError('customer.yearsWithMHPCO must be a number');
  }
  input.steps.forEach(validateStep);
  return input as unknown as Scenario;
}

export function runScenario(input: unknown): { results: StepResult[] } {
  const scenario = validate(input);
  const policies = new Map<number, Policy>();
  let contracts = 0;

  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        previousContracts: contracts,
      });
      policies.set(index, new Policy(step.items));
      contracts++;
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new ValidationError(`Step ${index}: no policy created at step ${step.policy}`);
    return policy.claim(step.incident.damages);
  });
  return { results };
}
