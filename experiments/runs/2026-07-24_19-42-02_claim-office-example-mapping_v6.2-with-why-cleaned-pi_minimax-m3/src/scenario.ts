// scenario.ts — runs a sequence of quote and claim steps as a single scenario.
import { claim } from "./claim.js";
import { quote, type QuoteResult } from "./quote.js";
import type { Customer, Damage, Item } from "./types.js";

// Discriminated by `op`: a quote step carries the items to insure, while a
// claim step references an earlier policy by index and describes the incident.
// This lets TypeScript narrow each branch and removes the need for optional
// fields that were always present (or always absent) for one of the variants.
export type ScenarioStep =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface ScenarioInput {
  customer: Customer;
  steps: ScenarioStep[];
}

// Discriminated by shape: a quote result carries the premium, a claim result
// carries the payout and remaining cap. The two variants share no fields, so
// the union narrows unambiguously and consumers can't read properties that
// aren't there.
export type ScenarioResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface ScenarioOutput {
  results: ScenarioResult[];
}

// Tally how many items in `items` share each `key(item)` value. Used to compare
// insured counts against damage counts in validateDamages.
function countByKey<T>(items: T[], key: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

// Validate that every damage entry references an item type actually insured
// on the referenced policy, and that the count of damages per type does not
// exceed the count of insured items of that type.
function validateDamages(policy: QuoteResult, damages: Damage[]): void {
  const insuredCounts = countByKey(policy.items, (item) => item.type);
  const damageCounts = countByKey(damages, (damage) => damage.itemType);
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    if (!insuredCounts.has(damage.itemType)) {
      throw new Error(`Damage for non-insured item type: ${damage.itemType}`);
    }
  }
  for (const [type, count] of damageCounts) {
    const insured = insuredCounts.get(type) ?? 0;
    if (count > insured) {
      throw new Error(
        `Too many damages for item type ${type}: ${count} damages vs ${insured} insured`,
      );
    }
  }
}

// Process one claim step against its policy: validates the damages, computes
// the payout, and returns both the updated policy (with the remaining cap
// decremented) and the result entry to append to the scenario output.
function processClaim(
  policy: QuoteResult,
  damages: Damage[],
): { policy: QuoteResult; result: ScenarioResult } {
  validateDamages(policy, damages);
  const { payout, remainingCap } = claim(policy, damages);
  return {
    policy: { ...policy, capRemaining: remainingCap },
    result: { payout, remainingCap },
  };
}

export function runScenario(input: ScenarioInput): ScenarioOutput {
  const results: ScenarioResult[] = [];
  const policies: QuoteResult[] = [];
  for (const step of input.steps) {
    if (step.op === "quote") {
      // A customer's 2nd+ contract gets the follow-up discount; we can derive
      // this from policies.length (every quote pushes exactly once).
      const isFollowup = policies.length > 0;
      const quoted = quote(step.items, input.customer.yearsWithMHPCO, isFollowup);
      policies.push(quoted);
      results.push({ premium: quoted.premium });
    } else {
      // step.op is narrowed to "claim" here, so step.policy and step.incident are guaranteed.
      const { policy, result } = processClaim(policies[step.policy], step.incident.damages);
      policies[step.policy] = policy;
      results.push(result);
    }
  }
  return { results };
}
