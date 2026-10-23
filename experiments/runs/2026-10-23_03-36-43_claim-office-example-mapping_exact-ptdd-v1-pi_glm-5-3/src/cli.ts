import { readFileSync } from "node:fs";
import {
  isClaimStep,
  newPolicyCap,
  settleClaim,
  type ClaimStep,
  type Policy,
} from "./claim.ts";
import {
  isKnownItemType,
  quotePremium,
  type Customer,
  type QuoteStep,
} from "./premium.ts";

/** Reads the scenario JSON document from stdin (fd 0). */
function readStdin(): string {
  return readFileSync(0, "utf8");
}

/** A scenario step, as the CLI schema defines it. */
interface ScenarioStep {
  op: "quote" | "claim";
  items?: Array<{ type: string }>;
}

function isQuoteStep(step: ScenarioStep): step is QuoteStep {
  return step.op === "quote";
}

/** Policies by step index, as later claim steps reference them. */
function policiesByStepIndex(steps: ScenarioStep[]): Map<number, Policy> {
  const policies = new Map<number, Policy>();
  steps.forEach((step, index) => {
    if (isQuoteStep(step)) {
      policies.set(index, { items: step.items });
    }
  });
  return policies;
}

/** Rejects a quote whose items name types outside the MHPCO price list. */
function quoteValidationError(items: Array<{ type: string }>): string | null {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      return `unknown item type: ${item.type}`;
    }
  }
  return null;
}

/** Count of each type in a list, keyed by type. */
function typeCounts(types: Array<string>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
}

/** Rejects a claim that damages an uncovered item, names a negative damage amount, or damages more items of a type than the policy covers. */
function claimValidationError(claim: ClaimStep, policies: Map<number, Policy>): string | null {
  const coveredTypes = policies.get(claim.policy)?.items.map((item) => item.type) ?? [];
  const coveredCount = typeCounts(coveredTypes);
  const damageCount = typeCounts(claim.incident.damages.map((damage) => damage.itemType));
  for (const [type, count] of damageCount) {
    if ((coveredCount.get(type) ?? 0) < count) {
      return `more ${type} damages than the policy covers (policy ${claim.policy})`;
    }
  }
  for (const damage of claim.incident.damages) {
    if (!coveredTypes.includes(damage.itemType)) {
      return `damage to uncovered item: ${damage.itemType} (policy ${claim.policy})`;
    }
    if (damage.amount < 0) {
      return `negative damage amount: ${damage.amount} (${damage.itemType})`;
    }
  }
  return null;
}

/**
 * Rejects the scenario with an error description when any step breaks
 * the CLI's input contract: unknown item types in quotes, or damage to
 * uncovered items, negative damage amounts, or more damages of a type
 * than the policy covers in claims.
 */
function validateScenario(scenario: {
  customer: Customer;
  steps: ScenarioStep[];
}): string | null {
  const policies = policiesByStepIndex(scenario.steps);
  const stepError = (step: ScenarioStep): string | null =>
    isQuoteStep(step)
      ? quoteValidationError(step.items)
      : isClaimStep(step)
        ? claimValidationError(step, policies)
        : null;
  for (const step of scenario.steps) {
    const error = stepError(step);
    if (error !== null) {
      return error;
    }
  }
  return null;
}

const scenario = JSON.parse(readStdin()) as { customer: Customer; steps: ScenarioStep[] };
const validationError = validateScenario(scenario);
if (validationError !== null) {
  process.stderr.write(`claim-office: ${validationError}`);
  process.exit(1);
}
const policies: Array<Policy> = [];
const remainingCapByPolicy = new Map<number, number>();
let quoteCount = 0;
const results = scenario.steps.map((step) => {
  if (isQuoteStep(step)) {
    const premium = quotePremium(step, scenario.customer, quoteCount > 0);
    quoteCount += 1;
    policies.push({ items: step.items });
    return { premium };
  }
  if (isClaimStep(step)) {
    const policy = policies[step.policy];
    const remaining = remainingCapByPolicy.get(step.policy) ?? newPolicyCap(policy);
    const settled = settleClaim(step, policy, remaining);
    remainingCapByPolicy.set(step.policy, settled.remainingCap);
    return settled;
  }
  return { premium: 0 };
});
process.stdout.write(JSON.stringify({ results }));
