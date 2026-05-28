const PROCESSING_FEE = 5;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const CURSED_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;

type Rule<T> = { applies: (subject: T) => boolean; rate: number };

const sumBy = <T>(items: T[], f: (item: T) => number): number =>
  items.reduce((sum, item) => sum + f(item), 0);

const sumApplicableRates = <T>(rules: Rule<T>[], subject: T): number =>
  sumBy(
    rules.filter((rule) => rule.applies(subject)),
    (rule) => rule.rate,
  );

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const SURCHARGE_RULES: Rule<Item>[] = [
  { applies: isCursed, rate: CURSED_RATE },
  { applies: isHighlyEnchanted, rate: HIGH_ENCHANTMENT_RATE },
];

const countByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

const basePremiumFor = (type: string) => {
  const base = BASE_PREMIUM[type];
  if (base === undefined) throw new Error(`Unknown item type: ${type}`);
  return base;
};

const premiumForType = (type: string, count: number) => {
  if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * basePremiumFor(type);
};

const surchargeForItem = (item: Item) =>
  basePremiumFor(item.type) * sumApplicableRates(SURCHARGE_RULES, item);

const policyBasePremium = (items: Item[]) =>
  sumBy([...countByType(items)], ([type, count]) => premiumForType(type, count));

const totalItemSurcharges = (items: Item[]) => sumBy(items, surchargeForItem);

const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOWUP_RATE = 0.15;

type QuoteContext = { customer: Customer; stepIndex: number };

const POLICY_DISCOUNT_RULES: Rule<QuoteContext>[] = [
  {
    applies: ({ customer }) => customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS,
    rate: -LOYALTY_RATE,
  },
  { applies: ({ stepIndex }) => stepIndex > 0, rate: -FOLLOWUP_RATE },
];

const policyAdjustmentRate = (ctx: QuoteContext) =>
  FIRST_INSURANCE_RATE + sumApplicableRates(POLICY_DISCOUNT_RULES, ctx);

const quote = (items: Item[], customer: Customer, stepIndex: number) => {
  const policyBase = policyBasePremium(items);
  const adjustment = policyBase * policyAdjustmentRate({ customer, stepIndex });
  const premium = policyBase + adjustment + totalItemSurcharges(items);
  return { premium: Math.ceil(premium) + PROCESSING_FEE };
};

const INSURANCE_VALUE_MULTIPLIER = 10;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const insuranceValueFor = (type: string) =>
  basePremiumFor(type) * INSURANCE_VALUE_MULTIPLIER;

const insuranceSum = (items: Item[]) =>
  sumBy(items, (item) => insuranceValueFor(item.type));

const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const reimbursableAmount = (item: Item, damage: Damage) =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;

const assertValidDamage = (damage: Damage) => {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
};

const payoutForDamage = (item: Item, damage: Damage) => {
  assertValidDamage(damage);
  return Math.max(0, reimbursableAmount(item, damage) - DEDUCTIBLE);
};

type PolicyState = { items: Item[]; remainingCap: number };

const consumeItem = (available: Item[], itemType: string): Item => {
  const idx = available.findIndex((i) => i.type === itemType);
  if (idx === -1) throw new Error(`No insured ${itemType} in policy`);
  return available.splice(idx, 1)[0];
};

const totalPayout = (items: Item[], damages: Damage[]) => {
  const available = [...items];
  return sumBy(damages, (damage) =>
    payoutForDamage(consumeItem(available, damage.itemType), damage),
  );
};

const newPolicy = (items: Item[]): PolicyState => ({
  items,
  remainingCap: insuranceSum(items) * CAP_MULTIPLIER,
});

const claim = (policy: PolicyState, damages: Damage[]) => {
  const uncappedPayout = totalPayout(policy.items, damages);
  const payout = Math.floor(Math.min(uncappedPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const run = (input: Scenario): unknown => {
  const policies: PolicyState[] = [];
  const results = input.steps.map((step, i) => {
    if (step.op === "quote") {
      policies[i] = newPolicy(step.items);
      return quote(step.items, input.customer, i);
    }
    return claim(policies[step.policy], step.incident.damages);
  });
  return { results };
};
