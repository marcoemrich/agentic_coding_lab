import { ClaimOfficeError, type Scenario, type Step } from './types.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function checkQuoteStep(raw: Record<string, unknown>, index: number): void {
  if (!Array.isArray(raw.items)) {
    throw new ClaimOfficeError(`quote step ${index} is missing an items array`);
  }
  const malformed = raw.items.some((item) => !isRecord(item) || typeof item.type !== 'string');
  if (malformed) {
    throw new ClaimOfficeError(`quote step ${index} contains an item without a type`);
  }
}

function isDamage(damage: unknown): boolean {
  return isRecord(damage) && typeof damage.itemType === 'string' && typeof damage.amount === 'number';
}

function checkClaimStep(raw: Record<string, unknown>, index: number): void {
  if (typeof raw.policy !== 'number') {
    throw new ClaimOfficeError(`claim step ${index} is missing a policy index`);
  }
  const incident = raw.incident;
  if (!isRecord(incident) || !Array.isArray(incident.damages)) {
    throw new ClaimOfficeError(`claim step ${index} is missing an incident with damages`);
  }
  if (!incident.damages.every(isDamage)) {
    throw new ClaimOfficeError(`claim step ${index} contains a malformed damage entry`);
  }
}

function parseStep(raw: unknown, index: number): Step {
  if (!isRecord(raw)) {
    throw new ClaimOfficeError(`step ${index} is not an object`);
  }
  if (raw.op === 'quote') {
    checkQuoteStep(raw, index);
  } else if (raw.op === 'claim') {
    checkClaimStep(raw, index);
  } else {
    throw new ClaimOfficeError(`step ${index} has an unknown op: ${String(raw.op)}`);
  }
  return raw as unknown as Step;
}

/** Parses and validates a scenario document read from stdin. */
export function parseScenario(input: string): Scenario {
  let document: unknown;
  try {
    document = JSON.parse(input);
  } catch (error) {
    throw new ClaimOfficeError(`input is not valid JSON: ${(error as Error).message}`);
  }

  if (!isRecord(document)) {
    throw new ClaimOfficeError('input must be a JSON object');
  }
  if (!isRecord(document.customer) || typeof document.customer.yearsWithMHPCO !== 'number') {
    throw new ClaimOfficeError('input is missing a customer with yearsWithMHPCO');
  }
  if (!Array.isArray(document.steps)) {
    throw new ClaimOfficeError('input is missing a steps array');
  }

  return {
    customer: { yearsWithMHPCO: document.customer.yearsWithMHPCO },
    steps: document.steps.map(parseStep),
  };
}
