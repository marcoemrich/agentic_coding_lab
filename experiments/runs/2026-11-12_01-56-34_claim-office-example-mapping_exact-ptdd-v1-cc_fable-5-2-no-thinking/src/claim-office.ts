import { settleClaim, type Settlement } from "./claim.js";
import type { Damage } from "./coverage.js";
import { issuePolicy, type Policy } from "./policy.js";
import { quotePremium, type Customer } from "./premium.js";
import type { Item } from "./price-list.js";

export type QuoteStep = { op: "quote"; items: Item[] };

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = { premium: number };

export type ClaimResult = Settlement;

type PoliciesByQuoteStep = Map<number, Policy>;

function processQuote(
  customer: Customer,
  step: QuoteStep,
  stepIndex: number,
  policies: PoliciesByQuoteStep,
): QuoteResult {
  const premium = quotePremium(customer, step.items, policies.size);
  policies.set(stepIndex, issuePolicy(step.items));
  return { premium };
}

function referencedPolicy(step: ClaimStep, policies: PoliciesByQuoteStep): Policy {
  const policy = policies.get(step.policy);
  if (policy === undefined) {
    throw new Error(`Claim refers to policy ${step.policy}, but no earlier quote step created it`);
  }
  return policy;
}

function processClaim(step: ClaimStep, policies: PoliciesByQuoteStep): ClaimResult {
  const policy = referencedPolicy(step, policies);
  const settlement = settleClaim(policy, step.incident.damages);
  policy.remainingCap = settlement.remainingCap;
  return settlement;
}

export function processScenario(scenario: Scenario): { results: (QuoteResult | ClaimResult)[] } {
  const { customer, steps } = scenario;
  const policies: PoliciesByQuoteStep = new Map();
  return {
    results: steps.map((step, stepIndex) =>
      step.op === "quote"
        ? processQuote(customer, step, stepIndex, policies)
        : processClaim(step, policies),
    ),
  };
}
