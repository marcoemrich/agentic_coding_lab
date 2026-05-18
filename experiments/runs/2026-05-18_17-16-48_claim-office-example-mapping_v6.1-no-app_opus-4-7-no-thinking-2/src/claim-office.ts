const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;

type Customer = { yearsWithMHPCO: number };

type Item = {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};

type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;

type Scenario = { customer: Customer; steps: Step[] };

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_UNIT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const isKnownItemType = (type: string): boolean =>
  type in BASE_PREMIUM_BY_TYPE || COMPONENT_TYPES.has(type);

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const mainItemBase = (item: Item): number => BASE_PREMIUM_BY_TYPE[item.type] ?? 0;

const componentBaseForCount = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_UNIT_PREMIUM;

const countsByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const mainItemsBase = (items: Item[]): number =>
  items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + mainItemBase(item), 0);

const componentsBase = (items: Item[]): number => {
  const components = items.filter(isComponent);
  let total = 0;
  for (const count of countsByType(components).values()) {
    total += componentBaseForCount(count);
  }
  return total;
};

const policyBaseFor = (items: Item[]): number =>
  mainItemsBase(items) + componentsBase(items);

const itemSurcharges = (items: Item[]): number => {
  let total = 0;
  for (const item of items) {
    const base = mainItemBase(item);
    if (item.cursed) total += base * CURSE_SURCHARGE_RATE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
  }
  return total;
};

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const policyBase = policyBaseFor(items);
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  const surchargesTotal = itemSurcharges(items);
  return (
    Math.ceil(
      policyBase + surchargesTotal + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount,
    ) + PROCESSING_FEE
  );
};

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (INSURANCE_VALUE_BY_TYPE[item.type] ?? 0), 0);

type Policy = { items: Item[]; remainingCap: number };

const findItem = (items: Item[], itemType: string): Item | undefined =>
  items.find((it) => it.type === itemType);

const payoutForDamage = (item: Item, damageAmount: number): number => {
  let covered = damageAmount;
  // 50% rule wins when both apply (dragon material + high enchantment)
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    covered = covered * HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  return Math.max(0, covered - DEDUCTIBLE);
};

const processClaim = (
  policy: Policy,
  incident: Incident,
): { payout: number; remainingCap: number } => {
  let totalPayout = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    const item = findItem(policy.items, damage.itemType);
    if (!item) throw new Error(`Damage references unknown item type: ${damage.itemType}`);
    totalPayout += payoutForDamage(item, damage.amount);
  }
  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  const finalPayout = Math.floor(cappedPayout);
  policy.remainingCap -= finalPayout;
  return { payout: finalPayout, remainingCap: policy.remainingCap };
};

export const runScenario = (input: unknown): unknown => {
  const scenario = input as Scenario;
  const policies: Policy[] = [];
  let quoteCount = 0;
  const results: Array<{ premium: number } | { payout: number; remainingCap: number }> = [];

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      validateItems(step.items);
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      const premium = quotePremium(step.items, scenario.customer, isFollowUp);
      const insuranceSum = insuranceSumFor(step.items);
      policies.push({ items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER });
      results.push({ premium });
    } else {
      const policy = policies[step.policy];
      results.push(processClaim(policy, step.incident));
    }
  }
  return { results };
};
