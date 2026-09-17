/**
 * A scenario put to MHPCO across the counter: one customer, and a sequence of
 * steps the office works through in order.
 *
 * This module owns one ruling of the office's: what it means to put steps to
 * MHPCO in sequence. A quote writes a policy the office keeps on file under the
 * step that asked for it, so that a later claim can name it; writing a contract
 * advances the customer's standing, so the next quote is rated against it; and
 * settling a claim consumes part of that policy's cap, so the office keeps the
 * settled policy on file in place of the old one. A claim naming a step that
 * wrote no policy is one the office refuses outright.
 *
 * It is kept apart from the `claim-office` command because that only carries
 * the scenario in from the outside world and the answers back out: how MHPCO
 * works through a sequence of steps is the office's ruling and would stand
 * unchanged if the scenario arrived by some other means entirely.
 */

import {
  claim,
  createPolicy,
  type Customer,
  type Incident,
  type Item,
  type Policy,
} from "./claim-office.js";
import { afterWritingAContract } from "./customer-standing.js";

/** A step asking MHPCO what it would charge to insure a list of items. */
export interface QuoteStep {
  readonly op: "quote";
  readonly items: readonly Item[];
}

/** A step reporting damage against the policy an earlier quote step wrote. */
export interface ClaimStep {
  readonly op: "claim";
  readonly policy: number;
  readonly incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

/** A whole scenario: the one customer it concerns, and the steps to work through. */
export interface Scenario {
  readonly customer: { readonly yearsWithMHPCO: number };
  readonly steps: readonly Step[];
}

/** What MHPCO answers to a quote step. */
export interface QuoteResult {
  readonly premium: number;
}

/** What MHPCO answers to a claim step. */
export interface ClaimResult {
  readonly payout: number;
  readonly remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

/**
 * The office's counter as a scenario is worked through: the customer as their
 * standing stands right now, and the policies written so far, on file under the
 * step that asked for each.
 */
interface Counter {
  customer: Customer;
  readonly policies: Map<number, Policy>;
}

/**
 * A customer arriving at the counter holds no contracts with MHPCO yet: only
 * the contracts written during the scenario count towards their standing.
 */
function arrivingAtTheCounter(customer: Scenario["customer"]): Customer {
  return { yearsWithMHPCO: customer.yearsWithMHPCO, previousContracts: 0 };
}

/**
 * Writes a policy for the step's items and keeps it on file under that step, so
 * a later claim can name it; the contract also advances the customer's standing
 * for the steps that follow.
 */
function quoteStep(counter: Counter, step: QuoteStep, stepIndex: number): QuoteResult {
  const policy = createPolicy(counter.customer, step.items);
  counter.policies.set(stepIndex, policy);
  counter.customer = afterWritingAContract(counter.customer);
  return { premium: policy.premium };
}

/**
 * Settles the step's damage report against the policy the named step wrote, and
 * keeps the settled policy on file in its place — the claim has consumed part
 * of its cap, and later claims are settled against what is left.
 */
function claimStep(counter: Counter, step: ClaimStep): ClaimResult {
  const policy = counter.policies.get(step.policy);
  if (policy === undefined) {
    throw new Error(`step ${step.policy} did not create a policy`);
  }
  const settlement = claim(policy, step.incident);
  counter.policies.set(step.policy, settlement.policy);
  return { payout: settlement.payout, remainingCap: settlement.policy.remainingCap };
}

/**
 * Works through a scenario step by step, answering each in turn. A step the
 * office refuses ends the scenario there: the refusal stands for the whole of
 * it, and no answers are given.
 */
export function runScenario(scenario: Scenario): readonly StepResult[] {
  const counter: Counter = {
    customer: arrivingAtTheCounter(scenario.customer),
    policies: new Map<number, Policy>(),
  };
  return scenario.steps.map((step, stepIndex) =>
    step.op === "quote" ? quoteStep(counter, step, stepIndex) : claimStep(counter, step),
  );
}
