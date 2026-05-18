type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;

type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const basePremiumOf = (item: Item): number => BASE_PREMIUM_BY_ITEM_TYPE[item.type] ?? 0;
const insuranceValueOf = (item: Item): number => INSURANCE_VALUE_BY_ITEM_TYPE[item.type] ?? 0;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const groupByType = (items: Item[]): Map<string, Item[]> => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return groups;
};

const basePremiumForGroup = (group: Item[]): number => {
  const first = group[0];
  if (isComponent(first) && group.length === BLOCK_SIZE) return BLOCK_BASE_PREMIUM;
  return group.reduce((sum, item) => sum + basePremiumOf(item), 0);
};

const basePremiumForItems = (items: Item[]): number => {
  let total = 0;
  for (const group of groupByType(items).values()) {
    total += basePremiumForGroup(group);
  }
  return total;
};

type ItemSurcharge = (item: Item) => number;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const cursedSurcharge: ItemSurcharge = (item) =>
  item.cursed ? basePremiumOf(item) * CURSED_SURCHARGE_RATE : 0;

const highEnchantmentSurcharge: ItemSurcharge = (item) =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? basePremiumOf(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;

const ITEM_SURCHARGES: ItemSurcharge[] = [cursedSurcharge, highEnchantmentSurcharge];

const itemSurchargesForItems = (items: Item[]): number =>
  items.reduce(
    (sum, item) => sum + ITEM_SURCHARGES.reduce((s, rule) => s + rule(item), 0),
    0,
  );

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const loyaltyDiscount = (base: number, yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? base * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscount = (base: number, isFollowUp: boolean): number =>
  isFollowUp ? base * FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremium = (step: QuoteStep, customer: Customer, isFollowUp: boolean): number => {
  const base = basePremiumForItems(step.items);
  const itemSurcharges = itemSurchargesForItems(step.items);
  const firstInsurance = base * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyalty = loyaltyDiscount(base, customer.yearsWithMHPCO);
  const followUp = followUpDiscount(base, isFollowUp);
  return Math.ceil(base + firstInsurance - loyalty - followUp + itemSurcharges + PROCESSING_FEE);
};

type Policy = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

const buildPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const HIGH_ENCH_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCH_REIMBURSEMENT_THRESHOLD = 8;

const reimbursementAmount = (damage: Damage, item: Item): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCH_REIMBURSEMENT_THRESHOLD) {
    return damage.amount * HIGH_ENCH_REIMBURSEMENT_RATE;
  }
  return damage.amount;
};

const payoutForDamage = (damage: Damage, item: Item): number =>
  Math.max(reimbursementAmount(damage, item) - DEDUCTIBLE, 0);

const matchDamageToItem = (damage: Damage, available: Item[]): Item | undefined => {
  const idx = available.findIndex((i) => i.type === damage.itemType);
  if (idx < 0) return undefined;
  const [item] = available.splice(idx, 1);
  return item;
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  const available = [...policy.items];
  let rawPayout = 0;
  for (const damage of incident.damages) {
    const item = matchDamageToItem(damage, available);
    if (!item) throw new Error(`Damage to ${damage.itemType} but not insured`);
    rawPayout += payoutForDamage(damage, item);
  }
  const capped = Math.min(rawPayout, policy.remainingCap);
  const payout = Math.floor(capped);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const validateQuoteItems = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM_BY_ITEM_TYPE)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const validateIncident = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policies: (Policy | undefined)[] = [];
  let quoteCount = 0;
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      validateQuoteItems(step.items);
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      const premium = quotePremium(step, scenario.customer, isFollowUp);
      policies.push(buildPolicy(step.items));
      return { premium };
    }
    validateIncident(step.incident);
    const policy = policies[step.policy];
    if (!policy) throw new Error(`Unknown policy index ${step.policy}`);
    policies.push(undefined);
    return processClaim(policy, step.incident);
  });
  return { results };
};
