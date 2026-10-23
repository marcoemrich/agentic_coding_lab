import { createPolicy, processClaim, type Policy } from "./claim";
import { quotePremium } from "./quote";
import type { Scenario, ScenarioResult, StepResult } from "./types";

export { basePremiumFor } from "./quote";
export type {
  ClaimResult,
  ClaimStep,
  Damage,
  Incident,
  QuoteItem,
  QuoteResult,
  QuoteStep,
  Scenario,
  ScenarioResult,
  Step,
  StepResult,
} from "./types";

export function processScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contractNumber = 0;
  for (const [index, step] of scenario.steps.entries()) {
    if (step.op === "quote") {
      const premium = quotePremium(
        step.items,
        scenario.customer.yearsWithMHPCO,
        contractNumber > 0,
      );
      contractNumber += 1;
      policies.set(index, createPolicy(step.items));
      results.push({ premium });
    } else {
      const policy = policies.get(step.policy);
      if (policy === undefined) {
        throw new Error(`claim references unknown policy step ${step.policy}`);
      }
      results.push(processClaim(policy, step.incident));
    }
  }
  return { results };
}
