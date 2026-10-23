import { createPolicy, processClaim, type PolicyState } from "./claim.js";
import { calculateQuotePremium } from "./quote.js";

export interface ScenarioCustomer {
  yearsWithMHPCO: number;
}

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

export interface ClaimIncident {
  cause: string;
  damages: DamageEntry[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: ClaimIncident;
}

export type ScenarioStep = QuoteStep | ClaimStep;

export interface Scenario {
  customer: ScenarioCustomer;
  steps: ScenarioStep[];
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

function getReferencedPolicy(
  policies: Map<number, PolicyState>,
  policyIndex: number,
): PolicyState {
  const policy = policies.get(policyIndex);
  if (!policy) {
    throw new Error(`Policy ${policyIndex} is not covered by policy list`);
  }
  return policy;
}

export function processScenario(scenario: Scenario): ScenarioOutput {
  let quoteCount = 0;
  const policies = new Map<number, PolicyState>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "claim") {
        const policy = getReferencedPolicy(policies, step.policy);
        return processClaim(step, policy);
      }
      const isFollowUpContract = quoteCount > 0;
      quoteCount += 1;
      policies.set(index, createPolicy(step.items));
      return {
        premium: calculateQuotePremium(
          step.items,
          scenario.customer,
          isFollowUpContract,
        ),
      };
    }),
  };
}
