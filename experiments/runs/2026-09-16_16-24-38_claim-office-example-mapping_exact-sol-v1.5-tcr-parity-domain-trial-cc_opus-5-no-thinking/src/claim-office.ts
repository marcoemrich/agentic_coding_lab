import { settleClaim, type Damage, type Policy } from "./claims.js";
import { insuranceSum, type Item } from "./price-list.js";
import { quotePremium, type Customer } from "./quoting.js";

export { insuranceSum, type Item } from "./price-list.js";
export { insuredItemsPremium, policyBasePremium, type Customer } from "./quoting.js";
export { type Damage } from "./claims.js";

const CAP_MULTIPLE = 2;

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

/** A quote opens a policy; later claims are settled against the policy a step index names. */
export function runScenario(scenario: Scenario): unknown[] {
  const policies = new Map<number, Policy>();
  return scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      return settleClaim(policies.get(step.policy) as Policy, step.incident.damages);
    }
    const premium = quotePremium(step.items, scenario.customer, policies.size);
    policies.set(index, { items: step.items, remainingCap: insuranceSum(step.items) * CAP_MULTIPLE });
    return { premium };
  });
}
