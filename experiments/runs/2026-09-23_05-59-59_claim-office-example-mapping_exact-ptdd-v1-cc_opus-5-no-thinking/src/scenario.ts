import { claim, type Incident } from "./claim.js";
import type { Customer, Item } from "./item.js";
import { PolicyRegister } from "./policy-register.js";
import { quote } from "./quote.js";

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

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new PolicyRegister();
  return scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, policies.contractCount);
      policies.register(index, step.items);
      return { premium };
    }
    const policy = policies.policyCreatedBy(step.policy);
    const result = claim(policy.items, step.incident, policy.remainingCap);
    policy.remainingCap = result.remainingCap;
    return result;
  });
}
