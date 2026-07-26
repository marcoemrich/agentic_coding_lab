import type { Incident, Item } from "./claim-office.js";
import { claim, payoutCapOf, quote } from "./claim-office.js";

// A scenario is the parsed input format: a customer and a list of steps to run
// against them. Running a scenario is deliberately separate from the CLI that
// wraps it — reading stdin, writing stdout and setting an exit status are I/O
// concerns, while sequencing steps is not. Keeping them apart lets the step
// logic be exercised without a process.

// The scenario names a customer by years alone. Previous contracts are not
// given: they are derived from the step's position, since each quote step is
// itself a contract.
export type ScenarioCustomer = {
  yearsWithMHPCO: number;
};

// The two step kinds carry different fields, and each field is required by the
// kind that uses it: a quote step always has items, a claim step always names a
// policy and an incident. Splitting them says so, which is what lets the step
// runners read their fields directly instead of defaulting away absences that
// the input format does not actually permit.
export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: Incident;
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: ScenarioCustomer;
  steps: Step[];
};

export type StepResult = {
  premium?: number;
  payout?: number;
  remainingCap?: number;
};

// Each quote step signs one contract; a claim step does not. So "previous
// contracts" counts the quote steps that ran before this one, which is not the
// same as the step's own index once claims are interleaved.
const previousContractsAt = (steps: Step[], stepIndex: number): number =>
  steps.slice(0, stepIndex).filter((step) => step.op === "quote").length;

// Takes the contract count already resolved rather than the whole step list
// plus an index to derive it from. A quote step's premium depends on how many
// contracts came before, not on the scenario those contracts sit in, and the
// signature now says exactly that.
const runQuoteStep = (
  customer: ScenarioCustomer,
  step: QuoteStep,
  previousContracts: number,
): StepResult => ({
  premium: quote(
    { yearsWithMHPCO: customer.yearsWithMHPCO, previousContracts },
    step.items,
  ),
});

// A claim step names its policy by the index of the step that created it, so
// the items it is claiming against have to be fetched back out of the scenario.
const insuredItemsOf = (step: ClaimStep, steps: Step[]): Item[] => {
  const policyStep = steps[step.policy];
  if (policyStep?.op !== "quote") {
    throw new Error(`No policy at step index ${step.policy}`);
  }
  return policyStep.items;
};

// A policy's cap is spent, not re-granted, so the remaining cap has to outlive
// the claim step that reduced it. That makes it the one piece of running a
// scenario that is state rather than input: the scenario is fixed, this is not.
// Holding it in a run — a scenario plus the caps its claims have depleted so
// far — is what lets each step runner take only the fixed inputs it reads, and
// keeps the mutation in the one place that owns it.
type ScenarioRun = {
  scenario: Scenario;
  remainingCaps: Map<number, number>;
};

// Falls back to the policy's full cap the first time it is claimed against, and
// to whatever the previous claim left thereafter.
const remainingCapFor = (
  run: ScenarioRun,
  policy: number,
  insuredItems: Item[],
): number => run.remainingCaps.get(policy) ?? payoutCapOf(insuredItems);

const runClaimStep = (run: ScenarioRun, step: ClaimStep): StepResult => {
  const insuredItems = insuredItemsOf(step, run.scenario.steps);
  const cap = remainingCapFor(run, step.policy, insuredItems);
  const result = claim(insuredItems, step.incident, cap);
  run.remainingCaps.set(step.policy, result.remainingCap);
  return result;
};

// Quote steps read only the scenario; claim steps also deplete the run's caps.
// Passing the whole run to both is what keeps that difference in the runners
// rather than in this dispatch.
const runStep = (
  run: ScenarioRun,
  step: Step,
  stepIndex: number,
): StepResult => {
  const { customer, steps } = run.scenario;
  return step.op === "claim"
    ? runClaimStep(run, step)
    : runQuoteStep(customer, step, previousContractsAt(steps, stepIndex));
};

export const runScenario = (scenario: Scenario): StepResult[] => {
  const run: ScenarioRun = { scenario, remainingCaps: new Map() };
  return scenario.steps.map((step, stepIndex) => runStep(run, step, stepIndex));
};
