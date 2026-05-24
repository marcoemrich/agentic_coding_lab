export type Item = {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
};

export type QuoteStep = { op: "quote"; items: Item[] };

export type Damage = { itemType: string; amount: number };
export type Incident = { cause: string; damages: Damage[] };
export type ClaimStep = { op: "claim"; policy: number; incident: Incident };

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResult = {
  results: StepResult[];
};

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_RATE = 0.1;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const unitPrice = (type: string): number => {
  const price = BASE_PREMIUMS[type];
  if (price === undefined) throw new Error(`Unknown item type: ${type}`);
  return price;
};

const insuranceValue = (type: string): number => {
  const value = INSURANCE_VALUES[type];
  if (value === undefined) throw new Error(`Unknown item type: ${type}`);
  return value;
};

const countBy = <T>(values: T[], key: (value: T) => string): Map<string, number> =>
  values.reduce(
    (counts, value) => counts.set(key(value), (counts.get(key(value)) ?? 0) + 1),
    new Map<string, number>()
  );

const groupTotal = (type: string, count: number): number =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE
    ? BLOCK_PRICE
    : count * unitPrice(type);

const sumBasePremiums = (items: Item[]): number =>
  Array.from(countBy(items, (item) => item.type)).reduce(
    (total, [type, count]) => total + groupTotal(type, count),
    0
  );

const itemSurcharges = (item: Item): number => {
  const base = unitPrice(item.type);
  const curse = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curse + enchantment;
};

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

const loyaltyDiscount = (
  basePremiums: number,
  customer: { yearsWithMHPCO: number }
): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? basePremiums * LOYALTY_DISCOUNT_RATE
    : 0;

const followupDiscount = (basePremiums: number, quoteIndex: number): number =>
  quoteIndex > 0 ? basePremiums * FOLLOWUP_DISCOUNT_RATE : 0;

const quote = (
  { items }: QuoteStep,
  customer: { yearsWithMHPCO: number },
  quoteIndex: number
): QuoteResult => {
  const basePremiums = sumBasePremiums(items);
  const raw =
    basePremiums +
    sumItemSurcharges(items) -
    loyaltyDiscount(basePremiums, customer) +
    basePremiums * FIRST_INSURANCE_RATE -
    followupDiscount(basePremiums, quoteIndex) +
    PROCESSING_FEE;
  return { premium: Math.ceil(raw) };
};

type Policy = {
  items: Item[];
  cap: number;
  remainingCap: number;
};

const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce(
    (sum, item) => sum + insuranceValue(item.type),
    0
  );
  const cap = insuranceSum * CAP_MULTIPLIER;
  return { items, cap, remainingCap: cap };
};

const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const reimbursableAmount = (damage: Damage, item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damage.amount;

const damagePayout = (damage: Damage, item: Item): number =>
  Math.max(0, reimbursableAmount(damage, item) - DEDUCTIBLE);

const sumDamagePayouts = (damages: Damage[], items: Item[]): number =>
  damages.reduce((sum, d) => {
    const item = items.find((i) => i.type === d.itemType);
    if (!item) throw new Error(`Item ${d.itemType} not in policy`);
    return sum + damagePayout(d, item);
  }, 0);

const validateDamageAmounts = (damages: Damage[]): void => {
  const negative = damages.find((d) => d.amount < 0);
  if (negative) throw new Error(`Damage amount cannot be negative: ${negative.amount}`);
};

const validateDamageCounts = (damages: Damage[], items: Item[]): void => {
  const itemCounts = countBy(items, (item) => item.type);
  countBy(damages, (d) => d.itemType).forEach((count, type) => {
    if (count > (itemCounts.get(type) ?? 0)) {
      throw new Error(`Too many damages for item type ${type}`);
    }
  });
};

const claim = (step: ClaimStep, policies: Map<number, Policy>): ClaimResult => {
  const policy = policies.get(step.policy);
  if (!policy) throw new Error(`Policy ${step.policy} not found`);
  validateDamageAmounts(step.incident.damages);
  validateDamageCounts(step.incident.damages, policy.items);
  const desired = sumDamagePayouts(step.incident.damages, policy.items);
  const payout = Math.min(desired, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout: Math.floor(payout), remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies = new Map<number, Policy>();
  let quoteIndex = 0;
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      policies.set(index, createPolicy(step.items));
      const result = quote(step, scenario.customer, quoteIndex);
      quoteIndex++;
      return result;
    }
    return claim(step, policies);
  });
  return { results };
};
