import type {
  Scenario,
  ScenarioOutput,
  StepResult,
  Policy,
  QuoteStep,
  ClaimStep,
} from "./types.js";
import { computePremium, totalInsuranceSum } from "./pricing.js";
import { processClaim } from "./claims.js";

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contractIndex = 0;

  scenario.steps.forEach((step, idx) => {
    if (step.op === "quote") {
      const q = step as QuoteStep;
      const premium = computePremium(q.items, {
        customer: scenario.customer,
        contractIndex,
      });
      const insuranceSum = totalInsuranceSum(q.items);
      const policy: Policy = {
        items: q.items,
        insuranceSum,
        cap: 2 * insuranceSum,
        paidOut: 0,
      };
      policies.set(idx, policy);
      contractIndex += 1;
      results.push({ premium });
    } else if (step.op === "claim") {
      const c = step as ClaimStep;
      const policy = policies.get(c.policy);
      if (!policy) {
        throw new Error(`No policy at step index ${c.policy}`);
      }
      const outcome = processClaim(policy, c.incident);
      results.push(outcome);
    } else {
      throw new Error(`Unknown op at step ${idx}`);
    }
  });

  return { results };
}
