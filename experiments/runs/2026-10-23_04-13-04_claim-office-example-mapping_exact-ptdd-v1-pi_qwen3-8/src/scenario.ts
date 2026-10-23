/** Scenario orchestration: step sequencing, policies, contract history. */

import { createPolicy, processClaim, type Policy } from "./claim.js";
import { isKnownType } from "./itemCatalog.js";
import { quotePremium } from "./premium.js";

/** Scenario input/output shapes (normative JSON schema from prompt.md). */

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
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

export interface ScenarioInput {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioOutput {
  results: StepResult[];
}

/** Reject items that are not in the MHPCO catalog. */
function validateItems(step: QuoteStep): void {
  for (const item of step.items) {
    if (!isKnownType(item.type)) {
      throw new Error(`unknown item type "${item.type}"`);
    }
  }
}

/** Price one quote step for the customer's history. */
function quoteResult(
  input: ScenarioInput,
  step: QuoteStep,
  contracts: number,
): QuoteResult {
  validateItems(step);
  return {
    premium: quotePremium(step.items, input.customer.yearsWithMHPCO, contracts),
  };
}

/** Settle one claim step against the referenced policy. */
function claimResult(
  policies: Map<number, Policy>,
  step: ClaimStep,
): ClaimResult {
  const policy = policies.get(step.policy);
  if (!policy) {
    throw new Error(`claim references unknown policy ${step.policy}`);
  }
  return processClaim(policy, step.incident.damages);
}

export function runScenario(input: ScenarioInput): ScenarioOutput {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contracts = 0;
  for (const [index, step] of input.steps.entries()) {
    if (step.op === "quote") {
      results.push(quoteResult(input, step, contracts));
      policies.set(index, createPolicy(step.items));
      contracts += 1;
    } else {
      results.push(claimResult(policies, step));
    }
  }
  return { results };
}
