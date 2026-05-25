import {
  computePremium,
  policyInsuranceSum,
  type Customer,
  type Item,
} from "./pricing.js";
import { processClaim, type Incident } from "./claims.js";

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
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
export type StepResult = QuoteResult | ClaimResult;

interface PolicyState {
  items: Item[];
  insuranceSum: number;
  paidOut: number;
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const results: StepResult[] = [];
  const policies = new Map<number, PolicyState>();
  let contractCount = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      const premium = computePremium(step.items, scenario.customer, contractCount);
      const insuranceSum = policyInsuranceSum(step.items);
      policies.set(i, {
        items: step.items,
        insuranceSum,
        paidOut: 0,
      });
      contractCount++;
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) {
        results.push({ payout: 0, remainingCap: 0 });
        continue;
      }
      const { payout, remainingCap } = processClaim(
        step.incident,
        policy.items,
        policy.insuranceSum,
        policy.paidOut,
      );
      policy.paidOut += payout;
      results.push({ payout, remainingCap });
    }
  }

  return { results };
}
