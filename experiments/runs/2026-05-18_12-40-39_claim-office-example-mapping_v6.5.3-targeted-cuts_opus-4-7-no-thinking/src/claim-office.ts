const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const FP_EPSILON = 1e-9;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  rune: 25,
  moonstone: 25,
};

type Item = { type: string; cursed?: boolean; enchantment?: number };
type Customer = { yearsWithMHPCO: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

const DEDUCTIBLE = 100;
const INSURANCE_VALUE_MULTIPLIER = 10;
const CAP_MULTIPLIER = 2;

const insuranceValue = (type: string): number =>
  BASE_PREMIUM[type] * INSURANCE_VALUE_MULTIPLIER;

const sum = (numbers: number[]): number =>
  numbers.reduce((acc, n) => acc + n, 0);

// round up to whole G in MHPCO's favor, using epsilon to fight FP error
const roundUpInMHPCOFavor = (amount: number): number =>
  Math.ceil(amount - FP_EPSILON);

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

const countByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (acc, item) => acc.set(item.type, (acc.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

const typeGroupPremium = (type: string, count: number): number =>
  COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PRICE
    : count * BASE_PREMIUM[type];

const itemsBasePremium = (items: Item[]): number =>
  sum(
    Array.from(countByType(items), ([type, count]) =>
      typeGroupPremium(type, count),
    ),
  );

type Rule<T> = { applies: (subject: T) => boolean; rate: number };

const sumApplicableRates = <T>(base: number, subject: T, rules: Rule<T>[]): number =>
  sum(rules.map((rule) => (rule.applies(subject) ? base * rule.rate : 0)));

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const SURCHARGE_RULES: Rule<Item>[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE_RATE },
  {
    applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    rate: HIGH_ENCHANTMENT_RATE,
  },
];

const itemSurcharge = (item: Item): number =>
  sumApplicableRates(BASE_PREMIUM[item.type], item, SURCHARGE_RULES);

const itemSurcharges = (items: Item[]): number =>
  sum(items.map(itemSurcharge));

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

type PolicyContext = { customer: Customer; isFollowup: boolean };

const POLICY_DISCOUNT_RULES: Rule<PolicyContext>[] = [
  {
    applies: (ctx) => ctx.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    rate: -LOYALTY_DISCOUNT_RATE,
  },
  { applies: (ctx) => ctx.isFollowup, rate: -FOLLOWUP_DISCOUNT_RATE },
];

const policyModifiers = (policyBase: number, ctx: PolicyContext): number =>
  policyBase * FIRST_INSURANCE_RATE +
  sumApplicableRates(policyBase, ctx, POLICY_DISCOUNT_RULES);

const assertKnownItemType = (item: Item): void => {
  if (!(item.type in BASE_PREMIUM)) {
    throw new Error(`unknown item type: ${item.type}`);
  }
};

const quote = ({ items }: QuoteStep, ctx: PolicyContext): { premium: number } => {
  items.forEach(assertKnownItemType);
  const policyBase = itemsBasePremium(items);
  const total =
    policyBase +
    itemSurcharges(items) +
    policyModifiers(policyBase, ctx) +
    PROCESSING_FEE;
  return { premium: roundUpInMHPCOFavor(total) };
};

type Policy = { items: Item[]; remainingCap: number };

const policyInsuranceSum = (items: Item[]): number =>
  sum(items.map((item) => insuranceValue(item.type)));

const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
const FULL_PAYOUT_RATE = 1;

const payoutRate = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? HIGH_ENCHANTMENT_PAYOUT_RATE
    : FULL_PAYOUT_RATE;

const assertNonNegativeDamage = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`negative damage amount: ${damage.amount}`);
  }
};

const damagePayout = (damage: Damage, item: Item): number => {
  assertNonNegativeDamage(damage);
  return Math.max(0, damage.amount * payoutRate(item) - DEDUCTIBLE);
};

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: policyInsuranceSum(items) * CAP_MULTIPLIER,
});

const processQuote = (
  step: QuoteStep,
  customer: Customer,
  policies: Policy[],
) => {
  const result = quote(step, { customer, isFollowup: policies.length > 0 });
  policies.push(openPolicy(step.items));
  return result;
};

const findInsuredItem = (policy: Policy, itemType: string): Item => {
  const item = policy.items.find((i) => i.type === itemType);
  if (item === undefined) {
    throw new Error(`item type not in policy: ${itemType}`);
  }
  return item;
};

const uncappedClaimPayout = (policy: Policy, incident: Incident): number =>
  sum(incident.damages.map((d) => damagePayout(d, findInsuredItem(policy, d.itemType))));

const processClaim = (step: ClaimStep, policies: Policy[]) => {
  const policy = policies[step.policy];
  const payout = Math.min(uncappedClaimPayout(policy, step.incident), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (input: unknown): unknown => {
  const { customer, steps } = input as Scenario;
  const policies: Policy[] = [];
  const results = steps.map((step) =>
    step.op === "quote"
      ? processQuote(step, customer, policies)
      : processClaim(step, policies),
  );
  return { results };
};
