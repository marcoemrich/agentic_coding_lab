import type { Scenario, Result, Policy } from "./types.js";
import { quote } from "./quote.js";
import { claim } from "./claim.js";

/** Each policy's claim cap is twice its insurance sum. */
const POLICY_CAP_MULTIPLIER = 2;

export function processScenario(scenario: Scenario): { results: Result[] } {
  const policies: Policy[] = [];
  const results: Result[] = [];
  let quoteIndex = 0;

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const { premium, insuranceSum } = quote(step.items, scenario.customer, quoteIndex);
      const cap = POLICY_CAP_MULTIPLIER * insuranceSum;
      policies.push({
        items: [...step.items],
        insuranceSum,
        cap,
        remainingCap: cap,
      });
      results.push({ premium });
      quoteIndex += 1;
    } else {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Claim references missing policy index: ${step.policy}`);
      }
      const { payout, remainingCap } = claim(policy, step.incident.damages);
      policy.remainingCap = remainingCap;
      results.push({ payout, remainingCap });
    }
  }

  return { results };
}
