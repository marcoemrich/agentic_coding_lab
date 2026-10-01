import { Item, ValidationError } from './catalog';
import { ClaimResult, Damage, Policy, processClaim } from './claim';
import { quotePremium } from './premium';

type StepResult = { premium: number } | ClaimResult;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireArray(value: unknown, name: string): unknown[] {
  if (!Array.isArray(value)) throw new ValidationError(`${name} must be an array`);
  return value;
}

function parseItems(value: unknown): Item[] {
  return requireArray(value, 'items').map((item) => {
    if (!isObject(item)) throw new ValidationError('item must be an object');
    return item as unknown as Item;
  });
}

function parseDamages(incident: unknown): Damage[] {
  if (!isObject(incident)) throw new ValidationError('incident must be an object');
  return requireArray(incident.damages, 'damages').map((damage) => {
    if (!isObject(damage)) throw new ValidationError('damage must be an object');
    return damage as unknown as Damage;
  });
}

export function runScenario(input: unknown): { results: StepResult[] } {
  if (!isObject(input) || !isObject(input.customer)) throw new ValidationError('customer is required');
  const years = input.customer.yearsWithMHPCO;
  if (typeof years !== 'number' || !Number.isFinite(years)) {
    throw new ValidationError('customer.yearsWithMHPCO must be a number');
  }
  const steps = requireArray(input.steps, 'steps');
  const policies = new Map<number, Policy>();
  let contracts = 0;

  const results = steps.map((step, index): StepResult => {
    if (!isObject(step)) throw new ValidationError(`step ${index} must be an object`);
    if (step.op === 'quote') {
      const items = parseItems(step.items);
      const premium = quotePremium(items, { yearsWithMHPCO: years, previousContracts: contracts });
      policies.set(index, new Policy(items));
      contracts++;
      return { premium };
    }
    if (step.op === 'claim') {
      const policy = typeof step.policy === 'number' ? policies.get(step.policy) : undefined;
      if (!policy) throw new ValidationError(`step ${index} references unknown policy ${String(step.policy)}`);
      return processClaim(policy, parseDamages(step.incident));
    }
    throw new ValidationError(`step ${index} has unknown op ${String(step.op)}`);
  });

  return { results };
}
