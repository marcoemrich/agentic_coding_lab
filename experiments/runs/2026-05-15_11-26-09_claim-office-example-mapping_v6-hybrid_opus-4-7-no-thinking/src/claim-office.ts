export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Damage = { itemType: string; amount: number };
export type Incident = { cause: string; damages: Damage[] };
export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = { op: "claim"; policy: number; incident: Incident };
export type Step = QuoteStep | ClaimStep;
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type ScenarioResult = { results: Array<QuoteResult | ClaimResult> };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

type Customer = { yearsWithMHPCO: number };
const COMPONENT_UNIT_BASE = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE = 60;

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const isKnownMainItem = (item: Item): boolean => item.type in MAIN_ITEM_BASE_PREMIUM;

type BillingGroup = { base: number; cursed: boolean; enchantment: number };

const componentBundleBase = (count: number): number => {
  if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_BASE;
  return count * COMPONENT_UNIT_BASE;
};

const mainItemGroup = (item: Item): BillingGroup => ({
  base: MAIN_ITEM_BASE_PREMIUM[item.type],
  cursed: item.cursed === true,
  enchantment: item.enchantment ?? 0,
});

const componentBundleGroup = (count: number): BillingGroup => ({
  base: componentBundleBase(count),
  cursed: false,
  enchantment: 0,
});

const countBy = <T>(entries: T[], keyOf: (entry: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = keyOf(entry);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const billingGroups = (items: Item[]): BillingGroup[] => {
  const mainItems: Item[] = [];
  const components: Item[] = [];
  for (const item of items) {
    if (isComponent(item)) components.push(item);
    else if (isKnownMainItem(item)) mainItems.push(item);
    else throw new Error(`Unknown item type: ${item.type}`);
  }
  const componentGroups = [...countBy(components, (i) => i.type).values()].map(componentBundleGroup);
  return [...mainItems.map(mainItemGroup), ...componentGroups];
};

const groupPremium = ({ base, cursed, enchantment }: BillingGroup): number => {
  const curseSurcharge = cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge =
    enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_RATE;
  return base + curseSurcharge + enchantmentSurcharge + firstInsuranceSurcharge;
};

const sumGroupPremiums = (groups: BillingGroup[]): number =>
  groups.reduce((sum, g) => sum + groupPremium(g), 0);

const policyBaseOf = (groups: BillingGroup[]): number =>
  groups.reduce((sum, g) => sum + g.base, 0);

const loyaltyDiscountOf = (policyBase: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? policyBase * LOYALTY_DISCOUNT_RATE : 0;

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const groups = billingGroups(items);
  const itemsTotal = sumGroupPremiums(groups);
  const policyBase = policyBaseOf(groups);
  const loyaltyDiscount = loyaltyDiscountOf(policyBase, customer);
  const followUpDiscount = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(itemsTotal - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
};

type Policy = { items: Item[]; cap: number };

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + ITEM_INSURANCE_VALUE[item.type], 0);

const isHighlyEnchantedForPayout = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;

const reimbursableAmount = (amount: number, item: Item): number =>
  isHighlyEnchantedForPayout(item) ? amount * HIGH_ENCHANTMENT_PAYOUT_RATE : amount;

const assertNonNegativeDamage = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`Invalid negative damage amount: ${damage.amount}`);
  }
};

const damagePayout = (damage: Damage, item: Item): number => {
  assertNonNegativeDamage(damage);
  return Math.max(0, reimbursableAmount(damage.amount, item) - DEDUCTIBLE);
};

const insuredItemOf = (policy: Policy, itemType: string): Item => {
  const item = policy.items.find((i) => i.type === itemType);
  if (item === undefined) {
    throw new Error(`Item not in policy: ${itemType}`);
  }
  return item;
};

const assertDamagesCovered = (policy: Policy, incident: Incident): void => {
  const itemCounts = countBy(policy.items, (i) => i.type);
  const damageCounts = countBy(incident.damages, (d) => d.itemType);
  for (const [type, dCount] of damageCounts) {
    const iCount = itemCounts.get(type);
    if (iCount !== undefined && dCount > iCount) {
      throw new Error(`More ${type} damages than items insured in policy`);
    }
  }
};

const incidentPayout = (policy: Policy, incident: Incident): number => {
  assertDamagesCovered(policy, incident);
  return incident.damages.reduce(
    (sum, d) => sum + damagePayout(d, insuredItemOf(policy, d.itemType)),
    0,
  );
};

const newPolicy = (items: Item[]): Policy => ({
  items,
  cap: insuranceSumOf(items) * CAP_MULTIPLIER,
});

const cappedPayout = (policy: Policy, incident: Incident): number =>
  Math.floor(Math.min(incidentPayout(policy, incident), policy.cap));

const settleClaim = (policy: Policy, incident: Incident): ClaimResult => {
  const payout = cappedPayout(policy, incident);
  policy.cap -= payout;
  return { payout, remainingCap: policy.cap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  const results = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const isFollowUp = policies.length > 0;
      policies.push(newPolicy(step.items));
      return { premium: quotePremium(step.items, scenario.customer, isFollowUp) };
    }
    return settleClaim(policies[step.policy], step.incident);
  });
  return { results };
};
