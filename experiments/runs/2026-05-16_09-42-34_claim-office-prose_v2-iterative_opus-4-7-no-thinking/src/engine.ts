import type {
  Policy,
  Scenario,
  ScenarioResult,
  StepResult,
} from "./types.js";
import { computePremium } from "./quote.js";
import { processClaim } from "./claim.js";
import { totalInsuranceSum } from "./pricing.js";

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  const policies: Map<number, Policy> = new Map();
  let contractCount = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = computePremium(scenario.customer, step.items, contractCount);
      const insuranceSum = totalInsuranceSum(step.items);
      policies.set(index, {
        items: step.items,
        insuranceSum,
        remainingCap: 2 * insuranceSum,
      });
      contractCount += 1;
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`No policy at step index ${step.policy}`);
      }
      const { payout, remainingCap } = processClaim(policy, step.incident);
      results.push({ payout, remainingCap });
    } else {
      throw new Error(`Unknown op: ${JSON.stringify(step)}`);
    }
  });

  return { results };
}
