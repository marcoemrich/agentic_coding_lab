import {
  createPolicy,
  processClaim,
  type DamageEntry,
  type Incident,
  type PolicyState,
} from "./claim.js";
import {
  calculateQuotePremium,
  type Customer,
  type QuoteItem,
} from "./quote.js";

export type { Customer, QuoteItem, DamageEntry, Incident };

export type ScenarioStep =
  | { op: "quote"; items: QuoteItem[] }
  | { op: "claim"; policy: number; incident: Incident };

export interface Scenario {
  customer: Customer;
  steps: ScenarioStep[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface ScenarioOutput {
  results: StepResult[];
}

export function processScenario(scenario: Scenario): ScenarioOutput {
  let quoteCount = 0;
  const policies = new Map<number, PolicyState>();
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUpContract = quoteCount > 0;
      quoteCount += 1;
      policies.set(index, createPolicy(step.items));
      return {
        premium: calculateQuotePremium(
          step.items,
          scenario.customer,
          isFollowUpContract
        ),
      };
    }
    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error(`Invalid policy reference: ${step.policy}`);
    }
    return processClaim(policy, step.incident);
  });
  return { results };
}
