import { Damage, Policy } from './claim';
import { Item, priceOf } from './items';
import { quotePremium } from './premium';

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export class InvalidScenarioError extends Error {}

function fail(message: string): never {
  throw new InvalidScenarioError(message);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseItems(value: unknown, stepIndex: number): Item[] {
  if (!Array.isArray(value)) fail(`Step ${stepIndex}: items must be an array`);
  return value.map((item) => {
    if (!isObject(item) || typeof item.type !== 'string') fail(`Step ${stepIndex}: each item needs a type`);
    priceOf(item.type);
    return item as unknown as Item;
  });
}

function parseDamages(value: unknown, stepIndex: number): Damage[] {
  if (!isObject(value) || !Array.isArray(value.damages)) fail(`Step ${stepIndex}: incident.damages must be an array`);
  return value.damages.map((damage) => {
    if (!isObject(damage) || typeof damage.itemType !== 'string' || typeof damage.amount !== 'number') {
      fail(`Step ${stepIndex}: each damage needs an itemType and a numeric amount`);
    }
    return damage as unknown as Damage;
  });
}

export function runScenario(input: unknown): { results: StepResult[] } {
  if (!isObject(input) || !isObject(input.customer) || !Array.isArray(input.steps)) {
    fail('Scenario must contain a customer and a steps array');
  }
  const yearsWithMHPCO = input.customer.yearsWithMHPCO;
  if (typeof yearsWithMHPCO !== 'number') fail('customer.yearsWithMHPCO must be a number');

  const policies = new Map<number, Policy>();
  let previousContracts = 0;

  const results = input.steps.map((step, index): StepResult => {
    if (!isObject(step)) fail(`Step ${index} must be an object`);
    if (step.op === 'quote') {
      const items = parseItems(step.items, index);
      const premium = quotePremium(items, { yearsWithMHPCO, previousContracts });
      previousContracts++;
      policies.set(index, new Policy(items));
      return { premium };
    }
    if (step.op === 'claim') {
      const policy = policies.get(step.policy as number);
      if (!policy) fail(`Step ${index}: policy ${String(step.policy)} does not refer to an earlier quote step`);
      return policy.claim(parseDamages(step.incident, index));
    }
    fail(`Step ${index}: unknown op ${String(step.op)}`);
  });

  return { results };
}
