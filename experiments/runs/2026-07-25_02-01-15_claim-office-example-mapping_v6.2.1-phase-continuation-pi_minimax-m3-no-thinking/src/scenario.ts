import { createPolicy, processClaim, type Policy, type Incident } from "./policy.js";
import { quotePremium, type QuoteItem, type Customer } from "./quote.js";

export type QuoteStep = {
  op: "quote";
  items: QuoteItem[];
};

export type ClaimStep = {
  op: "claim";
  /**
   * Index into the scenario's policies array (0-based, in quote-order).
   * The policies array is grown by each quote step earlier in the scenario.
   */
  policy: number;
  incident: Incident;
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const results: StepResult[] = [];
  const policies: Policy[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const isFollowup = policies.length > 0;
      const premium = quotePremium(step.items, scenario.customer, { isFollowup });
      policies.push(createPolicy(step.items));
      results.push({ premium });
    } else {
      // processClaim returns the new cap as a value; persist it on the policy
      // so subsequent claims against the same policy see the updated cap.
      const policy = policies[step.policy];
      const result = processClaim(policy, step.incident);
      policy.remainingCap = result.remainingCap;
      results.push(result);
    }
  }
  return { results };
}
