import { Scenario, Step } from './scenario.js';
import { Item } from './premium.js';
import { Damage } from './policy.js';
import { ClaimError } from './errors.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, what: string): Record<string, unknown> {
  if (!isRecord(value)) throw new ClaimError(`${what} must be an object`);
  return value;
}

function parseItem(value: unknown, what: string): Item {
  const record = requireRecord(value, what);
  if (typeof record.type !== 'string') {
    throw new ClaimError(`${what}: "type" must be a string`);
  }
  return record as unknown as Item;
}

function parseQuoteStep(record: Record<string, unknown>, index: number): Step {
  if (!Array.isArray(record.items)) {
    throw new ClaimError(`step ${index}: "items" must be an array`);
  }
  return {
    op: 'quote',
    items: record.items.map((item, i) =>
      parseItem(item, `step ${index}, item ${i}`),
    ),
  };
}

function parseDamage(value: unknown, what: string): Damage {
  const entry = requireRecord(value, what);
  if (typeof entry.itemType !== 'string') {
    throw new ClaimError(`${what}: "itemType" must be a string`);
  }
  if (typeof entry.amount !== 'number') {
    throw new ClaimError(`${what}: "amount" must be a number`);
  }
  return { itemType: entry.itemType, amount: entry.amount };
}

function parseClaimStep(record: Record<string, unknown>, index: number): Step {
  if (typeof record.policy !== 'number') {
    throw new ClaimError(`step ${index}: "policy" must be an integer`);
  }
  const incident = requireRecord(record.incident, `step ${index} incident`);
  if (!Array.isArray(incident.damages)) {
    throw new ClaimError(`step ${index}: "damages" must be an array`);
  }
  return {
    op: 'claim',
    policy: record.policy,
    incident: {
      cause: typeof incident.cause === 'string' ? incident.cause : '',
      damages: incident.damages.map((damage, i) =>
        parseDamage(damage, `step ${index}, damage ${i}`),
      ),
    },
  };
}

function parseStep(value: unknown, index: number): Step {
  const record = requireRecord(value, `step ${index}`);
  if (record.op === 'quote') return parseQuoteStep(record, index);
  if (record.op === 'claim') return parseClaimStep(record, index);
  throw new ClaimError(`step ${index}: unknown op ${String(record.op)}`);
}

/** Parses and validates a scenario document; throws on anything malformed. */
export function parseScenario(input: string): Scenario {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (error) {
    throw new ClaimError(
      `invalid JSON input: ${error instanceof Error ? error.message : error}`,
    );
  }

  const document = requireRecord(parsed, 'input');
  const customer = requireRecord(document.customer, '"customer"');
  if (typeof customer.yearsWithMHPCO !== 'number') {
    throw new ClaimError('"customer.yearsWithMHPCO" must be an integer');
  }
  if (!Array.isArray(document.steps)) {
    throw new ClaimError('"steps" must be an array');
  }

  return {
    customer: { yearsWithMHPCO: customer.yearsWithMHPCO },
    steps: document.steps.map(parseStep),
  };
}
