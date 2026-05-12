import { quote, claim } from "./claim-office.js";
import type { Item, Policy } from "./claim-office.js";

type QuoteStep = {
  op: "quote";
  items: Item[];
};

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: { itemType: string; amount: number }[] };
};

type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number; contractCount?: number };
  steps: Step[];
};

const run = (): void => {
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", chunk => { input += chunk; });
  process.stdin.on("end", () => {
    try {
      const scenario: Scenario = JSON.parse(input);
      const customer = {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        contractCount: scenario.customer.contractCount ?? 0,
      };
      const results: unknown[] = [];
      const policies: Policy[] = [];

      for (const step of scenario.steps) {
        if (step.op === "quote") {
          const premium = quote({ items: step.items, customer });
          const insuranceSum = step.items.reduce((sum, item) => {
            const values: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250 };
            return sum + (values[item.type] ?? 0);
          }, 0);
          policies.push({ items: step.items, insuranceSum, remainingCap: insuranceSum * 2 });
          results.push({ premium });
        } else if (step.op === "claim") {
          const policy = policies[step.policy];
          const result = claim({ policy, incident: step.incident });
          policy.remainingCap = result.remainingCap;
          results.push({ payout: result.payout, remainingCap: result.remainingCap });
        }
      }

      process.stdout.write(JSON.stringify({ results }) + "\n");
    } catch (err) {
      process.stderr.write((err instanceof Error ? err.message : String(err)) + "\n");
      process.exit(1);
    }
  });
};

run();
