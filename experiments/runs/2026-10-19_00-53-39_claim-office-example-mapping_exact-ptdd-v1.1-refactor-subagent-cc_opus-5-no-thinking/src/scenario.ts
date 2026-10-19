import { type Customer, type Item, quote } from "./claim-office.js";
import { type ClaimSettlement, type Incident, type Policy, policyFor, settle } from "./claim.js";

export interface QuoteStep {
  readonly op: "quote";
  readonly items: readonly Item[];
}

export interface ClaimStep {
  readonly op: "claim";
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

export type StepResult = QuoteResult | ClaimSettlement;

// A claim step names the policy it settles against by the step index that created
// it, and an index naming no quote step is refused rather than settled -- the
// office has no policy to read a cap from, so there is nothing to pay against.
// The refusal cannot be lifted out of the retrieval: an index is unusable
// precisely because the scenario's standing policies hold nothing under it, so
// resolving and refusing are one decision made once per claim step.
function standingPolicyFor(standingPolicies: ReadonlyMap<number, Policy>, policyStep: number): Policy {
  const policy = standingPolicies.get(policyStep);
  if (policy === undefined) {
    throw new Error(`step ${policyStep} did not create a policy`);
  }
  return policy;
}

// Steps are processed in order; each completed quote step becomes a contract in
// the customer's history, which the next quote step is priced against.
//
// This is the one way in: everything an outside caller may ask the office is a
// `Scenario` handed to this function, answered by one `StepResult` per step in
// step order. `quote` and `settle` are exported for the rules' own tests and for
// this function to orchestrate, not as a second entry point -- a caller that
// reaches past this one keeps its own contract history and its own standing
// policies, and so loses the two things a scenario means (see `standingPolicies`
// below for why the cap in particular cannot survive that). Rejections leave by
// the same door, as a thrown `Error` carrying a description and nothing else, so
// a transport adapter has one contract to translate in each direction and no
// domain decision of its own to make.
export function runScenario(scenario: Scenario): StepResult[] {
  let contracts = 0;
  const results: StepResult[] = [];
  // A policy stands for the rest of the scenario once its quote step creates it,
  // and every later claim step naming that step index settles against the very
  // same policy, not a copy of it. That shared identity is what gives successive
  // claims one cap to deplete between them: the second of two 1500 G claims
  // against a sword is paid the 600 G its predecessor left standing.
  const standingPolicies = new Map<number, Policy>();
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      results.push({ premium: quote(scenario.customer, step.items, contracts) });
      standingPolicies.set(stepIndex, policyFor(step.items));
      contracts += 1;
      return;
    }
    results.push(settle(standingPolicyFor(standingPolicies, step.policy), step.incident));
  });
  return results;
}
