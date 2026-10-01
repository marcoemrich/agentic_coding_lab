import { quote, type Customer, type Item, type QuoteResult } from "./premium.js";
import { claim, openPolicy, type ClaimResult, type Damage, type Policy } from "./claim.js";

export type { ClaimResult, Customer, Damage, Item, QuoteResult };

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = QuoteResult | ClaimResult;

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  /** Policies by the index of the quote step that opened them. */
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex): StepResult => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy) ?? openPolicy([]);
      const result = claim(policy, step.incident.damages);
      policies.set(step.policy, { ...policy, remainingCap: result.remainingCap });
      return result;
    }
    const result = quote(step.items, { customer: scenario.customer, isFollowUpContract: policies.size > 0 });
    policies.set(stepIndex, openPolicy(step.items));
    return result;
  });
  return { results };
}
