export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Damage = { itemType: string; amount: number };
export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
export type Step = QuoteStep | ClaimStep;
export type Result = { premium: number } | { payout: number };

const DEDUCTIBLE = 100;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// ---------- Generic collection helpers ----------

const countBy = <T>(items: ReadonlyArray<T>, keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const sumValues = (counts: Map<string, number>, valueFor: (count: number) => number): number => {
  let total = 0;
  for (const count of counts.values()) {
    total += valueFor(count);
  }
  return total;
};

const partition = <T>(items: ReadonlyArray<T>, predicate: (item: T) => boolean): [T[], T[]] => {
  const matches: T[] = [];
  const rest: T[] = [];
  for (const item of items) {
    (predicate(item) ? matches : rest).push(item);
  }
  return [matches, rest];
};

// ---------- Item catalog ----------

const isKnownItemType = (item: Item): boolean => item.type in BASE_PREMIUM_BY_TYPE;

const basePremiumFor = (item: Item): number => BASE_PREMIUM_BY_TYPE[item.type] ?? 0;

const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

// ---------- Components & base premium ----------

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;
const COMPONENT_UNIT_PRICE = 25;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const roundPremium = (amount: number): number => Math.ceil(amount);

const priceForComponentCount = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PRICE : count * COMPONENT_UNIT_PRICE;

const typeOf = (item: Item): string => item.type;

const baseForItems = (items: Item[]): number => {
  const [components, nonComponents] = partition(items, isComponent);
  const componentBase = sumValues(countBy(components, typeOf), priceForComponentCount);
  const nonComponentBase = nonComponents.reduce((sum, item) => sum + basePremiumFor(item), 0);
  return componentBase + nonComponentBase;
};

const curseSurchargeFor = (item: Item): number =>
  item.cursed ? basePremiumFor(item) * CURSE_RATE : 0;

const highEnchantmentSurchargeFor = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? basePremiumFor(item) * HIGH_ENCHANTMENT_RATE
    : 0;

const PER_ITEM_MODIFIERS: ReadonlyArray<(item: Item) => number> = [
  curseSurchargeFor,
  highEnchantmentSurchargeFor,
];

const modifiersForItem = (item: Item): number =>
  PER_ITEM_MODIFIERS.reduce((sum, modifier) => sum + modifier(item), 0);

const itemModifiersFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + modifiersForItem(item), 0);

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

type PolicyContext = { yearsWithMHPCO: number; isFollowUp: boolean };
type PolicyModifier = (base: number, context: PolicyContext) => number;

const firstInsuranceSurcharge: PolicyModifier = (base) => base * FIRST_INSURANCE_RATE;

const loyaltyDiscount: PolicyModifier = (base, { yearsWithMHPCO }) =>
  yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? -base * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscount: PolicyModifier = (base, { isFollowUp }) =>
  isFollowUp ? -base * FOLLOW_UP_DISCOUNT_RATE : 0;

const POLICY_MODIFIERS: ReadonlyArray<PolicyModifier> = [
  firstInsuranceSurcharge,
  loyaltyDiscount,
  followUpDiscount,
];

const policyAdjustmentFor = (base: number, context: PolicyContext): number =>
  POLICY_MODIFIERS.reduce((sum, modifier) => sum + modifier(base, context), 0);

const quotePremium = (items: Item[], context: PolicyContext): number => {
  const base = baseForItems(items);
  return roundPremium(base + itemModifiersFor(items) + policyAdjustmentFor(base, context) + PROCESSING_FEE);
};

const FULL_REIMBURSEMENT_RATE = 1;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

const isHighEnchantmentForClaim = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursementRateFor = (item: Item): number =>
  isHighEnchantmentForClaim(item) ? HIGH_ENCHANTMENT_CLAIM_RATE : FULL_REIMBURSEMENT_RATE;

const payoutForDamage = (damage: Damage, item: Item): number =>
  Math.floor(damage.amount * reimbursementRateFor(item) - DEDUCTIBLE);

const damageItemType = (damage: Damage): string => damage.itemType;

const requireItemByType = (policyItemsByType: Map<string, Item[]>, itemType: string): Item => {
  const matches = policyItemsByType.get(itemType);
  if (matches === undefined || matches.length === 0) {
    throw new Error(`Item type not in policy: ${itemType}`);
  }
  return matches[0];
};

const assertDamageIsValid = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
};

const assertDamageCountsWithinPolicy = (damages: Damage[], policyItems: Item[]): void => {
  const insuredCounts = countBy(policyItems, typeOf);
  const damageCounts = countBy(damages, damageItemType);
  for (const [itemType, count] of damageCounts) {
    if (count > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(`More damages of type ${itemType} than policy covers`);
    }
  }
};

const groupByType = (items: Item[]): Map<string, Item[]> => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const bucket = groups.get(item.type) ?? [];
    bucket.push(item);
    groups.set(item.type, bucket);
  }
  return groups;
};

const computePayout = (claim: ClaimStep, policyItems: Item[]): number => {
  const { damages } = claim.incident;
  damages.forEach(assertDamageIsValid);
  assertDamageCountsWithinPolicy(damages, policyItems);
  const policyItemsByType = groupByType(policyItems);
  return damages.reduce(
    (sum, damage) => sum + payoutForDamage(damage, requireItemByType(policyItemsByType, damage.itemType)),
    0,
  );
};

type ScenarioState = {
  readonly yearsWithMHPCO: number;
  readonly policyItemsByIndex: Map<number, Item[]>;
  quoteCount: number;
};

const handleQuote = (step: QuoteStep, index: number, state: ScenarioState): Result => {
  assertKnownItemTypes(step.items);
  state.policyItemsByIndex.set(index, step.items);
  const premium = quotePremium(step.items, {
    yearsWithMHPCO: state.yearsWithMHPCO,
    isFollowUp: state.quoteCount > 0,
  });
  state.quoteCount++;
  return { premium };
};

const handleClaim = (step: ClaimStep, state: ScenarioState): Result => ({
  payout: computePayout(step, state.policyItemsByIndex.get(step.policy) ?? []),
});

export const runScenario = (input: {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}): { results: Result[] } => {
  const state: ScenarioState = {
    yearsWithMHPCO: input.customer.yearsWithMHPCO,
    policyItemsByIndex: new Map<number, Item[]>(),
    quoteCount: 0,
  };
  const results: Result[] = input.steps.map((step, index) =>
    step.op === "quote" ? handleQuote(step, index, state) : handleClaim(step, state),
  );
  return { results };
};
