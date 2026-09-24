import { readFileSync } from 'node:fs';
import { type Item } from './catalogue.js';
import { createPolicy, settle, type Damage, type Policy } from './claim.js';
import { premium } from './premium.js';

type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

function run(input: Scenario) {
  const policies = new Map<number, Policy>();
  const results: ({ premium: number } | { payout: number; remainingCap: number })[] = [];
  for (const [index, step] of input.steps.entries()) {
    if (step.op === 'quote') {
      const amount = premium(step.items, input.customer.yearsWithMHPCO, policies.size);
      policies.set(index, createPolicy(step.items));
      results.push({ premium: amount });
    } else if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
      results.push(settle(policy, step.incident.damages));
    } else {
      throw new Error('Unknown operation');
    }
  }
  return { results };
}

try {
  const input = JSON.parse(readFileSync(0, 'utf8')) as Scenario;
  process.stdout.write(JSON.stringify(run(input)));
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
