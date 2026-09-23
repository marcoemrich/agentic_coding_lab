import { ValidationError, type Item } from './catalog';
import { Policy, type ClaimResult, type Damage } from './claim';
import { quotePremium, type Customer } from './premium';

type Step =
  | { op: 'quote'; items: Item[] }
  | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: Customer;
  steps: unknown[];
}

type StepResult = { premium: number } | ClaimResult;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseStep(raw: unknown, index: number): Step {
  if (!isObject(raw)) throw new ValidationError(`Step ${index} is not an object`);
  if (raw.op === 'quote') {
    if (!Array.isArray(raw.items) || !raw.items.every((item) => isObject(item) && typeof item.type === 'string')) {
      throw new ValidationError(`Step ${index}: invalid items`);
    }
    return raw as Step;
  }
  if (raw.op === 'claim') {
    const incident = raw.incident;
    if (
      !Number.isInteger(raw.policy) ||
      !isObject(incident) ||
      !Array.isArray(incident.damages) ||
      !incident.damages.every((d) => isObject(d) && typeof d.itemType === 'string' && typeof d.amount === 'number')
    ) {
      throw new ValidationError(`Step ${index}: invalid claim`);
    }
    return raw as Step;
  }
  throw new ValidationError(`Step ${index}: unknown op ${String(raw.op)}`);
}

export function runScenario(input: unknown): { results: StepResult[] } {
  if (!isObject(input) || !isObject(input.customer) || !Array.isArray(input.steps)) {
    throw new ValidationError('Scenario requires a customer object and a steps array');
  }
  const customer = input.customer as unknown as Customer;
  if (!Number.isInteger(customer.yearsWithMHPCO)) {
    throw new ValidationError('customer.yearsWithMHPCO must be an integer');
  }

  const policies = new Map<number, Policy>();
  let contracts = 0;
  const results = input.steps.map((raw, index): StepResult => {
    const step = parseStep(raw, index);
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, customer, contracts);
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
