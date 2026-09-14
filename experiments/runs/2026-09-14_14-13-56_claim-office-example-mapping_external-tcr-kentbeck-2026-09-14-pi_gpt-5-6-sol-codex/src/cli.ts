#!/usr/bin/env -S node --import tsx
import { processScenario, type ClaimStep, type Item, type QuoteStep, type Scenario } from './claim-office';

function requireObject(value: unknown, description: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${description} must be an object`);
  }
  return value as Record<string, unknown>;
}

function parseItem(value: unknown): Item {
  const item = requireObject(value, 'item');
  if (typeof item.type !== 'string') throw new Error('item type must be a string');
  if (item.enchantment !== undefined && !Number.isInteger(item.enchantment)) {
    throw new Error('item enchantment must be an integer');
  }
  if (item.cursed !== undefined && typeof item.cursed !== 'boolean') {
    throw new Error('item cursed must be a boolean');
  }
  if (item.material !== undefined && typeof item.material !== 'string') {
    throw new Error('item material must be a string');
  }
  return item as unknown as Item;
}

function parseQuote(value: Record<string, unknown>): QuoteStep {
  if (!Array.isArray(value.items)) throw new Error('quote items must be an array');
  return { op: 'quote', items: value.items.map(parseItem) };
}

function parseClaim(value: Record<string, unknown>): ClaimStep {
  if (!Number.isInteger(value.policy)) throw new Error('claim policy must be an integer');
  const incident = requireObject(value.incident, 'claim incident');
  if (typeof incident.cause !== 'string' || !Array.isArray(incident.damages)) {
    throw new Error('claim incident must have a cause and damages');
  }
  const damages = incident.damages.map(entry => {
    const damage = requireObject(entry, 'damage');
    if (typeof damage.itemType !== 'string' || !Number.isInteger(damage.amount)) {
      throw new Error('damage must have an itemType and integer amount');
    }
    return { itemType: damage.itemType, amount: damage.amount as number };
  });
  return { op: 'claim', policy: value.policy as number, incident: { cause: incident.cause, damages } };
}

function parseScenario(value: unknown): Scenario {
  const root = requireObject(value, 'scenario');
  const customer = requireObject(root.customer, 'customer');
  if (!Number.isInteger(customer.yearsWithMHPCO)) throw new Error('yearsWithMHPCO must be an integer');
  if (!Array.isArray(root.steps)) throw new Error('steps must be an array');
  const steps = root.steps.map(entry => {
    const step = requireObject(entry, 'step');
    if (step.op === 'quote') return parseQuote(step);
    if (step.op === 'claim') return parseClaim(step);
    throw new Error(`Unknown operation: ${String(step.op)}`);
  });
  return { customer: { yearsWithMHPCO: customer.yearsWithMHPCO as number }, steps };
}

async function main(): Promise<void> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  const scenario = parseScenario(JSON.parse(Buffer.concat(chunks).toString('utf8')));
  process.stdout.write(`${JSON.stringify(processScenario(scenario))}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`claim-office: ${message}\n`);
  process.exitCode = 1;
});
