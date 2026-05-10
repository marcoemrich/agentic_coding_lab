import { readFileSync } from "node:fs";
import { quote, claim } from "./claim-office.js";

type QuoteStep = { type: "quote"; policy: { items: unknown[] } };
type ClaimStep = { type: "claim"; policy: number; incident: { cause: string; damages: unknown[] } };
type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number; priorContracts: number; firstInsurance?: boolean };
  steps: Step[];
};

type ProcessorState = {
  scenario: Scenario;
  priorContracts: number;
  remainingCapByPolicy: Map<number, number>;
};

const processQuoteStep = (step: QuoteStep, state: ProcessorState): { premium: number } => {
  const { premium } = quote({
    customer: { ...state.scenario.customer, priorContracts: state.priorContracts },
    items: step.policy.items as never,
  });
  state.priorContracts += 1;
  return { premium };
};

const processClaimStep = (step: ClaimStep, state: ProcessorState): { payout: number; remainingCap: number } => {
  const policyIndex = step.policy;
  const referenced = state.scenario.steps[policyIndex] as QuoteStep;
  const tracked = state.remainingCapByPolicy.get(policyIndex);
  const claimInput: { items: unknown[]; remainingCap?: number } = { items: referenced.policy.items };
  if (tracked !== undefined) claimInput.remainingCap = tracked;
  const { payout, remainingCap } = claim(claimInput as never, step.incident as never);
  state.remainingCapByPolicy.set(policyIndex, remainingCap);
  return { payout, remainingCap };
};

const processStep = (step: Step, state: ProcessorState): unknown =>
  step.type === "quote" ? processQuoteStep(step, state) : processClaimStep(step, state);

const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
const state: ProcessorState = {
  scenario,
  priorContracts: scenario.customer.priorContracts,
  remainingCapByPolicy: new Map<number, number>(),
};
try {
  const results = scenario.steps.map((step) => processStep(step, state));
  process.stdout.write(JSON.stringify({ results }));
} catch (error) {
  process.stderr.write(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
