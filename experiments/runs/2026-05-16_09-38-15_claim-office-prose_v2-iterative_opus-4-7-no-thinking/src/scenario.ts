import { processClaim } from "./claim.js";
import { computePremium, makePolicy } from "./quote.js";
import type {
  Policy,
  Scenario,
  ScenarioResult,
  StepResult,
} from "./types.js";

/**
 * Run a complete scenario, returning the result for each step.
 */
export function runScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let priorPolicyCount = 0;

  scenario.steps.forEach((step, idx) => {
    if (step.op === "quote") {
      const premium = computePremium(step.items, {
        customer: scenario.customer,
        priorPolicyCount,
      });
      const policy = makePolicy(step.items);
      policies.set(idx, policy);
      priorPolicyCount += 1;
      results.push({ premium });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim refers to unknown policy index ${step.policy}`);
      }
      const result = processClaim(policy, step.incident);
      results.push(result);
    }
  });

  return { results };
}
