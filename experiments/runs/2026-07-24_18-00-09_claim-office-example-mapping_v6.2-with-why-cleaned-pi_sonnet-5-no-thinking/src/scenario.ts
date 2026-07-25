import { computeQuote, QuoteItem, KNOWN_ITEM_TYPES } from "./pricing.js";
import { computeClaim, PolicyItem } from "./claims.js";

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}
export interface QuoteStepResult {
  premium: number;
}

export interface ClaimStepResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteStepResult | ClaimStepResult;

export interface ScenarioResult {
  results: StepResult[];
}

const assertKnownItemTypes = (items: QuoteItem[]): void => {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: '${item.type}'`);
    }
  }
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policyItemsByStepIndex = new Map<number, PolicyItem[]>();
  const capUsedByStepIndex = new Map<number, number>();

  const runQuoteStep = (step: QuoteStep, index: number): QuoteStepResult => {
    assertKnownItemTypes(step.items);
    const isFollowUpContract = policyItemsByStepIndex.size > 0;
    policyItemsByStepIndex.set(index, step.items);
    const premium = computeQuote(step.items, scenario.customer, isFollowUpContract);
    return { premium };
  };

  const runClaimStep = (step: ClaimStep): ClaimStepResult => {
    const policyItems = policyItemsByStepIndex.get(step.policy)!;
    const capUsedSoFar = capUsedByStepIndex.get(step.policy) ?? 0;
    const claimResult = computeClaim(policyItems, step.incident.damages, capUsedSoFar);
    capUsedByStepIndex.set(step.policy, capUsedSoFar + claimResult.payout);
    return claimResult;
  };

  const results = scenario.steps.map((step, index): StepResult =>
    step.op === "quote" ? runQuoteStep(step, index) : runClaimStep(step)
  );

  return { results };
};
