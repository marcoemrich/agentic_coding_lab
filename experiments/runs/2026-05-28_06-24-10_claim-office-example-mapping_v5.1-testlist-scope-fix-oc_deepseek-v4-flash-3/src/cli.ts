#!/usr/bin/env node
import { processQuote, processClaim } from "./claim-office.js";

function main(): void {
  let data = "";
  process.stdin.setEncoding("utf-8");

  process.stdin.on("data", (chunk: string) => {
    data += chunk;
  });

  process.stdin.on("end", () => {
    try {
      const parsed = JSON.parse(data);
      const customer = parsed.customer;
      const steps = parsed.steps;

      const policies: { items: { type: string; material?: string; enchantment?: number; cursed?: boolean }[]; insuranceSum: number; totalPayouts: number }[] = [];
      const results: Record<string, unknown>[] = [];

      for (const step of steps) {
        if (step.op === "quote") {
          const result = processQuote({
            items: step.items,
            customer,
            contractCount: policies.length,
          });
          policies.push({ items: step.items, insuranceSum: result.insuranceSum, totalPayouts: 0 });
          results.push({ premium: result.premium });
        } else if (step.op === "claim") {
          const policy = policies[step.policy];
          if (!policy) {
            throw new Error(`Policy index ${step.policy} not found`);
          }
          const claimResult = processClaim({
            policyItems: policy.items,
            damages: step.incident.damages,
            previousPayouts: policy.totalPayouts,
            insuranceSum: policy.insuranceSum,
          });
          policy.totalPayouts += claimResult.payout;
          results.push({ payout: claimResult.payout, remainingCap: claimResult.remainingCap });
        }
      }

      process.stdout.write(JSON.stringify({ results }) + "\n");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      process.stderr.write(message + "\n");
      process.exit(1);
    }
  });
}

main();