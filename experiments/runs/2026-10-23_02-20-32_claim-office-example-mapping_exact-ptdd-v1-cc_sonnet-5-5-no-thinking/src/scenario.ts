import { policyCap, processClaim, type ClaimResult } from "./claim.js";
import type { Damage } from "./coverage.js";
import type { Item } from "./item.js";
import { quotePremium } from "./premium.js";
import { isKnownItemType } from "./price-list.js";

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

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

function rejectUnknownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function policyItems(steps: Step[], index: number): Item[] {
  const policyStep = steps[index];
  if (policyStep?.op !== "quote") {
    throw new Error(`Claim refers to policy ${index}, which is not a quote step`);
  }
  return policyStep.items;
}

function hasEarlierQuote(steps: Step[], index: number): boolean {
  return steps.slice(0, index).some((step) => step.op === "quote");
}

function quoteStepResult(
  step: QuoteStep,
  steps: Step[],
  index: number,
  yearsWithMHPCO: number,
): QuoteResult {
  rejectUnknownItemTypes(step.items);
  const history = { yearsWithMHPCO, hasPreviousContract: hasEarlierQuote(steps, index) };
  return { premium: quotePremium(step.items, history) };
}

function claimStepResult(
  step: ClaimStep,
  steps: Step[],
  remainingCaps: Map<number, number>,
): ClaimResult {
  const items = policyItems(steps, step.policy);
  const availableCap = remainingCaps.get(step.policy) ?? policyCap(items);
  const result = processClaim(items, step.incident.damages, availableCap);
  remainingCaps.set(step.policy, result.remainingCap);
  return result;
}

export function runScenario(scenario: Scenario): { results: (QuoteResult | ClaimResult)[] } {
  const { yearsWithMHPCO } = scenario.customer;
  const remainingCaps = new Map<number, number>();
  const results = scenario.steps.map((step, index) =>
    step.op === "claim"
      ? claimStepResult(step, scenario.steps, remainingCaps)
      : quoteStepResult(step, scenario.steps, index, yearsWithMHPCO),
  );
  return { results };
}
