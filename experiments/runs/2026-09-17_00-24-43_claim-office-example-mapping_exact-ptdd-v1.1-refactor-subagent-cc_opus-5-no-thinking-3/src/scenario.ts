// Running a scenario: the MHPCO processes a customer's steps in order, so a
// quote creates a policy that a later claim can be made against.

import { type Customer, quote } from "./claim-office.js";
import { type Damage } from "./claim-settlement.js";
import { type Item, refuseUninsurableItems } from "./item-catalogue.js";
import { PolicyRegister } from "./policy-register.js";

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

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new PolicyRegister();
  // Every quote in the scenario closes a contract, so each later quote is a
  // follow-up contract for this customer.
  let previousContracts = 0;

  function runQuote(step: QuoteStep, reference: number): QuoteResult {
    refuseUninsurableItems(step.items);
    const premium = quote(scenario.customer, step.items, previousContracts);
    previousContracts += 1;
    policies.open(reference, step.items);
    return { premium };
  }

  function runClaim(step: ClaimStep): ClaimResult {
    return policies.settleAgainst(step.policy, step.incident.damages);
  }

  return scenario.steps.map((step, index) =>
    step.op === "quote" ? runQuote(step, index) : runClaim(step),
  );
}
