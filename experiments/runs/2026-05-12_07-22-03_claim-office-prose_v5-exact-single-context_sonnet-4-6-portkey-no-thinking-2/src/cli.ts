import { quote, claim } from "./claim-office.js";

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  component: 250,
};

const stdinText = await new Promise<string>((resolve) => {
  const chunks: Buffer[] = [];
  process.stdin.on("data", (chunk) => chunks.push(chunk));
  process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
});

const scenario = JSON.parse(stdinText);
const customer = scenario.customer;
const steps = scenario.steps;

const results: unknown[] = [];
const policies: { insuranceSum: number; remainingCap: number }[] = [];
let contractCount = 0;

for (const step of steps) {
  if (step.op === "quote") {
    const items = step.items;
    const premium = quote({ yearsWithMHPCO: customer.yearsWithMHPCO, contractCount }, items);
    const insuranceSum = items.reduce((sum: number, item: { type: string }) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
    policies.push({ insuranceSum, remainingCap: insuranceSum * 2 });
    contractCount++;
    results.push({ premium });
  } else if (step.op === "claim") {
    const policy = policies[step.policy];
    const incident = {
      damages: step.incident.damages.map((d: { amount: number; enchantment?: number; material?: string }) => ({
        amount: d.amount,
        enchantment: d.enchantment ?? 0,
        material: d.material ?? "",
      })),
    };
    const result = claim(policy, incident);
    policy.remainingCap = result.remainingCap;
    results.push({ payout: result.payout, remainingCap: result.remainingCap });
  }
}

process.stdout.write(JSON.stringify({ results }) + "\n");
