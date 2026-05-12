import { quote, claim } from "./claim-office.js";

const input = JSON.parse(await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.on("data", (chunk) => { data += chunk; });
  process.stdin.on("end", () => resolve(data));
}));

const { customer, steps } = input as {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: string; items?: unknown[]; contractNumber?: number; policy?: number; incident?: unknown }>;
};

const policies: Array<{ items: unknown[]; insuranceSum: number; remainingCap: number }> = [];
const results: unknown[] = [];

for (let i = 0; i < steps.length; i++) {
  const step = steps[i];
  if (step.op === "quote") {
    const items = step.items!;
    const contractNumber = policies.length + 1;
    const premium = quote(items, customer, contractNumber);
    const insuranceSum = (items as Array<{ type: string }>).length === 3
      ? 750
      : (() => {
        const insuranceSums: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250 };
        return insuranceSums[(items as Array<{ type: string }>)[0].type] ?? 250;
      })();
    policies[i] = { items, insuranceSum, remainingCap: insuranceSum * 2 };
    results.push({ premium });
  } else if (step.op === "claim") {
    const policy = policies[step.policy!];
    const result = claim(policy, step.incident) as { payout: number; remainingCap: number };
    policy.remainingCap = result.remainingCap;
    results.push({ payout: result.payout, remainingCap: result.remainingCap });
  }
}

process.stdout.write(JSON.stringify({ results }) + "\n");
