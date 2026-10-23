import type {
  ClaimResult,
  Damage,
  ItemInput,
  Policy,
  QuoteInput,
  ScenarioInput,
  ScenarioOutput,
  StepResult,
} from "./types.js";
import { claim } from "./claim.js";
import { quote } from "./quote.js";

function processQuoteStep(
  input: ScenarioInput,
  items: ItemInput[],
  quoteCount: number,
): { result: StepResult; policy: Policy; nextQuoteCount: number } {
  const quoteInput: QuoteInput = {
    customer: input.customer,
    items,
    quoteNumber: quoteCount,
  };
  const { premium, policy } = quote(quoteInput);
  return { result: { premium }, policy, nextQuoteCount: quoteCount + 1 };
}

function processClaimStep(
  policies: Policy[],
  policyIndex: number,
  damage: Damage,
): { result: StepResult; updatedPolicy: Policy } {
  const policy = policies[policyIndex];
  if (!policy) {
    throw new Error(`Invalid policy index: ${policyIndex}`);
  }
  const claimResult: ClaimResult = claim(policy, damage);
  policy.remainingCap = claimResult.remainingCap;
  return {
    result: {
      payout: claimResult.payout,
      remainingCap: claimResult.remainingCap,
    },
    updatedPolicy: policy,
  };
}

export function processScenario(input: ScenarioInput): ScenarioOutput {
  const policies: Policy[] = [];
  const results: StepResult[] = [];
  let quoteCount = 0;

  for (const step of input.steps) {
    if (step.op === "quote") {
      const { result, policy, nextQuoteCount } = processQuoteStep(
        input,
        step.items,
        quoteCount,
      );
      policies.push(policy);
      results.push(result);
      quoteCount = nextQuoteCount;
    } else {
      const { result } = processClaimStep(policies, step.policy, step.incident);
      results.push(result);
    }
  }

  return { results };
}

export { quote, claim };
