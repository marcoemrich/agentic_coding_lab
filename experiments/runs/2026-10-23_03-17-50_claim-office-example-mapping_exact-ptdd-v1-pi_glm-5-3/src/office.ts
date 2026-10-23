import { quotePremium } from "./premium.js";
import { createPolicy, processClaim, type Policy } from "./claim.js";

export interface ItemSpec {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: ItemSpec[];
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: DamageEntry[];
  };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export class RejectionError extends Error {}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface ScenarioResult {
  results: Array<QuoteResult | ClaimResult>;
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: Array<QuoteResult | ClaimResult> = [];
  const policiesByStep = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      const isFollowUpContract = quoteCount > 0;
      quoteCount += 1;
      results.push({
        premium: Math.ceil(quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUpContract)),
      });
      policiesByStep.set(stepIndex, createPolicy(step.items));
    } else {
      const referenced = scenario.steps[step.policy];
      const policy = referenced?.op === "quote" ? policiesByStep.get(step.policy) : undefined;
      if (!policy) {
        throw new RejectionError(`no policy was created at step ${step.policy}`);
      }
      results.push(processClaim(policy, step));
    }
  });
  return { results };
}
