import { readFileSync } from "node:fs";
import { claimPayout, policyCap } from "./claims.js";
import { quotePremium } from "./premium.js";

interface QuoteStep {
  op: "quote";
  items: { type: string; cursed?: boolean; enchantment?: number }[];
}
interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: { itemType: string; amount: number }[] };
}

const scenario = JSON.parse(readFileSync(0, "utf-8"));
const yearsWithMHPCO: number = scenario.customer.yearsWithMHPCO;

const policies: { items: QuoteStep["items"]; remainingCap: number }[] = [];
let quoteCount = 0;
try {
  const results = scenario.steps.map((step: QuoteStep | ClaimStep) => {
    if (step.op === "quote") {
      const followUp = quoteCount > 0;
      quoteCount += 1;
      policies.push({ items: step.items, remainingCap: policyCap(step.items) });
      return { premium: quotePremium(step.items, yearsWithMHPCO, followUp) };
    }
    const policy = policies[step.policy];
    const payout = Math.floor(
      Math.min(claimPayout(policy.items, step.incident.damages), policy.remainingCap),
    );
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  process.stdout.write(JSON.stringify({ results }));
} catch (error) {
  process.stderr.write(String(error));
  process.exit(1);
}
