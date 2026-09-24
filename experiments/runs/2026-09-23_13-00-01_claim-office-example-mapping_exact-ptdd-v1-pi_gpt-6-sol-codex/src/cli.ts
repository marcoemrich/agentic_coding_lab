import { readFileSync } from 'node:fs';
import { premium } from './quote.js';
import { createPolicy, settle, type Damage, type Item, type Policy } from './claim.js';

type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
const input = JSON.parse(readFileSync(0, 'utf8')) as { customer: { yearsWithMHPCO: number }; steps: Step[] };
const policies = new Map<number, Policy>();
const results: object[] = [];
let quoteCount = 0;

input.steps.forEach((step, index) => {
  if (step.op === 'quote') {
    const price = premium(step.items, quoteCount++, input.customer.yearsWithMHPCO);
    policies.set(index, createPolicy(step.items));
    results.push({ premium: price });
  } else {
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
    results.push(settle(policy, step.incident.damages));
  }
});
console.log(JSON.stringify({ results }));
