import { matchDamageOccurrencesToInsuredItems } from "./claim-damage-coverage.js";
import { calculateClaimPayout } from "./claim-payout.js";
import { validateDamageAmounts } from "./damage-report-validation.js";
import { applyPayoutToPolicyCap, calculateInitialPolicyCap } from "./policy-cap.js";
import { calculateQuotePremium } from "./quote-premium.js";
import { validateQuoteItemTypes } from "./quote-item-catalog.js";

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type OperationResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: OperationResult[];
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: calculateInitialPolicyCap(items) };
}

function processClaim(policy: Policy, damages: Damage[]): OperationResult {
  validateDamageAmounts(damages);
  const insuredDamages = matchDamageOccurrencesToInsuredItems(policy.items, damages);
  const requestedPayout = calculateClaimPayout(insuredDamages);
  const capApplication = applyPayoutToPolicyCap(requestedPayout, policy.remainingCap);
  policy.remainingCap = capApplication.remainingCap;
  return capApplication;
}

export function executeScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results: OperationResult[] = [];
  let quotesCreated = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "claim") {
      results.push(processClaim(policies.get(step.policy)!, step.incident.damages));
      return;
    }
    validateQuoteItemTypes(step.items);
    const premium = calculateQuotePremium(
      step.items, scenario.customer.yearsWithMHPCO, quotesCreated > 0,
    );
    policies.set(index, createPolicy(step.items));
    quotesCreated += 1;
    results.push({ premium });
  });
  return { results };
}
