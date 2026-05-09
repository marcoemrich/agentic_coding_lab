import { quote, createPolicy, claim } from "./claim-office.js";

const input = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { data += chunk; });
  process.stdin.on("end", () => resolve(data));
});

const scenario = JSON.parse(input) as {
  customer: { yearsWithMHPCO: number; contractCount: number };
  steps: Array<
    | { op: "quote"; items: unknown[] }
    | { op: "claim"; policy: number; incident: unknown }
  >;
};

const { customer, steps } = scenario;
const policies: unknown[] = [];
const results: unknown[] = [];

for (const step of steps) {
  if (step.op === "quote") {
    const premium = quote(customer, step.items);
    const policy = createPolicy(step.items);
    policies.push(policy);
    results.push({ premium });
  } else {
    const policy = policies[step.policy];
    const result = claim(policy, step.incident) as { payout: number; remainingCap: number };
    results.push({ payout: result.payout, remainingCap: result.remainingCap });
  }
}

process.stdout.write(JSON.stringify({ results }) + "\n");
