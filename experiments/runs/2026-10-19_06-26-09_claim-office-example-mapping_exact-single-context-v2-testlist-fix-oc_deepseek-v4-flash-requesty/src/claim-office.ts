export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Step =
  | { op: "quote"; items: Item[] }
  | {
      op: "claim";
      policy: number;
      incident: { cause: string; damages: { itemType: string; amount: number }[] };
    };

export type Damage = { itemType: string; amount: number };

interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

const MAIN_ITEMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
};
const COMPONENT_INSURANCE_VALUE = 250;
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HALF_RATE = 0.5;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function isKnownItemType(type: string): boolean {
  return type in MAIN_ITEMS || COMPONENT_TYPES.has(type);
}

function assertKnownItemType(type: string): void {
  if (!isKnownItemType(type)) {
    throw new Error(`unknown item type: ${type}`);
  }
}

function itemBasePremium(item: Item): number {
  return isComponent(item) ? COMPONENT_PREMIUM : MAIN_ITEMS[item.type];
}

function computeBasePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let total = 0;
  for (const item of items) {
    const componentCount = componentCounts.get(item.type);
    if (isComponent(item)) {
      componentCounts.set(item.type, (componentCount ?? 0) + 1);
    } else {
      total += MAIN_ITEMS[item.type];
    }
  }
  for (const count of componentCounts.values()) {
    total +=
      count === COMPONENT_BLOCK_SIZE
        ? COMPONENT_BLOCK_PREMIUM
        : count * COMPONENT_PREMIUM;
  }
  return total;
}

function computeItemSurcharges(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    const base = itemBasePremium(item);
    if (item.cursed) {
      total += CURSE_RATE * base;
    }
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += HIGH_ENCHANTMENT_RATE * base;
    }
  }
  return total;
}

function quotePremium(
  yearsWithMHPCO: number,
  items: Item[],
  isFollowUpContract: boolean
): number {
  const base = computeBasePremium(items);
  const surcharges = computeItemSurcharges(items);
  const firstInsuranceSurcharge = FIRST_INSURANCE_RATE * base;
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
      ? LOYALTY_DISCOUNT_RATE * base
      : 0;
  const followUpDiscount = isFollowUpContract
    ? FOLLOW_UP_DISCOUNT_RATE * base
    : 0;
  return Math.ceil(
    base +
      surcharges +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE
  );
}

function buildPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce(
    (sum, item) =>
      sum +
      (isComponent(item) ? COMPONENT_INSURANCE_VALUE : INSURANCE_VALUES[item.type]),
    0
  );
  const cap = CAP_MULTIPLIER * insuranceSum;
  return { items, insuranceSum, cap, remainingCap: cap };
}

export function createPolicy(items: Item[]): {
  insuranceSum: number;
  cap: number;
} {
  const policy = buildPolicy(items);
  return { insuranceSum: policy.insuranceSum, cap: policy.cap };
}

function reimbursementRate(policyItem: Item): number {
  return (policyItem.enchantment ?? 0) >= HIGH_CLAIM_ENCHANTMENT_THRESHOLD
    ? HALF_RATE
    : 1;
}

function assertDamageItemCovered(policy: Policy, damage: Damage): void {
  if (!isKnownItemType(damage.itemType)) {
    throw new Error(`unknown item type: ${damage.itemType}`);
  }
  if (!policy.items.find((item) => item.type === damage.itemType)) {
    throw new Error(`item not covered by policy: ${damage.itemType}`);
  }
}

function assertValidDamage(policy: Policy, damage: Damage): void {
  assertDamageItemCovered(policy, damage);
  if (damage.amount < 0) {
    throw new Error(`negative damage amount: ${damage.amount}`);
  }
}

function assertNoOverCoverage(policy: Policy, damages: Damage[]): void {
  const damageCounts = new Map<string, number>();
  for (const damage of damages) {
    damageCounts.set(
      damage.itemType,
      (damageCounts.get(damage.itemType) ?? 0) + 1
    );
  }
  for (const [type, count] of damageCounts) {
    const covered = policy.items.filter((item) => item.type === type).length;
    if (count > covered) {
      throw new Error(`more damages than covered items for type ${type}`);
    }
  }
}

function processClaim(policy: Policy, damages: Damage[]): number {
  for (const damage of damages) {
    assertValidDamage(policy, damage);
  }
  assertNoOverCoverage(policy, damages);
  const desiredPayout = damages.reduce((total, damage) => {
    const policyItem = policy.items.find(
      (item) => item.type === damage.itemType
    )!;
    const payout =
      damage.amount * reimbursementRate(policyItem) - DEDUCTIBLE;
    return total + payout;
  }, 0);
  const payout = Math.min(Math.floor(desiredPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return payout;
}

export function runScenario(scenario: Scenario): { results: unknown[] } {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      quoteCount += 1;
      for (const item of step.items) {
        assertKnownItemType(item.type);
      }
      const premium = quotePremium(
        scenario.customer.yearsWithMHPCO,
        step.items,
        quoteCount > 1
      );
      policies.set(stepIndex, buildPolicy(step.items));
      return { premium };
    }
    const policy = policies.get(step.policy)!;
    return {
      payout: processClaim(policy, step.incident.damages),
      remainingCap: policy.remainingCap,
    };
  });
  return { results };
}