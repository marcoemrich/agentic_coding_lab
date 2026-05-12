import { quote, claim } from "./claim-office.js";

const input = JSON.parse(await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { data += chunk; });
  process.stdin.on("end", () => resolve(data));
}));

const { customer, steps } = input as {
  customer: unknown;
  steps: Array<{ op: string; items?: unknown[]; policy?: number; incident?: unknown }>;
};

const policies: ReturnType<typeof quote>[] = [];
const results: unknown[] = [];

for (const step of steps) {
  if (step.op === "quote") {
    const policy = quote(customer, step.items ?? []);
    policies.push(policy);
    results.push({ premium: policy.premium });
  } else if (step.op === "claim") {
    const policy = policies[step.policy!];
    const result = claim(policy, step.incident) as { payout: number; remainingCap: number };
    policies[step.policy!] = { ...policy, remainingCap: result.remainingCap };
    results.push({ payout: result.payout, remainingCap: result.remainingCap });
  }
}

process.stdout.write(JSON.stringify({ results }) + "\n");
