import { quote, claim } from "./claim-office.js";
import type { Customer, Item, Policy, Incident } from "./claim-office.js";

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: Customer & { contractCount?: number };
  steps: Step[];
};

const input = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.on("data", (chunk) => { data += chunk; });
  process.stdin.on("end", () => resolve(data));
});

const scenario: Scenario = JSON.parse(input);
const customer: Customer = {
  yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
  contractCount: scenario.customer.contractCount ?? 0,
};

const policies: Policy[] = [];
const results: unknown[] = [];

for (const step of scenario.steps) {
  if (step.op === "quote") {
    const premium = quote(customer, step.items);
    const insuranceSum = step.items.reduce((sum, item) => {
      const itemSums: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, rune: 250 };
      return sum + (itemSums[item.type] ?? 0);
    }, 0);
    policies.push({ insuranceSum, cap: insuranceSum * 2, remainingCap: insuranceSum * 2 });
    results.push({ premium });
    customer.contractCount++;
  } else {
    const policy = policies[step.policy];
    const { payout, remainingCap } = claim(policy, step.incident);
    policy.remainingCap = remainingCap;
    results.push({ payout, remainingCap });
  }
}

process.stdout.write(JSON.stringify({ results }) + "\n");
