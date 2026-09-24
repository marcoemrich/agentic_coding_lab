import { readFileSync } from 'node:fs';
import { premium, type Item } from './quote.js';
import { claim } from './claim.js';

type Step = { op: string; items: Item[]; policy: number; incident: { damages: { itemType: string; amount: number }[] } };
const input = JSON.parse(readFileSync(0, 'utf8')) as { steps: Step[]; customer: { yearsWithMHPCO: number } };
const paid = new Map<number, number>();
let quotes = 0;
const results = input.steps.map((step, index) => {
  if (step.op === 'claim') {
    const result = claim(input.steps[step.policy].items, step.incident.damages, paid.get(step.policy) ?? 0);
    paid.set(step.policy, (paid.get(step.policy) ?? 0) + result.payout);
    return result;
  }
  const result = { premium: premium(step.items, input.customer.yearsWithMHPCO, quotes > 0) };
  quotes += 1;
  return result;
});
process.stdout.write(JSON.stringify({ results }));
