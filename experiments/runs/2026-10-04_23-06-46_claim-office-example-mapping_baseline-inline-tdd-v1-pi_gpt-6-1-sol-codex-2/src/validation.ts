import type { Scenario } from './office';

function object(value: unknown, path: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
  return value as Record<string, unknown>;
}

function array(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${path} must be an array`);
  return value;
}

function integer(value: unknown, path: string): void {
  if (!Number.isSafeInteger(value)) throw new Error(`${path} must be an integer`);
}

function string(value: unknown, path: string): void {
  if (typeof value !== 'string') throw new Error(`${path} must be a string`);
}

function validateItem(value: unknown, path: string): void {
  const item = object(value, path);
  string(item.type, `${path}.type`);
  if ('material' in item) string(item.material, `${path}.material`);
  if ('enchantment' in item) integer(item.enchantment, `${path}.enchantment`);
  if ('cursed' in item && typeof item.cursed !== 'boolean') {
    throw new Error(`${path}.cursed must be a boolean`);
  }
}

function validateIncident(value: unknown, path: string): void {
  const incident = object(value, path);
  string(incident.cause, `${path}.cause`);
  for (const value of array(incident.damages, `${path}.damages`)) {
    const damage = object(value, `${path}.damage`);
    string(damage.itemType, `${path}.damage.itemType`);
    integer(damage.amount, `${path}.damage.amount`);
  }
}

export function validateScenario(input: unknown): Scenario {
  const root = object(input, 'scenario');
  const customer = object(root.customer, 'customer');
  integer(customer.yearsWithMHPCO, 'customer.yearsWithMHPCO');
  for (const [index, value] of array(root.steps, 'steps').entries()) {
    const path = `steps[${index}]`;
    const step = object(value, path);
    if (step.op === 'quote') {
      for (const value of array(step.items, `${path}.items`)) {
        validateItem(value, `${path}.item`);
      }
    } else if (step.op === 'claim') {
      integer(step.policy, `${path}.policy`);
      validateIncident(step.incident, `${path}.incident`);
    } else {
      throw new Error(`${path}.op must be quote or claim`);
    }
  }
  return input as Scenario;
}
