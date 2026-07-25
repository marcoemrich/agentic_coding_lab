export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type DamageEntry = { itemType: string; amount: number };
export type Incident = { cause: string; damages: DamageEntry[] };
export type ClaimResult = { payout: number; remainingCap: number };
export type QuoteResult = { premium: number };
export type Result = QuoteResult | ClaimResult;
export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = { op: "claim"; policy: number; incident: Incident };
export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

export class ClaimOfficeError extends Error {}

// Single source of truth for each insured item type: its base premium
// (what the customer pays) and its insurance value (what is covered).
const ITEM_CATALOG: Record<
  string,
  { basePremium: number; insuranceValue: number }
> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

function basePremiumFor(item: Item): number {
  return ITEM_CATALOG[item.type].basePremium;
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_DISCOUNT = 15;

function totalBlockDiscount(items: Item[]): number {
  const componentCounts = countBy(
    items.filter((item) => COMPONENT_TYPES.has(item.type)),
    (item) => item.type,
  );
  const blockCount = Object.values(componentCounts).filter(
    (count) => count === BLOCK_SIZE,
  ).length;
  return blockCount * BLOCK_DISCOUNT;
}

function sumBy<T>(items: T[], valueFor: (item: T) => number): number {
  return items.reduce((sum, item) => sum + valueFor(item), 0);
}

// Tallies occurrences of each key produced by `keyFor`. Single representation
// of the increment-or-default histogram idiom shared by premium and claim
// validation logic.
function countBy<T>(
  items: T[],
  keyFor: (item: T) => string,
): Record<string, number> {
  return items.reduce<Record<string, number>>((counts, item) => {
    const key = keyFor(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

export function policyBasePremium(items: Item[]): number {
  return sumBy(items, basePremiumFor) - totalBlockDiscount(items);
}

function insuranceValueFor(item: Item): number {
  return ITEM_CATALOG[item.type].insuranceValue;
}

export function insuranceSum(items: Item[]): number {
  return sumBy(items, insuranceValueFor);
}

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

// An item's effective enchantment level, treating an absent value as 0.
// Single representation of the domain rule shared by premium and claim logic.
function enchantmentLevel(item: Item): number {
  return item.enchantment ?? 0;
}

function hasHighEnchantment(item: Item): boolean {
  return enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;
}

// A rate-based monetary adjustment of `rate * base` applies only when its
// condition is active. `rate` may be negative (a discount).
function adjustmentWhen(
  active: boolean | undefined,
  rate: number,
  base: number,
): number {
  return active ? rate * base : 0;
}

function itemSurchargeFor(item: Item): number {
  const base = basePremiumFor(item);
  return (
    adjustmentWhen(item.cursed, CURSE_SURCHARGE_RATE, base) +
    adjustmentWhen(hasHighEnchantment(item), HIGH_ENCHANTMENT_SURCHARGE_RATE, base)
  );
}

export function itemSurcharges(items: Item[]): number {
  return sumBy(items, itemSurchargeFor);
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

export function quotePremium(
  yearsWithMHPCO: number,
  items: Item[],
  isFollowUp: boolean,
): number {
  const base = policyBasePremium(items);
  const surcharges = itemSurcharges(items);
  const firstInsurance = FIRST_INSURANCE_RATE * base;
  const loyalty = adjustmentWhen(
    yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS,
    -LOYALTY_DISCOUNT_RATE,
    base,
  );
  const followUp = adjustmentWhen(isFollowUp, -FOLLOW_UP_DISCOUNT_RATE, base);
  return Math.ceil(
    base + surcharges + firstInsurance + loyalty + followUp + PROCESSING_FEE,
  );
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1.0;

function reimbursementRate(item: Item): number {
  return enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_CLAIM_RATE
    : FULL_REIMBURSEMENT_RATE;
}

function validateAmounts(incident: Incident): void {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new ClaimOfficeError(`Damage amount must not be negative: ${damage.amount}`);
    }
  }
}

function validateCoverage(policyItems: Item[], incident: Incident): void {
  const damageCounts = countBy(incident.damages, (damage) => damage.itemType);
  const insuredCounts = countBy(policyItems, (item) => item.type);
  for (const [itemType, damageCount] of Object.entries(damageCounts)) {
    const insuredCount = insuredCounts[itemType] ?? 0;
    if (damageCount > insuredCount) {
      throw new ClaimOfficeError(
        `Damage entries for ${itemType} (${damageCount}) exceed insured count (${insuredCount})`,
      );
    }
  }
}

export function processClaim(
  policyItems: Item[],
  incident: Incident,
  remainingCapBefore: number,
): ClaimResult {
  validateAmounts(incident);
  validateCoverage(policyItems, incident);
  const rawPayout = sumBy(incident.damages, (damage) => {
    const item = policyItems.find((i) => i.type === damage.itemType) as Item;
    return damage.amount * reimbursementRate(item) - DEDUCTIBLE;
  });
  const payout = Math.min(Math.max(0, Math.floor(rawPayout)), remainingCapBefore);
  return { payout, remainingCap: remainingCapBefore - payout };
}

function assertKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in ITEM_CATALOG)) {
      throw new ClaimOfficeError(`Unknown item type: ${item.type}`);
    }
  }
}

const CAP_MULTIPLIER = 2;

export function processScenario(scenario: Scenario): Result[] {
  const yearsWithMHPCO = scenario.customer.yearsWithMHPCO;
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  let isFollowUp = false;
  const results: Result[] = [];
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const items = step.items;
      assertKnownItemTypes(items);
      const premium = quotePremium(yearsWithMHPCO, items, isFollowUp);
      policies.set(index, {
        items,
        remainingCap: CAP_MULTIPLIER * insuranceSum(items),
      });
      isFollowUp = true;
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (policy === undefined) {
        throw new ClaimOfficeError(`No policy at step index ${step.policy}`);
      }
      const claimResult = processClaim(
        policy.items,
        step.incident,
        policy.remainingCap,
      );
      policy.remainingCap = claimResult.remainingCap;
      results.push(claimResult);
    }
  });
  return results;
}
