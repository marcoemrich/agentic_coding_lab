import { Output, Scenario, StepResult } from "./types.js";
import { calculatePremium } from "./quote.js";
import { Policy, createPolicy, processClaim } from "./claim.js";

export * from "./types.js";

export function processScenario(scenario: Scenario): Output {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contractIndex = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      const premium = calculatePremium(step.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        contractIndex,
      });
      results.push({ premium });
      policies.set(i, createPolicy(step.items));
      contractIndex++;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references unknown policy index: ${step.policy}`);
      }
      results.push(processClaim(policy, step.incident));
    }
  }

  return { results };
}
