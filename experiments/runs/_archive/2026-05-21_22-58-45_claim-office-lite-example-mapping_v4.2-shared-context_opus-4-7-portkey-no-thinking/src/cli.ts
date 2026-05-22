import { quote, claim } from "./claim-office.js";
import { readFileSync } from "node:fs";

const stdinText = readFileSync(0, "utf8");
const scenario = JSON.parse(stdinText);
const customer = scenario.customer;
const steps = scenario.steps;
const policies: { items: unknown[] }[] = [];
const results: ({ premium: number } | { payout: number })[] = [];
try {
  for (const step of steps) {
    if (step.op === "quote") {
      const previousQuoteCount = policies.length;
      const premium = quote({ customer, items: step.items, previousQuoteCount });
      results.push({ premium });
      policies.push({ items: step.items });
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      const payout = claim({
        policy: { items: policy.items as { type: string; material?: string; enchantment?: number }[] },
        incident: step.incident,
      });
      results.push({ payout });
    }
  }
} catch (error) {
  process.stderr.write(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
process.stdout.write(JSON.stringify({ results }));
