import { quote, claim } from "./claim-office.js";

const input = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { data += chunk; });
  process.stdin.on("end", () => resolve(data));
});

const scenario = JSON.parse(input);
const { customer, steps } = scenario;

const policies: Array<{ insuranceSum: number; remainingCap: number }> = [];
const results: unknown[] = [];

let contractNumber = 0;

for (const step of steps) {
  if (step.op === "quote") {
    contractNumber += 1;
    const premium = quote(customer, step.items, { contractNumber });
    const insuranceSum = step.items.reduce((sum: number, item: { type: string }) => {
      const values: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400 };
      return sum + (values[item.type] ?? 250);
    }, 0);
    policies.push({ insuranceSum, remainingCap: insuranceSum * 2 });
    results.push({ premium });
  } else if (step.op === "claim") {
    const policy = policies[step.policy];
    const result = claim(policy, step.incident);
    policy.remainingCap = result.remainingCap;
    results.push({ payout: result.payout, remainingCap: result.remainingCap });
  }
}

process.stdout.write(JSON.stringify({ results }) + "\n");
