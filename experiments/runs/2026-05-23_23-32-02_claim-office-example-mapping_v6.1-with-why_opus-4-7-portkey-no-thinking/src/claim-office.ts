const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const BLOCK_OF_3_BASE_PREMIUM = 60;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

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

type Policy = { items: Item[]; insuranceSum: number; cap: number; capRemaining: number };

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const itemSurcharges = (item: Item): number => {
  const base = BASE_PREMIUM[item.type];
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const highEnchSurcharge =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return curseSurcharge + highEnchSurcharge;
};

const countBy = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const itemTypeKey = (item: Item): string => item.type;
const damageTypeKey = (damage: Damage): string => damage.itemType;

const componentGroupBase = (type: string, count: number): number =>
  count === 3 ? BLOCK_OF_3_BASE_PREMIUM : count * BASE_PREMIUM[type];

const policyBase = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const mainItems = items.filter((item) => !isComponent(item));
  const mainBase = mainItems.reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  const componentBase = Array.from(countBy(components, itemTypeKey)).reduce(
    (sum, [type, count]) => sum + componentGroupBase(type, count),
    0,
  );
  return mainBase + componentBase;
};

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

const loyaltyDiscount = (customer: Customer, base: number): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? base * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscount = (isFollowUp: boolean, base: number): number =>
  isFollowUp ? base * FOLLOW_UP_DISCOUNT_RATE : 0;

const totalDiscounts = (customer: Customer, isFollowUp: boolean, base: number): number =>
  loyaltyDiscount(customer, base) + followUpDiscount(isFollowUp, base);

const isKnownItemType = (type: string): boolean => BASE_PREMIUM[type] !== undefined;

const assertKnownItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown) {
    throw new Error(`unknown item type: ${unknown.type}`);
  }
};

const quoteStep = (step: QuoteStep, customer: Customer, isFollowUp: boolean): QuoteResult => {
  assertKnownItemTypes(step.items);
  const base = policyBase(step.items);
  const firstInsurance = base * FIRST_INSURANCE_SURCHARGE_RATE;
  const premium =
    base +
    firstInsurance +
    sumItemSurcharges(step.items) -
    totalDiscounts(customer, isFollowUp, base) +
    PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const makePolicy = (items: Item[]): Policy => {
  const sum = insuranceSum(items);
  const cap = sum * CAP_MULTIPLIER;
  return { items, insuranceSum: sum, cap, capRemaining: cap };
};

const isHighEnchantmentClaim = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reducedDamage = (amount: number, item: Item): number =>
  isHighEnchantmentClaim(item) ? amount * HIGH_ENCHANTMENT_CLAIM_RATE : amount;

const findInsuredItem = (policy: Policy, itemType: string): Item => {
  const item = policy.items.find((i) => i.type === itemType);
  if (!item) {
    throw new Error(`damage references item not in policy: ${itemType}`);
  }
  return item;
};

const assertNonNegativeDamage = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`damage amount must be non-negative: ${damage.amount}`);
  }
};

const damagePayout = (damage: Damage, policy: Policy): number => {
  assertNonNegativeDamage(damage);
  const item = findInsuredItem(policy, damage.itemType);
  return reducedDamage(damage.amount, item) - DEDUCTIBLE;
};

const totalPayout = (damages: Damage[], policy: Policy): number =>
  damages.reduce((sum, d) => sum + damagePayout(d, policy), 0);

const assertDamagesCovered = (damages: Damage[], policy: Policy): void => {
  const itemCounts = countBy(policy.items, itemTypeKey);
  const damageCounts = countBy(damages, damageTypeKey);
  for (const [type, count] of damageCounts) {
    if (count > (itemCounts.get(type) ?? 0)) {
      throw new Error(`more damages of type ${type} than insured`);
    }
  }
};

const claimStep = (step: ClaimStep, policies: Policy[]): ClaimResult => {
  const policy = policies[step.policy];
  assertDamagesCovered(step.incident.damages, policy);
  const payout = Math.floor(Math.min(totalPayout(step.incident.damages, policy), policy.capRemaining));
  policy.capRemaining -= payout;
  return { payout, remainingCap: policy.capRemaining };
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const isFollowUp = policies.length > 0;
      policies.push(makePolicy(step.items));
      return quoteStep(step, scenario.customer, isFollowUp);
    }
    return claimStep(step, policies);
  });
  return { results };
};
