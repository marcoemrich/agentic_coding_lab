import { quotePremium } from "./premium.js";
import { insuranceCapOf, processDamages } from "./payout.js";

export interface ItemInput {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface DamageInput {
  itemType: string;
  amount: number;
}

export interface QuoteStep {
  op: "quote";
  items: ItemInput[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: DamageInput[] };
}

export type StepInput = QuoteStep | ClaimStep;

export interface ScenarioInput {
  customer: { yearsWithMHPCO: number };
  steps: StepInput[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface Results {
  results: StepResult[];
}

interface Policy {
  items: ItemInput[];
  capRemaining: number;
}

export function runScenario(scenario: ScenarioInput): Results {
  const policies: Policy[] = [];
  let contractsSoFar = 0;
  const results = scenario.steps.map((step) => {
    if (step.op !== "quote") {
      const policy = policies[step.policy];
      const outcome = processDamages(
        step.incident.damages,
        policy.items,
        policy.capRemaining,
      );
      policy.capRemaining = outcome.remainingCap;
      return outcome;
    }
    const isFollowUpContract = contractsSoFar > 0;
    contractsSoFar += 1;
    policies.push({
      items: step.items,
      capRemaining: insuranceCapOf(step.items),
    });
    return {
      premium: quotePremium(
        step.items,
        scenario.customer.yearsWithMHPCO,
        isFollowUpContract,
      ),
    };
  });
  return { results };
}
