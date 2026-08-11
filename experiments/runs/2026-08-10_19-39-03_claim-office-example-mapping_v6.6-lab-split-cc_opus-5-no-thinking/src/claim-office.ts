// How a scenario unfolds. This module knows the order events happen in and
// what each step leaves behind for the next one; it delegates what a policy
// costs to pricing.ts and what it pays out to coverage.ts.

import { premiumFor, type Customer, type Item } from "./pricing.js";
import {
  capFor,
  payoutForDamages,
  settleClaim,
  type Damage,
} from "./coverage.js";
import { claimRejection } from "./rejection.js";

export type { Customer, KnownItemType } from "./pricing.js";
export type { Damage } from "./coverage.js";

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

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

export interface ScenarioResults {
  results: ({ premium: number } | { payout: number; remainingCap: number })[];
}

// What earlier steps have established by the time a later step is priced.
// Steps are not independent: a quote is a follow-up contract when the customer
// already took a quote earlier in the same scenario. Folding this forward —
// rather than re-deriving it from the step prefix — is what lets a step read
// the state its predecessors left behind.
// Named for the live coverage a policy has left, not for the policy itself.
// This record is NOT the contract: it carries no premium, no customer, no
// policy context — and its remainingCap is rewritten by every claim settled
// against it. Calling it `Policy` made the mutation read as if the contract
// itself were changing, and collided with ClaimStep.policy, which holds a step
// INDEX rather than any of this. That collision is the tell: runClaim had to
// rename the field locally to stay readable.
interface PolicyCoverage {
  // The insured items, kept because a claim is settled against them: what a
  // damage reimburses depends on the item's own material and enchantment, not
  // on the damage entry alone.
  items: Item[];
  remainingCap: number;
}

interface ScenarioState {
  hasQuoted: boolean;
  // Keyed by the step index of the quote that created the policy, which is
  // how a later claim step refers to it.
  coverages: Map<number, PolicyCoverage>;
}

const INITIAL_STATE: ScenarioState = { hasQuoted: false, coverages: new Map() };

type StepOutcome = ScenarioResults["results"][number];

interface StepRun {
  outcome: StepOutcome;
  state: ScenarioState;
}

// Every coverage a step establishes or revises is recorded the same way, so
// both handlers go through here rather than each rebuilding the map.
const withCoverage = (
  state: ScenarioState,
  index: number,
  coverage: PolicyCoverage,
): ScenarioState => ({
  ...state,
  coverages: new Map(state.coverages).set(index, coverage),
});

const runQuote = (
  { items }: QuoteStep,
  customer: Customer,
  state: ScenarioState,
  index: number,
): StepRun => ({
  outcome: {
    premium: premiumFor(items, {
      customer,
      isFollowUpContract: state.hasQuoted,
    }),
  },
  state: withCoverage({ ...state, hasQuoted: true }, index, {
    items,
    remainingCap: capFor(items),
  }),
});

const runClaim = (
  { policy: policyIndex, incident }: ClaimStep,
  state: ScenarioState,
): StepRun => {
  // A claim always names a policy an earlier quote step created. No spec
  // example covers a claim naming a step that never quoted, so this is not the
  // considered answer to that question — but the previous fallback of an empty
  // policy was worse than none: it returned a payout of 0 with 0 cap left,
  // which is indistinguishable from a real policy that has exhausted its cap.
  // A typo'd index read as a legitimate settlement. Fail loudly instead until
  // an example says otherwise.
  const coverage = state.coverages.get(policyIndex);
  if (coverage === undefined) {
    throw claimRejection(`names policy ${policyIndex}, which no step created`);
  }
  const { payout, remainingCap } = settleClaim(
    payoutForDamages(coverage.items, incident.damages),
    coverage.remainingCap,
  );

  return {
    outcome: { payout, remainingCap },
    state: withCoverage(state, policyIndex, { ...coverage, remainingCap }),
  };
};

// Dispatches a step to its handler. Written as an exhaustive switch on `op`
// so that adding a step kind to the Step union turns "I forgot to handle it"
// into a compile error rather than a wrong number.
const runStep = (
  step: Step,
  customer: Customer,
  state: ScenarioState,
  index: number,
): StepRun => {
  switch (step.op) {
    case "quote":
      return runQuote(step, customer, state, index);
    case "claim":
      return runClaim(step, state);
  }
};

export const runScenario = ({ customer, steps }: Scenario): ScenarioResults => {
  const { results } = steps.reduce<{
    results: StepOutcome[];
    state: ScenarioState;
  }>(
    ({ results, state }, step, index) => {
      const stepRun = runStep(step, customer, state, index);
      return { results: [...results, stepRun.outcome], state: stepRun.state };
    },
    { results: [], state: INITIAL_STATE },
  );

  return { results };
};
