import { quotePremium, isKnownItemType, type Item } from "./quote.js";
import { createPolicy, processClaim, type Damage, type Policy } from "./claim.js";

type Customer = { yearsWithMHPCO: number };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
export type Scenario = { customer: Customer; steps: Step[] };

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

// Throws if any item has a type not recognised by the quote module.
const assertKnownItemTypes = (items: readonly Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

// How many items of the given type the policy insures.
const coverageCount = (policy: Policy, itemType: string): number =>
  policy.items.filter((item) => item.type === itemType).length;

// Throws if a damage references an unknown item, has a negative amount,
// or claims more damaged items of a type than the policy covers.
const assertValidDamages = (
  policy: Policy,
  damages: readonly Damage[]
): void => {
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    if (coverageCount(policy, damage.itemType) === 0) {
      throw new Error(`damage references item not in policy: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new Error(`damage amount must be non-negative: ${damage.amount}`);
    }
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  for (const [itemType, damaged] of Object.entries(damageCounts)) {
    const covered = coverageCount(policy, itemType);
    if (damaged > covered) {
      throw new Error(
        `damages for ${itemType} (${damaged}) exceed coverage (${covered})`
      );
    }
  }
};

export const executeScenario = (scenario: Scenario): StepResult[] => {
  const policies: Policy[] = [];
  const results: StepResult[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      assertKnownItemTypes(step.items);
      const premium = quotePremium(step.items, scenario.customer, policies.length > 0);
      policies.push(createPolicy(step.items));
      results.push({ premium });
    } else {
      const policy = policies[step.policy];
      assertValidDamages(policy, step.incident.damages);
      const claimResult = processClaim(policy, step.incident.damages);
      policies[step.policy] = { ...policy, remainingCap: claimResult.remainingCap };
      results.push({ payout: claimResult.payout, remainingCap: claimResult.remainingCap });
    }
  }
  return results;
};
