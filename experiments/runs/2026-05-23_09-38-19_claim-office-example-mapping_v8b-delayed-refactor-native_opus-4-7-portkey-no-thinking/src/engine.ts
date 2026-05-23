import { isKnownItem } from "./catalog.js";
import { processClaim } from "./claim.js";
import { computePremium, getInsuranceSum } from "./quote.js";
import {
  ClaimStep,
  Output,
  Policy,
  QuoteStep,
  Scenario,
  StepResult,
} from "./types.js";

export function runScenario(scenario: Scenario): Output {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let priorQuotes = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      results.push(handleQuote(step, scenario, priorQuotes > 0, policies, i));
      priorQuotes += 1;
    } else {
      results.push(handleClaim(step, policies));
    }
  }

  return { results };
}

function handleQuote(
  step: QuoteStep,
  scenario: Scenario,
  isFollowUp: boolean,
  policies: Map<number, Policy>,
  stepIndex: number,
): StepResult {
  for (const item of step.items) {
    if (!isKnownItem(item)) {
      throw new Error(`Unknown item type in quote: ${item.type}`);
    }
  }
  const premium = computePremium(step.items, scenario.customer, isFollowUp);
  const insuranceSum = getInsuranceSum(step.items);
  policies.set(stepIndex, {
    items: step.items,
    insuranceSum,
    remainingCap: 2 * insuranceSum,
  });
  return { premium };
}

function handleClaim(
  step: ClaimStep,
  policies: Map<number, Policy>,
): StepResult {
  const policy = policies.get(step.policy);
  if (!policy) {
    throw new Error(`Claim references unknown policy: ${step.policy}`);
  }
  const { payout, remainingCap } = processClaim(policy, step.incident.damages);
  policy.remainingCap = remainingCap;
  return { payout, remainingCap };
}
