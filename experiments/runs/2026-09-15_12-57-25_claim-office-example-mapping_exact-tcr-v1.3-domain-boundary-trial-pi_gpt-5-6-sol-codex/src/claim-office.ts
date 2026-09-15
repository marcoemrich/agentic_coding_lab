import { premiumFor, type Item, validateKnownItems } from "./premium.js";

const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_DIVISOR = 2;
const CAP_MULTIPLIER = 2;
const INSURANCE_VALUE: Readonly<Record<string, number>> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { damages: Array<{ itemType: string; amount: number }> };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function policyFor(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursableDamageFor(item: Item, amount: number): number {
  return (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? amount / HALF_REIMBURSEMENT_DIVISOR
    : amount;
}

function validateDamageAmounts(step: ClaimStep): void {
  if (step.incident.damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount must not be negative");
  }
}

function validateCoveredDamages(policy: Policy, step: ClaimStep): void {
  const damageTypes = new Set(step.incident.damages.map((damage) => damage.itemType));
  for (const type of damageTypes) {
    const insured = policy.items.filter((item) => item.type === type).length;
    const damaged = step.incident.damages.filter((damage) => damage.itemType === type).length;
    if (damaged > insured) throw new Error(`Damage to uninsured item: ${type}`);
  }
}

function desiredPayoutFor(policy: Policy, step: ClaimStep): number {
  validateDamageAmounts(step);
  validateCoveredDamages(policy, step);
  return step.incident.damages.reduce((total, damage) => {
    const item = policy.items.find((insured) => insured.type === damage.itemType)!;
    return total + Math.max(0, reimbursableDamageFor(item, damage.amount) - DEDUCTIBLE);
  }, 0);
}

function settleClaim(policy: Policy, step: ClaimStep): unknown {
  const payout = Math.floor(Math.min(desiredPayoutFor(policy, step), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function executeScenario(scenario: Scenario): unknown {
  const policies = new Map<number, Policy>();
  let quotes = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      validateKnownItems(step.items);
      policies.set(index, policyFor(step.items));
      return { premium: premiumFor(step.items, scenario.customer.yearsWithMHPCO, quotes++ > 0) };
    }
    return settleClaim(policies.get(step.policy)!, step);
  });
  return { results };
}
