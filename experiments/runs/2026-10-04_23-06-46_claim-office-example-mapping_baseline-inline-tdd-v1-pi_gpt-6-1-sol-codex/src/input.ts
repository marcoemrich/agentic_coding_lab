import type { Scenario } from './office';

function object(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
  return value as Record<string, unknown>;
}

function array(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${path} must be an array`);
  return value;
}

function field(value: unknown, kind: 'string' | 'boolean' | 'integer', path: string): void {
  const valid = kind === 'integer' ? Number.isInteger(value) : typeof value === kind;
  if (!valid) throw new Error(`${path} must be ${kind}`);
}

export function validateScenario(value: unknown): asserts value is Scenario {
  const scenario = object(value, 'scenario');
  const customer = object(scenario.customer, 'customer');
  field(customer.yearsWithMHPCO, 'integer', 'customer.yearsWithMHPCO');
  for (const [index, raw] of array(scenario.steps, 'steps').entries()) {
    const path = `steps[${index}]`;
    const step = object(raw, path);
    if (step.op === 'quote') {
      for (const rawItem of array(step.items, `${path}.items`)) {
        const item = object(rawItem, 'item');
        field(item.type, 'string', 'item.type');
        for (const [key, kind] of [['material', 'string'], ['enchantment', 'integer'], ['cursed', 'boolean']] as const) {
          if (key in item) field(item[key], kind, `item.${key}`);
        }
      }
    } else if (step.op === 'claim') {
      field(step.policy, 'integer', `${path}.policy`);
      const incident = object(step.incident, `${path}.incident`);
      field(incident.cause, 'string', 'incident.cause');
      for (const rawDamage of array(incident.damages, 'incident.damages')) {
        const damage = object(rawDamage, 'damage');
        field(damage.itemType, 'string', 'damage.itemType');
        field(damage.amount, 'integer', 'damage.amount');
      }
    } else {
      throw new Error(`${path}.op must be quote or claim`);
    }
  }
}
