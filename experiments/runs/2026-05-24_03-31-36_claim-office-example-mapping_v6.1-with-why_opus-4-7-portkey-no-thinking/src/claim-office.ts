export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

type Customer = { yearsWithMHPCO: number };

export interface QuoteResult { premium: number }
export interface ClaimResult { payout: number; remainingCap: number }

export interface ScenarioResult {
  results: (QuoteResult | ClaimResult)[];
}

const PROCESSING_FEE = 5;

const BASE_PRICE_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const basePriceFor = (item: Item): number => {
  if (!(item.type in BASE_PRICE_BY_TYPE)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return BASE_PRICE_BY_TYPE[item.type];
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const sumBasePrices = (items: Item[]): number =>
  items.reduce((s, i) => s + basePriceFor(i), 0);

const groupByType = (items: Item[]): Map<string, Item[]> => {
  const map = new Map<string, Item[]>();
  for (const item of items) {
    const list = map.get(item.type) ?? [];
    list.push(item);
    map.set(item.type, list);
  }
  return map;
};

const countByKey = <T>(items: T[], key: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
};

const priceForGroup = (group: Item[]): number =>
  isComponent(group[0]) && group.length === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PRICE
    : sumBasePrices(group);

const itemsBasePremium = (items: Item[]): number =>
  Array.from(groupByType(items).values())
    .reduce((sum, group) => sum + priceForGroup(group), 0);

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const perItemSurchargeRate = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_RATE : 0);

const itemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePriceFor(item) * perItemSurchargeRate(item), 0);

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const loyaltyDiscountFor = (base: number, customer: Customer): number =>
  isLoyal(customer) ? base * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscountFor = (base: number, isFollowUp: boolean): number =>
  isFollowUp ? base * FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremium = (step: QuoteStep, customer: Customer, isFollowUp: boolean): number => {
  const base = itemsBasePremium(step.items);
  const total = base
    + itemSurcharges(step.items)
    + base * FIRST_INSURANCE_SURCHARGE_RATE
    - loyaltyDiscountFor(base, customer)
    - followUpDiscountFor(base, isFollowUp);
  return Math.ceil(total + PROCESSING_FEE);
};

type Policy = { items: Item[]; remainingCap: number };

const insuranceSum = (items: Item[]): number =>
  items.reduce((s, i) => s + INSURANCE_VALUE_BY_TYPE[i.type], 0);

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const claimableDamage = (damage: Damage, item: Item): number =>
  isHighlyEnchanted(item)
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;

const reimbursableFor = (damage: Damage, item: Item): number =>
  Math.max(0, claimableDamage(damage, item) - DEDUCTIBLE);

const findPolicyItem = (items: Item[], itemType: string): Item => {
  const item = items.find((i) => i.type === itemType);
  if (!item) throw new Error(`Item ${itemType} not in policy`);
  return item;
};

const payoutForDamage = (damage: Damage, items: Item[]): number =>
  reimbursableFor(damage, findPolicyItem(items, damage.itemType));

const totalPayoutWithinCap = (damages: Damage[], items: Item[], cap: number): number =>
  damages.reduce(
    (paid, damage) => paid + Math.min(payoutForDamage(damage, items), cap - paid),
    0,
  );

const assertNonNegativeDamages = (damages: Damage[]): void => {
  const negative = damages.find((d) => d.amount < 0);
  if (negative) throw new Error(`Negative damage amount: ${negative.amount}`);
};

const assertDamagesCoveredByPolicy = (damages: Damage[], items: Item[]): void => {
  const itemCounts = countByKey(items, (i) => i.type);
  const damageCounts = countByKey(damages, (d) => d.itemType);
  for (const [type, count] of damageCounts) {
    if (count > (itemCounts.get(type) ?? 0)) {
      throw new Error(`More ${type} damages than policy covers`);
    }
  }
};

const processClaim = (step: ClaimStep, policies: Policy[]): ClaimResult => {
  assertNonNegativeDamages(step.incident.damages);
  const policy = policies[step.policy];
  assertDamagesCoveredByPolicy(step.incident.damages, policy.items);
  const payout = totalPayoutWithinCap(step.incident.damages, policy.items, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout: Math.floor(payout), remainingCap: policy.remainingCap };
};

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSum(items) * CAP_MULTIPLIER,
});

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  const results: (QuoteResult | ClaimResult)[] = [];
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      const isFollowUp = stepIndex > 0;
      policies[stepIndex] = openPolicy(step.items);
      results.push({ premium: quotePremium(step, scenario.customer, isFollowUp) });
    } else {
      results.push(processClaim(step, policies));
    }
  });
  return { results };
};
