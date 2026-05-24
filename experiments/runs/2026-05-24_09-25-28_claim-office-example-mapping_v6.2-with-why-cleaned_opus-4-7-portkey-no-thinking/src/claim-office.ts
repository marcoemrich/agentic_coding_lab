const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

type ItemCatalogEntry = { basePremium: number; insuranceValue: number };

const ITEM_CATALOG: Record<string, ItemCatalogEntry> = {
  sword:     { basePremium: 100, insuranceValue: 1000 },
  amulet:    { basePremium:  60, insuranceValue:  600 },
  staff:     { basePremium:  80, insuranceValue:  800 },
  potion:    { basePremium:  40, insuranceValue:  400 },
  rune:      { basePremium:  25, insuranceValue:  250 },
  moonstone: { basePremium:  25, insuranceValue:  250 },
};

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Customer = { yearsWithMHPCO: number };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

const catalogEntryFor = (item: Item): ItemCatalogEntry => {
  const entry = ITEM_CATALOG[item.type];
  if (entry === undefined) {
    throw new Error(`unknown item type: ${item.type}`);
  }
  return entry;
};

const basePremiumFor = (item: Item): number => catalogEntryFor(item).basePremium;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const sumBy = <T>(xs: T[], f: (x: T) => number): number =>
  xs.reduce((sum, x) => sum + f(x), 0);

const groupBy = <T>(xs: T[], key: (x: T) => string): Map<string, T[]> => {
  const groups = new Map<string, T[]>();
  for (const x of xs) {
    const k = key(x);
    const group = groups.get(k) ?? [];
    group.push(x);
    groups.set(k, group);
  }
  return groups;
};

const groupByType = (items: Item[]): Item[][] =>
  [...groupBy(items, (i) => i.type).values()];

const basePremiumForGroup = (group: Item[]): number =>
  group.length === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : sumBy(group, basePremiumFor);

const totalBasePremium = (items: Item[]): number =>
  sumBy(groupByType(items), basePremiumForGroup);

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = -0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = -0.15;

type PolicyContext = { customer: Customer; isFollowUp: boolean };

const isCursed = (item: Item): boolean => item.cursed === true;
const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;
const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

type Modifier<T> = { applies: (subject: T) => boolean; rate: number };

const sumApplicableRates = <T>(modifiers: Modifier<T>[], subject: T): number =>
  sumBy(modifiers, ({ applies, rate }) => (applies(subject) ? rate : 0));

const ITEM_SURCHARGES: Modifier<Item>[] = [
  { applies: isCursed, rate: CURSE_SURCHARGE_RATE },
  { applies: isHighlyEnchanted, rate: HIGH_ENCHANTMENT_RATE },
];

const isLoyalCustomer = (ctx: PolicyContext): boolean =>
  ctx.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
const isFollowUpContract = (ctx: PolicyContext): boolean => ctx.isFollowUp;

// First-insurance rate applies to every quote unconditionally;
// other policy modifiers are conditional on the customer/contract context.
const POLICY_MODIFIERS: Modifier<PolicyContext>[] = [
  { applies: isLoyalCustomer, rate: LOYALTY_DISCOUNT_RATE },
  { applies: isFollowUpContract, rate: FOLLOW_UP_DISCOUNT_RATE },
];

const policyAdjustment = (baseTotal: number, ctx: PolicyContext): number =>
  baseTotal * (FIRST_INSURANCE_RATE + sumApplicableRates(POLICY_MODIFIERS, ctx));

const itemSurchargeFor = (item: Item): number =>
  basePremiumFor(item) * sumApplicableRates(ITEM_SURCHARGES, item);

const itemSurchargesTotal = (items: Item[]): number =>
  sumBy(items, itemSurchargeFor);

// MHPCO always rounds in its own favor: premiums round UP (customer pays more),
// payouts round DOWN (customer receives less).
const roundPremiumInOfficesFavor = Math.ceil;
const roundPayoutInOfficesFavor = Math.floor;

const premiumFor = (items: Item[], ctx: PolicyContext): number => {
  const baseTotal = totalBasePremium(items);
  return roundPremiumInOfficesFavor(
    baseTotal +
      itemSurchargesTotal(items) +
      policyAdjustment(baseTotal, ctx) +
      PROCESSING_FEE,
  );
};

const insuranceValueFor = (item: Item): number => catalogEntryFor(item).insuranceValue;

const insuranceSumFor = (items: Item[]): number => sumBy(items, insuranceValueFor);

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const triggersHighEnchantmentClause = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursableAmount = (damage: Damage, item: Item): number =>
  triggersHighEnchantmentClause(item)
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;

const payoutForDamage = (damage: Damage, item: Item): number =>
  reimbursableAmount(damage, item) - DEDUCTIBLE;

const policyItemFor = (policy: QuoteStep, damage: Damage): Item =>
  policy.items.find((item) => item.type === damage.itemType)!;

const capFor = (items: Item[]): number =>
  insuranceSumFor(items) * CAP_MULTIPLIER;

const countBy = <T>(xs: T[], key: (x: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const x of xs) {
    const k = key(x);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
};

const validateDamageCounts = (damages: Damage[], items: Item[]): void => {
  const itemCounts = countBy(items, (i) => i.type);
  const damageCounts = countBy(damages, (d) => d.itemType);
  for (const [type, damageCount] of damageCounts) {
    const policyCount = itemCounts.get(type) ?? 0;
    if (policyCount === 0) {
      throw new Error(`claim references ${type} damage but the policy does not cover any ${type}`);
    }
    if (damageCount > policyCount) {
      throw new Error(`claim references more ${type} damages than the policy covers`);
    }
  }
};

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must be non-negative: ${damage.amount}`);
    }
  }
};

const claimResultFor = (
  step: ClaimStep,
  policy: QuoteStep,
  alreadyConsumed: number,
): { payout: number; remainingCap: number } => {
  const { damages } = step.incident;
  const { items } = policy;
  validateDamageCounts(damages, items);
  validateDamageAmounts(damages);
  const desired = sumBy(damages, (damage) =>
    payoutForDamage(damage, policyItemFor(policy, damage)),
  );
  const remainingBefore = capFor(items) - alreadyConsumed;
  const payout = roundPayoutInOfficesFavor(Math.min(desired, remainingBefore));
  return { payout, remainingCap: remainingBefore - payout };
};

const quoteResultFor = (step: QuoteStep, ctx: PolicyContext) => ({
  premium: premiumFor(step.items, ctx),
});

const policyContextFor = (scenario: Scenario, stepIndex: number): PolicyContext => ({
  customer: scenario.customer,
  isFollowUp: stepIndex > 0,
});

const policyReferencedBy = (scenario: Scenario, claim: ClaimStep): QuoteStep =>
  scenario.steps[claim.policy] as QuoteStep;

export const runScenario = (input: unknown): unknown => {
  const scenario = input as Scenario;
  const consumedCapByPolicy = new Map<number, number>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      return quoteResultFor(step, policyContextFor(scenario, stepIndex));
    }
    const policy = policyReferencedBy(scenario, step);
    const alreadyConsumed = consumedCapByPolicy.get(step.policy) ?? 0;
    const result = claimResultFor(step, policy, alreadyConsumed);
    consumedCapByPolicy.set(step.policy, alreadyConsumed + result.payout);
    return result;
  });
  return { results };
};
