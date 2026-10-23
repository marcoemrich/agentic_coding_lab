import { quotePremium } from "./premium.js";
import { createPolicy, processClaim, type Policy } from "./claim.js";
import { insuranceValueOf } from "./catalog.js";

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: DamageEntry[];
}

export interface ScenarioStep {
  op: string;
  items?: QuoteItem[];
  policy?: number;
  incident?: Incident;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: ScenarioStep[];
}

export interface StepResult {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  let contractNumber = 0;
  const results: StepResult[] = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      contractNumber += 1;
      const items = step.items ?? [];
      policies.set(stepIndex, registerPolicy(items));
      return {
        premium: quotePremium(items, scenario.customer, contractNumber),
      };
    }
    if (step.op === "claim") {
      const policy = policies.get(step.policy ?? -1);
      if (!policy) {
        throw new Error(`no policy at step ${step.policy}`);
      }
      const outcome = processClaim(policy, step.incident?.damages ?? []);
      return { payout: outcome.payout, remainingCap: outcome.remainingCap };
    }
    throw new Error(`unknown operation: ${step.op}`);
  });
  return { results };
}

function registerPolicy(items: QuoteItem[]): Policy {
  return createPolicy(
    items.map((item) => ({
      type: item.type,
      insuranceValue: insuranceValueOf(item.type),
      material: item.material,
      enchantment: item.enchantment,
    }))
  );
}
