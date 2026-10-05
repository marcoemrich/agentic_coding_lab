import type { Scenario } from './office';

function object(value: unknown, name: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${name} must be an object`);
  }
  return value as Record<string, unknown>;
}

function array(value: unknown, name: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${name} must be an array`);
  return value;
}

function field(value: unknown, kind: 'string' | 'integer' | 'boolean', name: string): void {
  const valid = kind === 'integer' ? Number.isInteger(value) : typeof value === kind;
  if (!valid) throw new Error(`${name} must be ${kind}`);
}

function validateItems(input: unknown): void {
  for (const entry of array(input, 'Items')) {
    const item = object(entry, 'Item');
    field(item.type, 'string', 'Item type');
    if ('material' in item) field(item.material, 'string', 'Material');
    if ('enchantment' in item) field(item.enchantment, 'integer', 'Enchantment');
    if ('cursed' in item) field(item.cursed, 'boolean', 'Cursed');
  }
}

function validateClaim(step: Record<string, unknown>): void {
  field(step.policy, 'integer', 'Policy');
  const incident = object(step.incident, 'Incident');
  field(incident.cause, 'string', 'Cause');
  for (const entry of array(incident.damages, 'Damages')) {
    const damage = object(entry, 'Damage');
    field(damage.itemType, 'string', 'Damage item type');
    field(damage.amount, 'integer', 'Damage amount');
  }
}

/** Validate the JSON boundary before processing any operations. */
export function validateScenario(input: unknown): asserts input is Scenario {
  const scenario = object(input, 'Scenario');
  const customer = object(scenario.customer, 'Customer');
  field(customer.yearsWithMHPCO, 'integer', 'yearsWithMHPCO');
  for (const entry of array(scenario.steps, 'Steps')) {
    const step = object(entry, 'Step');
    if (step.op === 'quote') {
      validateItems(step.items);
    } else if (step.op === 'claim') {
      validateClaim(step);
    } else {
      throw new Error(`Unknown operation: ${step.op}`);
    }
  }
}
