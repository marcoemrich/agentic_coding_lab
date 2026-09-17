import { claim } from "./claim.js";
import type { Damage } from "./damage-report.js";
import type { Customer, Item } from "./policy.js";
import { payoutCap } from "./policy-cover.js";
import { quote } from "./quote.js";

/**
 * A scenario arrives as JSON, so a step's `op` is read as the string it was
 * written as rather than as a narrowed literal type. Narrowing it is the
 * CLI's job, at the boundary where an unrecognised step is refused with a
 * non-zero exit.
 */
export interface QuoteStep {
  readonly op: string;
  readonly items: readonly Item[];
}

export interface Incident {
  readonly cause: string;
  readonly damages: readonly Damage[];
}

/** A claim names the policy an earlier quote step created, by its index. */
export interface ClaimStep {
  readonly op: string;
  readonly policy: number;
  readonly incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  readonly customer: Customer;
  readonly steps: readonly Step[];
}

export interface QuoteResult {
  readonly premium: number;
}

/**
 * What a claim step writes out. These field names are the MHPCO's published
 * output schema, which is why the shape is stated here rather than reusing
 * the settlement's own result: a settlement result is what the claim rules
 * computed, this is what the CLI publishes, and the MHPCO can revise the
 * wire format and the calculation on their own schedules. Today the two
 * coincide exactly, and stating them apart is what keeps that a fact rather
 * than an assumption.
 */
export interface ClaimStepResult {
  readonly payout: number;
  readonly remainingCap: number;
}

export type StepResult = QuoteResult | ClaimStepResult;

export interface ScenarioResults {
  readonly results: readonly StepResult[];
}

const CLAIM_OP = "claim";

/**
 * Which operation a step asks for. Because `op` is the raw string JSON
 * carried, this recognises a claim rather than proving one: a step whose
 * `op` is neither operation is not refused here but at the CLI boundary,
 * which is where an unrecognised scenario earns its non-zero exit. Within a
 * scenario that boundary has already vouched for the steps, so anything not
 * asking for a claim is quoted.
 */
function isClaimStep(step: Step): step is ClaimStep {
  return step.op === CLAIM_OP;
}

/**
 * A policy, as a scenario knows it: the items a quote step covered and the
 * cap those items still allow after the claims settled against it so far.
 */
interface Policy {
  readonly items: readonly Item[];
  remainingCap: number;
}

/**
 * The policies a scenario has opened, and what each of them can still pay
 * out.
 *
 * How a policy is addressed and how its cap carries across successive claims
 * are one piece of knowledge, held here: a claim names the policy by the
 * zero-based index of the quote step that opened it, and each settlement
 * draws that policy's own cap down for the next one. The MHPCO could revise
 * either -- address policies by a number of their own, let a claim settle
 * against the latest policy -- without touching what a quote costs or what a
 * claim pays, which is why the register is stated apart from both.
 */
class PolicyRegister {
  private readonly policies = new Map<number, Policy>();

  /** A quote step opens a policy at its own step index, with a full cap. */
  open(stepIndex: number, items: readonly Item[]): void {
    this.policies.set(stepIndex, {
      items,
      remainingCap: payoutCap(items),
    });
  }

  /**
   * Settling an incident against the policy a claim names, drawing that
   * policy's cap down by what it pays out.
   */
  settle(stepIndex: number, damages: readonly Damage[]): ClaimStepResult {
    const policy = this.policyOpenedBy(stepIndex);
    const settled = claim(policy.items, damages, policy.remainingCap);
    policy.remainingCap = settled.remainingCap;
    return settled;
  }

  private policyOpenedBy(stepIndex: number): Policy {
    const policy = this.policies.get(stepIndex);
    if (policy === undefined) {
      throw new Error(
        `Step ${stepIndex} did not create a policy to claim against`,
      );
    }
    return policy;
  }
}

/**
 * The steps of a scenario are processed in order for one customer, each
 * contributing one result in its own position.
 *
 * A quote is a contract taken out, so it is quoting -- not merely reaching
 * the next step -- that advances the contract count the follow-up contract
 * discount reads. A claim settles against the policy an earlier quote
 * created and draws down that policy's own cap.
 */
export function runScenario(scenario: Scenario): ScenarioResults {
  const results: StepResult[] = [];
  const policies = new PolicyRegister();
  let contractsTakenOut = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (isClaimStep(step)) {
      results.push(policies.settle(step.policy, step.incident.damages));
      return;
    }
    policies.open(stepIndex, step.items);
    results.push({
      premium: quote(scenario.customer, step.items, contractsTakenOut),
    });
    contractsTakenOut += 1;
  });

  return { results };
}
