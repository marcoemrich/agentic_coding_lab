#!/usr/bin/env tsx
import { quote, claim } from "./claim-office.js";

const INSURANCE_SUM: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  component: 250,
};

type Item = { type: string; material: string; enchantment: number };
type Policy = { insuranceSum: number; remainingCap: number; items: Item[] };

const chunks: Buffer[] = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const { customer, steps } = JSON.parse(Buffer.concat(chunks).toString());

const policies: Record<number, Policy> = {};
const results: unknown[] = [];
let quoteCount = 0;

for (let i = 0; i < steps.length; i++) {
  const step = steps[i];
  if (step.op === "quote") {
    quoteCount++;
    const premium = quote(customer, step.items, quoteCount);
    const insuranceSum = step.items.reduce(
      (s: number, item: { type: string }) => s + (INSURANCE_SUM[item.type] ?? 0),
      0
    );
    policies[i] = { insuranceSum, remainingCap: insuranceSum * 2, items: step.items };
    results.push({ premium });
  } else {
    const policy = policies[step.policy];
    const result = claim(policy, step.incident);
    policy.remainingCap = result.remainingCap;
    results.push({ payout: result.payout, remainingCap: result.remainingCap });
  }
}

process.stdout.write(JSON.stringify({ results }) + "\n");
