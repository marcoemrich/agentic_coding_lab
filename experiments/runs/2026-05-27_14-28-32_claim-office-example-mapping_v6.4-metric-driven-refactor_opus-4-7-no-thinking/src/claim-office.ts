const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

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

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Customer = { yearsWithMHPCO: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const isComponentBlock = (group: Item[]): boolean => group.length === COMPONENT_BLOCK_SIZE;

const sumByLookup = (items: Item[], table: Record<string, number>): number =>
  items.reduce((sum, item) => sum + table[item.type], 0);

const groupByType = (items: Item[]): Item[][] =>
  Object.values(Object.groupBy(items, (item) => item.type));

const basePremiumForGroup = (group: Item[]): number =>
  isComponentBlock(group) ? COMPONENT_BLOCK_PREMIUM : sumByLookup(group, BASE_PREMIUMS);

const basePremiumFor = (items: Item[]): number =>
  groupByType(items).reduce((sum, group) => sum + basePremiumForGroup(group), 0);

type RateRule<T> = { rate: number; applies: (input: T) => boolean };

const SURCHARGE_RULES: RateRule<Item>[] = [
  { rate: CURSE_SURCHARGE_RATE, applies: (item) => !!item.cursed },
  {
    rate: HIGH_ENCHANTMENT_SURCHARGE_RATE,
    applies: (item) => enchantmentOf(item) >= HIGH_ENCHANTMENT_THRESHOLD,
  },
];

const surchargeForRule = (items: Item[], rule: RateRule<Item>): number =>
  items
    .filter(rule.applies)
    .reduce((sum, item) => sum + BASE_PREMIUMS[item.type] * rule.rate, 0);

const surchargesFor = (items: Item[]): number =>
  SURCHARGE_RULES.reduce((total, rule) => total + surchargeForRule(items, rule), 0);

type PolicyContext = { customer: Customer; isFollowUp: boolean };

const POLICY_DISCOUNT_RULES: RateRule<PolicyContext>[] = [
  {
    rate: LOYALTY_DISCOUNT_RATE,
    applies: ({ customer }) => customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
  },
  {
    rate: FOLLOW_UP_DISCOUNT_RATE,
    applies: ({ isFollowUp }) => isFollowUp,
  },
];

const policyDiscountsFor = (base: number, context: PolicyContext): number =>
  POLICY_DISCOUNT_RULES.filter((rule) => rule.applies(context)).reduce(
    (total, rule) => total + base * rule.rate,
    0,
  );

const validateItems = (items: Item[]): void => {
  const unknown = items.find((item) => !(item.type in BASE_PREMIUMS));
  if (unknown) {
    throw new Error(`Unknown item type: "${unknown.type}"`);
  }
};

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): QuoteResult => {
  validateItems(items);
  const base = basePremiumFor(items);
  const surcharges = surchargesFor(items);
  const discounts = policyDiscountsFor(base, { customer, isFollowUp });
  const firstInsurance = base * FIRST_INSURANCE_RATE;
  return {
    premium: Math.ceil(base + surcharges - discounts + firstInsurance + PROCESSING_FEE),
  };
};

const isFollowUpStep = (index: number): boolean => index > 0;

type Policy = { items: Item[]; remainingCap: number };

const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const createPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLIER * sumByLookup(items, INSURANCE_VALUES),
});

const reimbursementFor = (item: Item, amount: number): number =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? amount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : amount;

const payoutForDamage = (damage: Damage, policy: Policy): number => {
  const item = policy.items.find((it) => it.type === damage.itemType);
  const reimbursement = item ? reimbursementFor(item, damage.amount) : damage.amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
};

const countBy = <T>(xs: T[], keyOf: (x: T) => string): Record<string, number> =>
  xs.reduce<Record<string, number>>((acc, x) => {
    const key = keyOf(x);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

const validateNoNegativeDamages = (damages: Damage[]): void => {
  const negative = damages.find((d) => d.amount < 0);
  if (negative) {
    throw new Error(`Negative damage amount for "${negative.itemType}"`);
  }
};

const validateDamageCounts = (damages: Damage[], items: Item[]): void => {
  const damageCounts = countBy(damages, (d) => d.itemType);
  const itemCounts = countBy(items, (i) => i.type);
  const excess = Object.entries(damageCounts).find(
    ([type, count]) => count > (itemCounts[type] ?? 0),
  );
  if (excess) {
    throw new Error(`Damage for "${excess[0]}" exceeds insured count`);
  }
};

const validateDamages = (damages: Damage[], items: Item[]): void => {
  validateNoNegativeDamages(damages);
  validateDamageCounts(damages, items);
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  validateDamages(incident.damages, policy.items);
  const uncappedPayout = incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(damage, policy),
    0,
  );
  const payout = Math.floor(Math.min(uncappedPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

type StepContext = { customer: Customer; index: number; policies: Policy[] };

const STEP_HANDLERS: {
  [K in Step["op"]]: (step: Extract<Step, { op: K }>, context: StepContext) => StepResult;
} = {
  quote: ({ items }, { customer, index, policies }) => {
    policies[index] = createPolicy(items);
    return quotePremium(items, customer, isFollowUpStep(index));
  },
  claim: (step, { policies }) => processClaim(policies[step.policy], step.incident),
};

const runStep = (step: Step, context: StepContext): StepResult =>
  (STEP_HANDLERS[step.op] as (s: Step, c: StepContext) => StepResult)(step, context);

export const processScenario = ({ customer, steps }: Scenario): { results: StepResult[] } => {
  const policies: Policy[] = [];
  const results = steps.map((step, index) => runStep(step, { customer, index, policies }));
  return { results };
};
