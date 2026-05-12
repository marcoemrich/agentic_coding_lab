import { quote, claim } from "./claim-office.js";

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const chunks: Buffer[] = [];
process.stdin.on("data", (chunk: Buffer) => chunks.push(chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString());
    const customer = input.customer;
    const steps = input.steps as { op: string; items?: unknown[]; policy?: number; incident?: unknown }[];

    const results: unknown[] = [];
    const policies: { items: unknown[]; remainingCap: number }[] = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (step.op === "quote") {
        const items = step.items ?? [];
        const premium = quote(customer, items);
        const insuranceSum = (items as { type: string }[]).reduce(
          (sum, item) => sum + (INSURANCE_VALUE[item.type] ?? 0),
          0
        );
        policies[i] = { items, remainingCap: insuranceSum * 2 };
        results.push({ premium });
      } else if (step.op === "claim") {
        const policy = policies[step.policy!];
        const result = claim(policy, step.incident) as { payout: number; remainingCap: number };
        policy.remainingCap = result.remainingCap;
        results.push({ payout: result.payout, remainingCap: result.remainingCap });
      }
    }

    process.stdout.write(JSON.stringify({ results }) + "\n");
  } catch (err) {
    process.stderr.write(String(err) + "\n");
    process.exit(1);
  }
});
