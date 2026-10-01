import { claim, type Incident } from "./claim.js";
import { capOf } from "./policy.js";
import type { Item } from "./price-list.js";
import { quote, type Customer } from "./quote.js";

// A scenario is one customer's dealings with the office: a sequence of steps
// the office works through in order, each answered against what the earlier
// steps left behind.
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

export type Result =
  | { premium: number }
  | { payout: number; remainingCap: number };

// A policy as the office holds it while the scenario runs: what it covers,
// and how much of its cap is still available to pay out.
interface Policy {
  items: Item[];
  remainingCap: number;
}

// The register of policies the scenario's quote steps have opened. A claim
// names the step that opened the policy it draws on, so a step that opened no
// policy is not an empty claim but a scenario the office refuses.
type PolicyRegister = Map<number, Policy>;

function policyOpenedBy(register: PolicyRegister, stepIndex: number): Policy {
  const policy = register.get(stepIndex);
  if (policy === undefined) {
    throw new Error(`Step ${stepIndex} did not create a policy to claim on`);
  }
  return policy;
}

// A claim draws on its policy's remaining cap and leaves the policy with less
// cap for the claims after it.
function settleAgainst(policy: Policy, incident: Incident): Result {
  const settlement = claim(policy.items, policy.remainingCap, incident);
  policy.remainingCap = settlement.remainingCap;
  return settlement;
}

// Quoting a step opens the policy later claims draw on, keyed by the step that
// opened it.
function openPolicy(
  register: PolicyRegister,
  stepIndex: number,
  items: Item[],
): void {
  register.set(stepIndex, { items, remainingCap: capOf(items) });
}

// The office works through the scenario's steps in order. Two things carry
// from one step to the next for different reasons: the policies the quotes
// opened, which claims draw on, and how many contracts the customer has taken
// out so far, which decides whether the next quote is a follow-up.
export function resultsFor(scenario: Scenario): Result[] {
  const register: PolicyRegister = new Map();
  let previousQuoteCount = 0;

  return scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      return settleAgainst(policyOpenedBy(register, step.policy), step.incident);
    }
    const premium = quote(scenario.customer, step.items, previousQuoteCount);
    previousQuoteCount += 1;
    openPolicy(register, stepIndex, step.items);
    return { premium };
  });
}
