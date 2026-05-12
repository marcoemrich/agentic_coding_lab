import { quote, claim } from "./claim-office.js";
import type { Customer, Item, Policy, Incident } from "./claim-office.js";

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

const itemInsuranceValue = (type: string): number =>
  INSURANCE_VALUES[type] ?? COMPONENT_INSURANCE_VALUE;

async function main(): Promise<void> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  const input = JSON.parse(Buffer.concat(chunks).toString());

  const customer: Customer = input.customer;
  const steps: unknown[] = input.steps;
  const results: unknown[] = [];
  const policies: Policy[] = [];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i] as Record<string, unknown>;

    if (step.op === "quote") {
      const items = step.items as Item[];
      const isFirstInsurance = step.isFirstInsurance !== false;
      const premium = quote(customer, items, { isFirstInsurance });
      const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item.type), 0);
      policies[i] = { insuranceSum, remainingCap: 2 * insuranceSum };
      results.push({ premium });
    } else if (step.op === "claim") {
      const policyIndex = step.policy as number;
      const policy = policies[policyIndex];
      const incident = step.incident as Incident;
      const { payout, remainingCap } = claim(policy, incident);
      policies[policyIndex] = { ...policy, remainingCap };
      results.push({ payout, remainingCap });
    }
  }

  process.stdout.write(JSON.stringify({ results }) + "\n");
}

main();
