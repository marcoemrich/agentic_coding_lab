import { quote, claim } from "./claim-office.js";
import type { Item, Policy, Incident } from "./claim-office.js";

type QuoteStep = {
  op: "quote";
  items: Item[];
};

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: Incident;
};

type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

const input = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { data += chunk; });
  process.stdin.on("end", () => resolve(data));
});

const scenario: Scenario = JSON.parse(input);
const { customer, steps } = scenario;

const policies: Policy[] = [];
const caps: number[] = [];
const results: unknown[] = [];

let previousQuotes = 0;

for (const step of steps) {
  if (step.op === "quote") {
    const premium = quote(customer, step.items, previousQuotes);
    previousQuotes++;
    const policy: Policy = { items: step.items };
    const insuranceSum = step.items.reduce((sum, item) => {
      const VALUES: Record<string, number> = {
        sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250,
      };
      return sum + (VALUES[item.type] ?? 0);
    }, 0);
    policies.push(policy);
    caps.push(insuranceSum * 2);
    results.push({ premium });
  } else {
    const policy = policies[step.policy];
    const cap = caps[step.policy];
    const { payout, remainingCap } = claim(policy, step.incident, cap);
    caps[step.policy] = remainingCap;
    results.push({ payout, remainingCap });
  }
}

process.stdout.write(JSON.stringify({ results }) + "\n");
