import { quote, claim } from "./claim-office.js";

const input = await new Promise<string>((resolve) => {
  const chunks: Buffer[] = [];
  process.stdin.on("data", (chunk) => chunks.push(chunk));
  process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString()));
});

const scenario = JSON.parse(input);
const { customer, steps } = scenario;

const policies: { insuranceSum: number }[] = [];
const capRemaining: number[] = [];
const results: unknown[] = [];

for (const step of steps) {
  if (step.op === "quote") {
    const priorContracts = policies.length;
    const premium = quote(customer, step.items, priorContracts);
    const insuranceSum = step.items.reduce((sum: number, item: { type: string }) => {
      const values: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
      return sum + (values[item.type] ?? 0);
    }, 0);
    policies.push({ insuranceSum });
    capRemaining.push(2 * insuranceSum);
    results.push({ premium });
  } else if (step.op === "claim") {
    const policyIndex = step.policy;
    const policy = policies[policyIndex];
    const currentCap = capRemaining[policyIndex];
    const result = claim(policy, step.incident, currentCap);
    capRemaining[policyIndex] = result.remainingCap;
    results.push({ payout: result.payout, remainingCap: result.remainingCap });
  }
}

process.stdout.write(JSON.stringify({ results }) + "\n");
