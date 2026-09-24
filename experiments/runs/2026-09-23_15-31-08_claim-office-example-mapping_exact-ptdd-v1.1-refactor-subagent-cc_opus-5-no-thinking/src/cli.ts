#!/usr/bin/env node
/** The MHPCO's counter clerk: reads a scenario from stdin, walks its steps in
 *  order past the premium and claims offices, and writes the results to
 *  stdout. Transport and JSON translation live here; no office rule does. */

import { readFileSync } from "node:fs";
import {
  claim,
  createPolicy,
  quote,
  type Customer,
  type Incident,
  type Item,
  type Policy,
} from "./claim-office.js";

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: Customer;
  steps: Step[];
}

type StepResult = { premium: number } | { payout: number; remainingCap: number };

/** The clerk's register of the contracts issued so far in a scenario, filed
 *  under the zero-based index of the quote step that issued each one. It
 *  answers the two questions the counter asks of a customer's history: which
 *  policy a later claim step names, and how many contracts precede the quote
 *  now being priced. Only a quote step files an entry, so a claim step
 *  standing between two quotes leaves the contract count untouched. */
class ContractRegister {
  private readonly issued = new Map<number, Policy>();

  /** How many contracts the customer has already taken in this scenario. */
  previousContracts(): number {
    return this.issued.size;
  }

  file(quoteStepIndex: number, policy: Policy): void {
    this.issued.set(quoteStepIndex, policy);
  }

  /** The policy a claim step names by the zero-based index of the quote step
   *  that created it. */
  named(quoteStepIndex: number): Policy {
    const policy = this.issued.get(quoteStepIndex);
    if (policy === undefined) {
      throw new Error(`step ${quoteStepIndex} did not create a policy to claim against`);
    }
    return policy;
  }
}

function settleScenario(scenario: Scenario): StepResult[] {
  const register = new ContractRegister();
  return scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      return claim(register.named(step.policy), step.incident);
    }
    const premium = quote(scenario.customer, step.items, register.previousContracts());
    register.file(index, createPolicy(step.items));
    return { premium };
  });
}

function main(): void {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(JSON.stringify({ results: settleScenario(scenario) }));
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
