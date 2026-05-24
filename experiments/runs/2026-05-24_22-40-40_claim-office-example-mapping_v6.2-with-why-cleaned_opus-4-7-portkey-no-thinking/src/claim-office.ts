type Item = { type: string; enchantment?: number; cursed?: boolean; material?: string };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const THREE_ALIKE_BLOCK_PREMIUM = 60;

type ItemTypeSpec = { basePremium: number; insuranceValue: number; isComponent: boolean };

const ITEM_TYPES: Record<string, ItemTypeSpec> = {
  // Whole items
  sword: { basePremium: 100, insuranceValue: 1000, isComponent: false },
  amulet: { basePremium: 60, insuranceValue: 600, isComponent: false },
  staff: { basePremium: 80, insuranceValue: 800, isComponent: false },
  potion: { basePremium: 40, insuranceValue: 400, isComponent: false },
  // Components (eligible for 3-alike block premium)
  rune: { basePremium: 25, insuranceValue: 250, isComponent: true },
  moonstone: { basePremium: 25, insuranceValue: 250, isComponent: true },
};

const percentOf = (amount: number, percent: number): number => (amount * percent) / 100;

const countBy = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(keyOf(item), (counts.get(keyOf(item)) ?? 0) + 1),
    new Map<string, number>(),
  );

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const basePremiumForGroup = (type: string, count: number): number => {
  const spec = ITEM_TYPES[type];
  if (spec.isComponent && count === 3) return THREE_ALIKE_BLOCK_PREMIUM;
  return count * spec.basePremium;
};

const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const CURSE_SURCHARGE_PERCENT = 50;

// Each surcharge rule receives the item and its base premium and returns
// the surcharge amount in gold (0 when the rule does not apply).
type ItemSurchargeRule = (item: Item, itemBase: number) => number;

const ITEM_SURCHARGE_RULES: ItemSurchargeRule[] = [
  (item, itemBase) =>
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? percentOf(itemBase, HIGH_ENCHANTMENT_SURCHARGE_PERCENT)
      : 0,
  (item, itemBase) =>
    item.cursed ? percentOf(itemBase, CURSE_SURCHARGE_PERCENT) : 0,
];

const itemSurcharges = (item: Item): number => {
  const itemBase = ITEM_TYPES[item.type].basePremium;
  return ITEM_SURCHARGE_RULES.reduce((sum, rule) => sum + rule(item, itemBase), 0);
};

const sumBy = <T>(items: T[], valueOf: (item: T) => number): number =>
  items.reduce((sum, item) => sum + valueOf(item), 0);

const policyBasePremium = (items: Item[]): number =>
  sumBy(
    [...countByType(items)],
    ([type, count]) => basePremiumForGroup(type, count),
  );

const itemSurchargesTotal = (items: Item[]): number => sumBy(items, itemSurcharges);

const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_MIN_YEARS = 2;
const FOLLOWUP_CONTRACT_DISCOUNT_PERCENT = 15;

// Each policy adjustment receives the base premium and quote context and
// returns a signed amount in gold: positive for surcharges, negative for
// discounts, 0 when the rule does not apply.
type QuoteContext = { yearsWithMHPCO: number; priorQuoteCount: number };
type PolicyAdjustmentRule = (basePremium: number, context: QuoteContext) => number;

const POLICY_ADJUSTMENT_RULES: PolicyAdjustmentRule[] = [
  (basePremium) => percentOf(basePremium, FIRST_INSURANCE_SURCHARGE_PERCENT),
  (basePremium, { yearsWithMHPCO }) =>
    yearsWithMHPCO >= LOYALTY_MIN_YEARS ? -percentOf(basePremium, LOYALTY_DISCOUNT_PERCENT) : 0,
  (basePremium, { priorQuoteCount }) =>
    priorQuoteCount > 0 ? -percentOf(basePremium, FOLLOWUP_CONTRACT_DISCOUNT_PERCENT) : 0,
];

const policyAdjustmentsTotal = (basePremium: number, context: QuoteContext): number =>
  sumBy(POLICY_ADJUSTMENT_RULES, (rule) => rule(basePremium, context));

const quotePremium = (items: Item[], context: QuoteContext): number => {
  const base = policyBasePremium(items);
  const beforeFee = base + policyAdjustmentsTotal(base, context) + itemSurchargesTotal(items);
  return Math.ceil(beforeFee) + PROCESSING_FEE;
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;

const insuranceSum = (items: Item[]): number =>
  sumBy(items, (item) => ITEM_TYPES[item.type].insuranceValue);

const policyCap = (items: Item[]): number => insuranceSum(items) * CAP_MULTIPLIER;

type Policy = { items: Item[]; remainingCap: number };

const VERY_HIGH_ENCHANTMENT_THRESHOLD = 8;
const VERY_HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

const insuredItem = (policy: Policy, itemType: string): Item =>
  policy.items.find((item) => item.type === itemType)!;

const reimbursableAmount = (item: Item, damageAmount: number): number =>
  (item.enchantment ?? 0) >= VERY_HIGH_ENCHANTMENT_THRESHOLD
    ? percentOf(damageAmount, VERY_HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT)
    : damageAmount;

const damagePayout = (damage: Damage, policy: Policy): number => {
  const item = insuredItem(policy, damage.itemType);
  return Math.max(0, reimbursableAmount(item, damage.amount) - DEDUCTIBLE_PER_DAMAGE);
};

const validateDamages = (policy: Policy, damages: Damage[]): void => {
  const insuredCounts = countByType(policy.items);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    const insured = insuredCounts.get(type) ?? 0;
    if (count > insured) {
      throw new Error(`Damage references ${count} ${type} entries but policy insures only ${insured}`);
    }
  }
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  validateDamages(policy, incident.damages);
  const rawPayout = sumBy(incident.damages, (damage) => damagePayout(damage, policy));
  const payout = Math.min(rawPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout: Math.floor(payout), remainingCap: policy.remainingCap };
};

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in ITEM_TYPES)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const processQuote = (
  items: Item[],
  context: QuoteContext,
  policies: Policy[],
): QuoteResult => {
  validateItemTypes(items);
  const premium = quotePremium(items, context);
  policies.push({ items, remainingCap: policyCap(items) });
  return { premium };
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const { yearsWithMHPCO } = scenario.customer;
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step) =>
    step.op === "quote"
      ? processQuote(step.items, { yearsWithMHPCO, priorQuoteCount: policies.length }, policies)
      : processClaim(policies[step.policy], step.incident),
  );
  return { results };
};
