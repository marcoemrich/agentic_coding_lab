type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
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
const FIRST_INSURANCE_RATE = 0.1;

const ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_MULTIPLIER = 10;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const sumBy = <T>(items: T[], f: (x: T) => number): number =>
  items.reduce((acc, x) => acc + f(x), 0);

const baseFor = (item: Item): number => {
  const base = ITEM_BASE_PREMIUMS[item.type];
  if (base === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return base;
};

const SURCHARGE_RULES: ReadonlyArray<{ applies: (item: Item) => boolean; rate: number }> = [
  { applies: (item) => item.cursed === true, rate: CURSE_RATE },
  { applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD, rate: HIGH_ENCHANTMENT_RATE },
];

const surchargeFor = (item: Item): number => {
  const base = baseFor(item);
  return sumBy(SURCHARGE_RULES, (rule) => (rule.applies(item) ? base * rule.rate : 0));
};

const totalSurchargeFor = (items: Item[]): number => sumBy(items, surchargeFor);

type QuoteContext = { customer: Customer; isFollowUp: boolean };

const DISCOUNT_RULES: ReadonlyArray<{ applies: (ctx: QuoteContext) => boolean; rate: number }> = [
  { applies: (ctx) => ctx.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS, rate: LOYALTY_RATE },
  { applies: (ctx) => ctx.isFollowUp, rate: FOLLOW_UP_RATE },
];

const totalDiscountFor = (ctx: QuoteContext, totalBase: number): number =>
  sumBy(DISCOUNT_RULES, (rule) => (rule.applies(ctx) ? totalBase * rule.rate : 0));

const premiumFor = (totalBase: number, totalSurcharge: number, ctx: QuoteContext): number =>
  Math.ceil(
    totalBase
    + totalSurcharge
    + totalBase * FIRST_INSURANCE_RATE
    - totalDiscountFor(ctx, totalBase)
    + PROCESSING_FEE,
  );

const groupsByType = (items: Item[]): Item[][] => {
  const types = new Set(items.map((item) => item.type));
  return Array.from(types, (type) => items.filter((item) => item.type === type));
};

const formsCompleteBlock = (group: Item[]): boolean =>
  group.length === BLOCK_SIZE && COMPONENT_TYPES.has(group[0].type);

const baseForGroup = (group: Item[]): number =>
  formsCompleteBlock(group) ? BLOCK_BASE_PREMIUM : sumBy(group, baseFor);

const totalBaseFor = (items: Item[]): number =>
  sumBy(groupsByType(items), baseForGroup);

const insuranceValueFor = (item: Item): number =>
  baseFor(item) * INSURANCE_VALUE_MULTIPLIER;

const insuranceSumFor = (items: Item[]): number => sumBy(items, insuranceValueFor);

type Policy = { items: Item[]; remainingCap: number };

const newPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSumFor(items) * CAP_MULTIPLIER,
});

const reimbursementRateFor = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;

const payoutForDamage = (damage: Damage, items: Item[]): number => {
  const item = items.find((i) => i.type === damage.itemType)!;
  const reimbursed = damage.amount * reimbursementRateFor(item);
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

type DamageValidation = {
  invalid: (damage: Damage, items: Item[]) => boolean;
  message: (damage: Damage) => string;
};

const DAMAGE_VALIDATIONS: ReadonlyArray<DamageValidation> = [
  {
    invalid: (d) => d.amount < 0,
    message: (d) => `Damage amount must be non-negative: ${d.amount}`,
  },
  {
    invalid: (d, items) => !items.some((i) => i.type === d.itemType),
    message: (d) => `Claim references item type not in policy: ${d.itemType}`,
  },
];

const countByKey = <T>(items: T[], key: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
};

const findOverclaimedType = (damages: Damage[], items: Item[]): string | undefined => {
  const itemCounts = countByKey(items, (i) => i.type);
  const damageCounts = countByKey(damages, (d) => d.itemType);
  const exceedsInsured = ([type, count]: [string, number]): boolean =>
    count > (itemCounts.get(type) ?? 0);
  return Array.from(damageCounts).find(exceedsInsured)?.[0];
};

const validateDamageCountsAgainstPolicy = (damages: Damage[], items: Item[]): void => {
  const type = findOverclaimedType(damages, items);
  if (type) throw new Error(`More damages of type ${type} than insured items`);
};

const validateDamagesAgainstPolicy = (damages: Damage[], items: Item[]): void => {
  for (const rule of DAMAGE_VALIDATIONS) {
    const bad = damages.find((d) => rule.invalid(d, items));
    if (bad) throw new Error(rule.message(bad));
  }
  validateDamageCountsAgainstPolicy(damages, items);
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  validateDamagesAgainstPolicy(incident.damages, policy.items);
  const grossPayout = sumBy(incident.damages, (d) => payoutForDamage(d, policy.items));
  const payout = Math.floor(Math.min(grossPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const quoteFor = ({ items }: QuoteStep, ctx: QuoteContext): QuoteResult => ({
  premium: premiumFor(totalBaseFor(items), totalSurchargeFor(items), ctx),
});

type ScenarioState = { customer: Customer; policies: Policy[]; quoteCount: number };

const handleQuote = (step: QuoteStep, state: ScenarioState): QuoteResult => {
  const ctx: QuoteContext = { customer: state.customer, isFollowUp: state.quoteCount > 0 };
  state.quoteCount += 1;
  state.policies.push(newPolicy(step.items));
  return quoteFor(step, ctx);
};

const handleStep = (step: Step, state: ScenarioState): StepResult =>
  step.op === "quote"
    ? handleQuote(step, state)
    : processClaim(state.policies[step.policy], step.incident);

export const processScenario = (input: Scenario): { results: StepResult[] } => {
  const state: ScenarioState = { customer: input.customer, policies: [], quoteCount: 0 };
  const results = input.steps.map((step) => handleStep(step, state));
  return { results };
};
