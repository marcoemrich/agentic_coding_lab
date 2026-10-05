import type { Scenario } from './office';

type RecordValue = Record<string, unknown>;
function object(value: unknown, path: string): RecordValue {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
  return value as RecordValue;
}
function array(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${path} must be an array`);
  return value;
}
function field(value: unknown, kind: 'string' | 'boolean' | 'integer', path: string): void {
  if (kind === 'integer' ? !Number.isSafeInteger(value) : typeof value !== kind) {
    throw new Error(`${path} must be ${kind}`);
  }
}

function validateItems(value: unknown, path: string): void {
  array(value, path).forEach((value, index) => {
    const itemPath = `${path}[${index}]`;
    const item = object(value, itemPath);
    field(item.type, 'string', `${itemPath}.type`);
    for (const [name, kind] of [
      ['material', 'string'], ['enchantment', 'integer'], ['cursed', 'boolean'],
    ] as const) {
      if (Object.hasOwn(item, name)) field(item[name], kind, `${itemPath}.${name}`);
    }
  });
}

function validateIncident(value: unknown, path: string): void {
  const incident = object(value, path);
  field(incident.cause, 'string', `${path}.cause`);
  const damagePath = `${path}.damages`;
  array(incident.damages, damagePath).forEach((value, index) => {
    const entryPath = `${damagePath}[${index}]`;
    const damage = object(value, entryPath);
    field(damage.itemType, 'string', `${entryPath}.itemType`);
    field(damage.amount, 'integer', `${entryPath}.amount`);
  });
}

export function validateScenario(input: unknown): asserts input is Scenario {
  const scenario = object(input, 'scenario');
  const customer = object(scenario.customer, 'customer');
  field(customer.yearsWithMHPCO, 'integer', 'customer.yearsWithMHPCO');
  array(scenario.steps, 'steps').forEach((value, index) => {
    const path = `steps[${index}]`;
    const step = object(value, path);
    if (step.op === 'quote') {
      validateItems(step.items, `${path}.items`);
    } else if (step.op === 'claim') {
      field(step.policy, 'integer', `${path}.policy`);
      validateIncident(step.incident, `${path}.incident`);
    } else {
      throw new Error(`${path}.op must be quote or claim`);
    }
  });
}
