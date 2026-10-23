import { policyCap, processClaim, type Damage } from "./claim.js";
import { quotePremium, type QuoteItem } from "./premium.js";
import { isKnownItemType } from "./priceList.js";

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type Result = QuoteResult | ClaimResult;

interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

export function runScenario(scenario: Scenario): Result[] {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let previousQuotes = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      assertKnownItemTypes(step);
      results.push({ premium: quoteStepPremium(step, scenario.customer, previousQuotes) });
      policies.set(index, { items: step.items, remainingCap: policyCap(step.items) });
      previousQuotes += 1;
    } else {
      results.push(claimStepResult(policies, step));
    }
  });
  return results;
}

function quoteStepPremium(step: QuoteStep, customer: Customer, previousQuotes: number): number {
  return quotePremium(step.items, { yearsWithMHPCO: customer.yearsWithMHPCO, previousQuotes });
}

function assertKnownItemTypes(step: QuoteStep): void {
  for (const item of step.items) {
    if (!isKnownItemType(item.type)) throw new Error(`unknown item type: ${item.type}`);
  }
}

function claimStepResult(policies: Map<number, Policy>, step: ClaimStep): ClaimResult {
  const policy = policies.get(step.policy);
  if (!policy) throw new Error(`claim refers to unknown policy step ${step.policy}`);
  const result = processClaim(policy.items, step.incident.damages, policy.remainingCap);
  policy.remainingCap = result.remainingCap;
  return result;
}
