import type { Item } from "./types.js";
import { computeQuote, QuoteError } from "./quote.js";
import {
  processClaim,
  type Policy,
  type Damage,
  ClaimError,
} from "./claim.js";

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type ScenarioStep = QuoteStep | ClaimStep;

export interface ScenarioInput {
  customer: { yearsWithMHPCO: number };
  steps: ScenarioStep[];
}

export interface QuoteStepResult {
  premium: number;
  remainingCap?: undefined;
}

export interface ClaimStepResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteStepResult | ClaimStepResult;

export interface ScenarioResult {
  results: StepResult[];
}

export class ScenarioError extends Error {}

const CAP_MULTIPLIER = 2;

interface PolicyRecord {
  policy: Policy;
  quoteIndex: number;
}

function createPolicyFromQuote(
  items: Item[],
  insuranceSum: number,
  quoteIndex: number
): PolicyRecord {
  const cap = CAP_MULTIPLIER * insuranceSum;
  return {
    policy: { items, insuranceSum, cap, capRemaining: cap },
    quoteIndex,
  };
}

export function runScenario(input: ScenarioInput): ScenarioResult {
  const policies: PolicyRecord[] = [];
  const results: StepResult[] = [];
  let quoteCount = 0;

  for (const step of input.steps) {
    if (step.op === "quote") {
      const quote = computeQuote({
        items: step.items,
        customerYears: input.customer.yearsWithMHPCO,
        contractIndex: quoteCount,
      });
      policies.push(
        createPolicyFromQuote(step.items, quote.insuranceSum, quoteCount)
      );
      results.push({ premium: quote.premium });
      quoteCount++;
    } else {
      const target = policies[step.policy];
      if (!target) {
        throw new ScenarioError(`Invalid policy index: ${step.policy}`);
      }
      const claim = processClaim({
        policy: target.policy,
        damages: step.incident.damages,
      });
      target.policy.capRemaining = claim.remainingCap;
      results.push({ payout: claim.payout, remainingCap: claim.remainingCap });
    }
  }

  return { results };
}

export { QuoteError, ClaimError };
