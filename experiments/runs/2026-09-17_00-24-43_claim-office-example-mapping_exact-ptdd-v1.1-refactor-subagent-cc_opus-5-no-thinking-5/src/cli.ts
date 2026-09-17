/**
 * The claim-office counter: it takes a scenario in at the window, walks the
 * customer's steps past the office's clerks in order, and writes back what each
 * step came to. It translates between JSON and the office's own vocabulary and
 * decides nothing about premiums or payouts itself.
 */

import { readFileSync } from "node:fs";

import { quote, type Customer } from "./quote.js";
import { type Item } from "./price-list.js";
import { claim, openPolicy, type Incident, type Policy } from "./claim.js";

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

/**
 * What the counter writes back for one step, in the wire's own vocabulary. The
 * claim arm lists the same two figures a `ClaimResult` carries, and deliberately
 * is not that type: the office's answer and the shape the wire promises are
 * different knowledge that happen to coincide today. The counter therefore names
 * the fields it puts on stdout rather than passing the office's answer through,
 * so that a figure the office one day adds for its own purposes -- a per-clause
 * breakdown, say -- does not silently become part of what the CLI promises.
 */
type StepResult = { premium: number } | { payout: number; remainingCap: number };

/** The scenario arrives on stdin as one JSON document. */
function readStdin(): string {
  return readFileSync(0, "utf8");
}

/**
 * Walks the customer's steps past the office in the order they were presented.
 * A quote step takes out a policy, which the office keeps against the step that
 * created it so that a later claim step can name it; a claim step is settled
 * against that policy, drawing on cover any earlier claim on it has left.
 *
 * The office also counts the contracts the customer has taken out as the walk
 * goes on, because every quote after the first is a follow-up contract and is
 * discounted as one.
 */
function runScenario(scenario: Scenario): StepResult[] {
  const policiesByStep = new Map<number, Policy>();
  const results: StepResult[] = [];
  let contractsTakenOut = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      policiesByStep.set(stepIndex, openPolicy(step.items));
      results.push({ premium: quote(scenario.customer, step.items, contractsTakenOut) });
      contractsTakenOut += 1;
      return;
    }
    const settlement = claim(policyOfStep(policiesByStep, step.policy), step.incident);
    results.push({ payout: settlement.payout, remainingCap: settlement.remainingCap });
  });

  return results;
}

/** The policy a claim step names, by the index of the quote step that opened it. */
function policyOfStep(policiesByStep: Map<number, Policy>, stepIndex: number): Policy {
  const policy = policiesByStep.get(stepIndex);
  if (policy === undefined) {
    throw new Error(`Step ${stepIndex} did not take out a policy to claim against`);
  }
  return policy;
}

const REFUSED = 1;

/**
 * How the counter turns the office away at the window. A refusal is a
 * description of what is wrong, not a crash report: the customer is told the
 * office's own reason and nothing of the machinery that raised it, which is why
 * only the message is written and never a stack trace. Nothing is paid, so
 * stdout stays empty and the status is non-zero.
 *
 * This is the shape of a refusal, and the only place it is decided. Which
 * conditions are worth refusing is not settled here at all -- the price list and
 * the claim office each refuse on their own grounds, and every one of them
 * arrives at this one window and is reported the same way.
 */
function refuse(refusal: Error): never {
  process.stderr.write(`${refusal.message}\n`);
  process.exit(REFUSED);
}

/**
 * The counter's day: read the scenario presented at the window, walk it past the
 * office, and write back what it came to. The results are written only once the
 * whole scenario has gone through, so a scenario refused part-way leaves no
 * half-finished answer behind it.
 */
function main(): void {
  const scenario = JSON.parse(readStdin()) as Scenario;
  const results = runScenario(scenario);
  process.stdout.write(JSON.stringify({ results }) + "\n");
}

try {
  main();
} catch (refusal) {
  refuse(refusal as Error);
}
