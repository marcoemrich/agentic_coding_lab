import {
  ClaimOfficeError,
  type Item,
  quotePremium,
} from "./quote.js";
import {
  createPolicy,
  processClaim,
  type Damage,
  type Policy,
} from "./claim.js";

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause?: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type QuoteResult = { premium: number };
export type ClaimStepResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimStepResult;

export interface ScenarioResult {
  results: StepResult[];
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const { customer, steps } = scenario;
  const policies: Policy[] = [];
  let contractsSoFar = 0;
  const results: StepResult[] = [];
  for (const step of steps) {
    if (step.op === "quote") {
      const isFirstContract = contractsSoFar === 0;
      const premium = quotePremium(step.items, {
        yearsWithMHPCO: customer.yearsWithMHPCO,
        isFirstContract,
      });
      policies.push(createPolicy(step.items));
      contractsSoFar += 1;
      results.push({ premium });
    } else {
      const policy = policies[step.policy];
      if (!policy) {
        throw new ClaimOfficeError(
          `claim references unknown policy index ${step.policy}`,
        );
      }
      const claimResult = processClaim(policy, step.incident.damages);
      policies[step.policy] = { ...policy, paidOut: policy.paidOut + claimResult.payout };
      results.push(claimResult);
    }
  }
  return { results };
}
