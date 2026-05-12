import { quote, claim } from "./claim-office.js";
import { createInterface } from "readline";

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

function insuranceSum(items: { type: string }[]): number {
  return items.reduce((sum, i) => sum + (INSURANCE_VALUE[i.type] ?? COMPONENT_INSURANCE_VALUE), 0);
}

async function main() {
  const rl = createInterface({ input: process.stdin });
  const lines: string[] = [];
  for await (const line of rl) lines.push(line);
  const input = JSON.parse(lines.join(""));

  const { customer, steps } = input;
  const results: unknown[] = [];
  const policies: { insuranceSum: number; remainingCap: number }[] = [];

  let contractNumber = 1;
  for (const step of steps) {
    if (step.op === "quote") {
      const premium = quote(customer, step.items, contractNumber);
      const sum = insuranceSum(step.items);
      policies.push({ insuranceSum: sum, remainingCap: sum * 2 });
      results.push({ premium });
      contractNumber++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      const result = claim(policy, step.incident);
      policy.remainingCap = result.remainingCap;
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    }
  }

  process.stdout.write(JSON.stringify({ results }) + "\n");
}

main();
