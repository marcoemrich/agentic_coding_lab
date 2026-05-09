import { processClaim } from "./claim.js";
import { buildPolicy, computePremium } from "./quote.js";
import type {
  ClaimStep,
  Policy,
  QuoteStep,
  Scenario,
  ScenarioResult,
  Step,
  StepResult,
} from "./types.js";

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];
  let priorContracts = 0;

  scenario.steps.forEach((step: Step, idx: number) => {
    if (step.op === "quote") {
      const q = step as QuoteStep;
      const premium = computePremium(q.items, {
        customer: scenario.customer,
        priorContracts,
      });
      const policy = buildPolicy(q.items);
      policies.set(idx, policy);
      priorContracts += 1;
      results.push({ premium });
    } else if (step.op === "claim") {
      const c = step as ClaimStep;
      const policy = policies.get(c.policy);
      if (!policy) {
        throw new Error(`claim references unknown policy step ${c.policy}`);
      }
      results.push(processClaim(policy, c.incident));
    } else {
      throw new Error(`unknown op: ${(step as { op: string }).op}`);
    }
  });

  return { results };
}
