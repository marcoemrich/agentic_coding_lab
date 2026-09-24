import { type ClaimSettlement, processClaim } from "./claimSettlement.js";
import { insureItems, type Policy } from "./policyCoverage.js";
import { quotePremium } from "./premium.js";
import type { Damage } from "./damageReimbursement.js";
import type { Item } from "./magicalItem.js";

export type { Damage, Item };

export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: (QuoteStep | ClaimStep)[] };
export type StepResult = { premium: number } | ClaimSettlement;

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const { yearsWithMHPCO } = scenario.customer;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "claim") {
      return processClaim(policies.get(step.policy) as Policy, step.incident.damages);
    }
    const premium = quotePremium(step.items, yearsWithMHPCO, policies.size);
    policies.set(index, insureItems(step.items));
    return { premium };
  });
  return { results };
}
