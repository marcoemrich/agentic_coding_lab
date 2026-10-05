import type { Scenario } from './office';

function object(value: unknown, name: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${name} must be an object`);
  return value as Record<string, unknown>;
}
function array(value: unknown, name: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${name} must be an array`);
  return value;
}
function integer(value: unknown, name: string): void {
  if (!Number.isInteger(value)) throw new Error(`${name} must be an integer`);
}
function string(value: unknown, name: string): void {
  if (typeof value !== 'string') throw new Error(`${name} must be a string`);
}

function validateItem(value: unknown): void {
  const item = object(value, 'item');
  string(item.type, 'item type');
  if (item.material !== undefined) string(item.material, 'material');
  if (item.enchantment !== undefined) integer(item.enchantment, 'enchantment');
  if (item.cursed !== undefined && typeof item.cursed !== 'boolean') throw new Error('cursed must be a boolean');
}

function validateDamage(value: unknown): void {
  const damage = object(value, 'damage');
  string(damage.itemType, 'itemType');
  integer(damage.amount, 'damage amount');
  if ((damage.amount as number) < 0) throw new Error('Damage amount must be non-negative');
}

function validateStep(value: unknown): void {
  const step = object(value, 'step');
  if (step.op === 'quote') {
    array(step.items, 'items').forEach(validateItem);
  } else if (step.op === 'claim') {
    integer(step.policy, 'policy');
    const incident = object(step.incident, 'incident');
    string(incident.cause, 'cause');
    array(incident.damages, 'damages').forEach(validateDamage);
  } else {
    throw new Error(`Unknown operation: ${String(step.op)}`);
  }
}

export function validateScenario(value: unknown): asserts value is Scenario {
  const scenario = object(value, 'scenario');
  const customer = object(scenario.customer, 'customer');
  integer(customer.yearsWithMHPCO, 'yearsWithMHPCO');
  array(scenario.steps, 'steps').forEach(validateStep);
}
