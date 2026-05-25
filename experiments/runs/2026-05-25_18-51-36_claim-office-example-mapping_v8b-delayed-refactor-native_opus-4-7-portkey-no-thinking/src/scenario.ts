import { Policy, Result, Scenario, ScenarioResult } from "./types.js";
import { computePremium } from "./premium.js";
import { processClaim, createPolicy } from "./claim.js";
import { insuranceSum, isKnownType } from "./items.js";

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: Result[] = [];
  const policies: Map<number, Policy> = new Map();
  let quoteCount = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      step.items.forEach((item) => assertKnownType(item.type, "item"));
      const premium = computePremium(scenario.customer, step.items, quoteCount > 0);
      results.push({ premium });
      policies.set(stepIndex, createPolicy(step.items, insuranceSum(step.items)));
      quoteCount += 1;
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error(`Claim references unknown policy index: ${step.policy}`);
    }
    step.incident.damages.forEach((d) => assertKnownType(d.itemType, "damage item"));
    results.push(processClaim(policy, step.incident.damages));
  });

  return { results };
}

function assertKnownType(type: string, label: string): void {
  if (!isKnownType(type)) {
    throw new Error(`Unknown ${label} type: ${type}`);
  }
}
