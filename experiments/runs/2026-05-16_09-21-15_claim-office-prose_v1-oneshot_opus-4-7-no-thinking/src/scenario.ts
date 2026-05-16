import type {
  Scenario,
  ScenarioResult,
  StepResult,
  Policy,
} from "./types.js";
import { computePremium } from "./quote.js";
import { processClaim } from "./claim.js";
import { totalInsurance } from "./pricing.js";

const PAYOUT_CAP_MULTIPLIER = 2;

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();

  // Number of contracts the customer already had before this scenario.
  let priorContracts = scenario.customer.priorContracts ?? 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = computePremium(scenario.customer, step.items, {
        priorContracts,
      });
      const insuranceSum = totalInsurance(step.items);
      policies.set(index, {
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * PAYOUT_CAP_MULTIPLIER,
      });
      priorContracts += 1;
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`No policy at step index ${step.policy}`);
      }
      const result = processClaim(policy, step.incident);
      results.push(result);
    } else {
      throw new Error(`Unknown op: ${(step as { op: string }).op}`);
    }
  });

  return { results };
}
