export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

const MAIN_ITEMS: Record<string, { premium: number; value: number }> = {
  sword: { premium: 100, value: 1000 },
  amulet: { premium: 60, value: 600 },
  staff: { premium: 80, value: 800 },
  potion: { premium: 40, value: 400 },
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

export class ClaimOfficeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClaimOfficeError";
  }
}

const KNOWN_ITEM_TYPES = new Set<string>([
  ...Object.keys(MAIN_ITEMS),
  ...COMPONENT_TYPES,
]);

const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new ClaimOfficeError(`unknown item type: ${item.type}`);
    }
  }
};

const isComponent = (type: string): boolean =>
  COMPONENT_TYPES.includes(type);

const countOccurrences = (values: string[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const value of values) {
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return counts;
};

const componentCountByType = (items: Item[]): Record<string, number> =>
  countOccurrences(items.filter((item) => isComponent(item.type)).map((item) => item.type));

export const componentGroupPremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_BASE_PREMIUM;

export type QuoteStep = { op: "quote"; items: Item[] };
export type Damage = { itemType: string; amount: number };
export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
export type Step = QuoteStep | ClaimStep;
export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};
export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const COMPONENT_VALUE = 250;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const itemInsuranceValue = (item: Item): number =>
  isComponent(item.type) ? COMPONENT_VALUE : MAIN_ITEMS[item.type].value;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_CLAIM_RATE
    : FULL_REIMBURSEMENT_RATE;

const damageReimbursement = (damage: Damage, items: Item[]): number => {
  if (damage.amount < 0) {
    throw new ClaimOfficeError(`negative damage amount: ${damage.amount}`);
  }
  const item = items.find((policyItem) => policyItem.type === damage.itemType);
  if (item === undefined) {
    throw new ClaimOfficeError(`damage item not in policy: ${damage.itemType}`);
  }
  return damage.amount * reimbursementRate(item) - DEDUCTIBLE;
};

type Policy = { items: Item[]; remainingCap: number };

const assertDamagesCovered = (damages: Damage[], items: Item[]): void => {
  const damageCounts = countOccurrences(damages.map((d) => d.itemType));
  const insuredCounts = countOccurrences(items.map((i) => i.type));
  for (const type of Object.keys(damageCounts)) {
    if (damageCounts[type] > (insuredCounts[type] ?? 0)) {
      throw new ClaimOfficeError(`more damages than insured for type: ${type}`);
    }
  }
};

const itemBasePremium = (item: Item): number =>
  isComponent(item.type) ? COMPONENT_BASE_PREMIUM : MAIN_ITEMS[item.type].premium;

const conditionalAmount = (applies: boolean, base: number, rate: number): number =>
  applies ? base * rate : 0;

const itemSurcharge = (item: Item): number => {
  const base = itemBasePremium(item);
  const cursedSurcharge = conditionalAmount(!!item.cursed, base, CURSED_SURCHARGE_RATE);
  const highEnchantmentSurcharge = conditionalAmount(
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    base,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
  );
  return cursedSurcharge + highEnchantmentSurcharge;
};

const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number => {
  const base = basePremium(items);
  const surcharge = items.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const loyaltyDiscount = conditionalAmount(yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS, base, LOYALTY_DISCOUNT_RATE);
  const followUpDiscount = conditionalAmount(isFollowUp, base, FOLLOW_UP_DISCOUNT_RATE);
  return Math.ceil(base + surcharge - loyaltyDiscount - followUpDiscount + base * FIRST_INSURANCE_RATE + PROCESSING_FEE);
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  for (const [index, step] of scenario.steps.entries()) {
    if (step.op === "quote") {
      assertKnownItemTypes(step.items);
      const isFollowUp = quoteCount > 0;
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUp);
      policies.set(index, { items: step.items, remainingCap: CAP_MULTIPLIER * insuranceSum(step.items) });
      results.push({ premium });
      quoteCount += 1;
      continue;
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new ClaimOfficeError(`unknown policy: ${step.policy}`);
    }
    assertDamagesCovered(step.incident.damages, policy.items);
    const totalReimbursable = step.incident.damages.reduce(
      (sum, damage) => sum + damageReimbursement(damage, policy.items),
      0,
    );
    const payout = Math.floor(Math.max(0, Math.min(totalReimbursable, policy.remainingCap)));
    policy.remainingCap -= payout;
    results.push({ payout, remainingCap: policy.remainingCap });
  }
  return { results };
};

export const basePremium = (items: Item[]): number => {
  let total = 0;
  for (const item of items) {
    if (!isComponent(item.type)) {
      total += itemBasePremium(item);
    }
  }
  const counts = componentCountByType(items);
  for (const type of Object.keys(counts)) {
    total += componentGroupPremium(counts[type]);
  }
  return total;
};
