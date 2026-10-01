import { type Item } from "./item-pricing.js";
import { openPolicy, PolicyRegister, type Incident } from "./claim.js";
import { quote, type Customer } from "./quote.js";

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

/** One customer's run of business with the office, as submitted over the counter. */
export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export interface ScenarioResults {
  results: StepResult[];
}

/**
 * How the MHPCO works through a scenario: it takes the customer's steps in
 * order, writing a policy for each quote and settling each claim against the
 * policy the referenced quote step opened. A scenario is one customer's run of
 * business with the office, so the contracts already quoted in it count towards
 * the customer's standing at each later quote.
 */
export function runScenario(scenario: Scenario): ScenarioResults {
  const register = new PolicyRegister();
  let previousQuoteCount = 0;

  const results = scenario.steps.map((step, stepIndex): StepResult => {
    if (step.op === "claim") {
      return register.settleAgainst(step.policy, step.incident);
    }

    const premium = quote(scenario.customer, step.items, previousQuoteCount);
    previousQuoteCount += 1;
    register.file(stepIndex, openPolicy(step.items));
    return { premium };
  });

  return { results };
}
