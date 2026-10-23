import { readFileSync } from "node:fs";
import { quotePremium, type Item } from "./premium.js";
import { createPolicy, processClaim, type Damage, type Policy } from "./claims.js";
import { isKnownItemType } from "./catalogue.js";

interface Step {
  op: "quote" | "claim";
  items?: Item[];
  policy?: number;
  incident?: { cause: string; damages: Damage[] };
}

function main(): void {
  const input = readFileSync(0, "utf-8");
  const scenario = JSON.parse(input);
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step: Step, index: number) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      for (const item of items) {
        if (!isKnownItemType(item.type)) {
          throw new Error(`unknown item type: ${item.type}`);
        }
      }
      policies.set(index, createPolicy(items));
      return {
        premium: quotePremium(
          items,
          scenario.customer.yearsWithMHPCO,
          index > 0,
        ),
      };
    }
    const policy = policies.get(step.policy ?? -1);
    if (policy === undefined || step.incident === undefined) {
      throw new Error(`claim references unknown policy ${step.policy}`);
    }
    const payout = processClaim(policy, step.incident.damages);
    return { payout, remainingCap: policy.remainingCap };
  });
  process.stdout.write(JSON.stringify({ results }));
}

try {
  main();
} catch (error) {
  process.stderr.write(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
