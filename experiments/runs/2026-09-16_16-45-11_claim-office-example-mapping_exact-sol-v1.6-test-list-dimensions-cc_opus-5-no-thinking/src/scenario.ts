import { claim, type Damage } from "./claim.js";
import { type Item } from "./price-list.js";
import { quote, type Customer, type Quote } from "./quote.js";

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

interface IssuedPolicy {
  policy: Quote;
  items: Item[];
  capRemaining: number;
}

/** Runs a scenario's steps in order, carrying customer and policy history forward. */
export function runScenario(scenario: Scenario): StepResult[] {
  const issued = new Map<number, IssuedPolicy>();
  const results: StepResult[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const policy = quote(scenario.customer, step.items, issued.size);
      issued.set(index, { policy, items: step.items, capRemaining: policy.cap });
      results.push({ premium: policy.premium });
      return;
    }

    const cover = issued.get(step.policy) as IssuedPolicy;
    const result = claim(
      cover.policy,
      cover.items,
      step.incident.damages,
      cover.capRemaining,
    );
    cover.capRemaining = result.remainingCap;
    results.push(result);
  });

  return results;
}
