import { createPolicy, processClaim, type Policy } from "./claim.js";
import { quotePremium } from "./quote.js";

export interface ScenarioInput {
  customer: { yearsWithMHPCO: number };
  steps: StepInput[];
}

export type StepInput =
  | { op: "quote"; items: ItemInput[] }
  | { op: "claim"; policy: number; incident: IncidentInput };

export interface ItemInput {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface IncidentInput {
  cause: string;
  damages: { itemType: string; amount: number }[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface ScenarioOutput {
  results: StepResult[];
}

export function runScenario(scenario: ScenarioInput): ScenarioOutput {
  let contractsSeen = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, contractsSeen >= 1);
      contractsSeen += 1;
      policies.set(index, createPolicy(step.items));
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error(`claim references unknown policy step ${step.policy}`);
    }
    return processClaim(policy, step.incident);
  });
  return { results };
}
