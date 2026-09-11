import { readFileSync } from "node:fs";
import { quote, claim } from "./claim-office.js";

type QuoteStep = { op: "quote"; items: { type: string }[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: { itemType: string; amount: number }[] };
};
type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const input = readFileSync(0, "utf-8");
const scenario: Scenario = JSON.parse(input);

const policyItemsByStep = new Map<number, { type: string }[]>();
const payoutByStep = new Map<number, number>();
let quoteCount = 0;

function handleQuoteStep(step: QuoteStep, stepIndex: number): QuoteResult {
  const isFollowUpContract = quoteCount > 0;
  quoteCount += 1;
  const premium = quote(scenario.customer, step.items, isFollowUpContract);
  policyItemsByStep.set(stepIndex, step.items);
  return { premium };
}

function handleClaimStep(step: ClaimStep): ClaimResult {
  const policyItems = policyItemsByStep.get(step.policy)!;
  const priorPayout = payoutByStep.get(step.policy) ?? 0;
  const { payout, remainingCap } = claim(policyItems, step.incident.damages, priorPayout);
  payoutByStep.set(step.policy, priorPayout + payout);
  return { payout, remainingCap };
}

const results = scenario.steps.map((step, stepIndex) =>
  step.op === "quote" ? handleQuoteStep(step, stepIndex) : handleClaimStep(step)
);

process.stdout.write(JSON.stringify({ results }));
