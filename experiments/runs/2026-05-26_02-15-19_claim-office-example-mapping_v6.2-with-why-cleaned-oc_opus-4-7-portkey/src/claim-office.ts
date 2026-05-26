export type Customer = { yearsWithMHPCO: number };

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteStep = { op: "quote"; items: Item[] };

export type Damage = { itemType: string; amount: number };

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = { customer: Customer; steps: Step[] };

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

export type ScenarioOutput = { results: StepResult[] };

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMB_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMB_FACTOR = 0.5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_CONTRACT_DISCOUNT_RATE = 0.15;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const itemInsuranceValue = (item: Item): number =>
  INSURANCE_VALUE_BY_TYPE[item.type] ?? 0;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const assertKnownItemType = (item: Item): void => {
  if (!(item.type in BASE_PREMIUM_BY_TYPE)) {
    throw new Error(`unknown item type: ${item.type}`);
  }
};

const validateItems = (items: Item[]): void => {
  for (const item of items) assertKnownItemType(item);
};

const itemBasePremium = (item: Item): number => BASE_PREMIUM_BY_TYPE[item.type];

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const groupBy = <T>(items: T[], key: (item: T) => string): Map<string, T[]> => {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const existing = groups.get(k);
    if (existing) existing.push(item); else groups.set(k, [item]);
  }
  return groups;
};

const groupBasePremium = (group: Item[]): number => {
  if (group.length === COMPONENT_BLOCK_SIZE && isComponent(group[0])) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return group.reduce((sum, item) => sum + itemBasePremium(item), 0);
};

const quoteItemsBasePremium = (items: Item[]): number => {
  const groups = groupBy(items, (item) => item.type);
  return [...groups.values()].reduce((sum, group) => sum + groupBasePremium(group), 0);
};

// Premiums round UP, payouts round DOWN -- always MHPCO's favor.
const roundPremium = (amount: number): number => Math.ceil(amount);
const roundPayout = (amount: number): number => Math.floor(amount);

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const qualifiesForEnchantmentSurcharge = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const surchargeIf = (condition: boolean, base: number, rate: number): number =>
  condition ? base * rate : 0;

const itemSurcharges = (item: Item): number => {
  const base = itemBasePremium(item);
  return (
    surchargeIf(item.cursed === true, base, CURSE_SURCHARGE_RATE) +
    surchargeIf(qualifiesForEnchantmentSurcharge(item), base, HIGH_ENCHANTMENT_SURCHARGE_RATE)
  );
};

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

const loyaltyDiscount = (customer: Customer, base: number): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? base * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscount = (isFollowUp: boolean, base: number): number =>
  isFollowUp ? base * FOLLOWUP_CONTRACT_DISCOUNT_RATE : 0;

type QuoteContext = { customer: Customer; isFollowUp: boolean };

const computeQuotePremium = (items: Item[], ctx: QuoteContext): number => {
  const base = quoteItemsBasePremium(items);
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_SURCHARGE_RATE;
  const itemSurchargeTotal = sumItemSurcharges(items);
  const loyalty = loyaltyDiscount(ctx.customer, base);
  const followUp = followUpDiscount(ctx.isFollowUp, base);
  return base + firstInsuranceSurcharge + itemSurchargeTotal - loyalty - followUp + PROCESSING_FEE;
};

const runQuoteStep = (step: QuoteStep, ctx: QuoteContext): QuoteResult => {
  validateItems(step.items);
  return { premium: roundPremium(computeQuotePremium(step.items, ctx)) };
};

type Policy = { items: Item[]; cap: number; remainingCap: number };

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

const newPolicy = (items: Item[]): Policy => {
  const cap = policyInsuranceSum(items) * CAP_MULTIPLIER;
  return { items, cap, remainingCap: cap };
};

const qualifiesForReducedReimbursement = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_REIMB_THRESHOLD;

const reimbursableAmount = (damage: Damage, item: Item): number =>
  qualifiesForReducedReimbursement(item)
    ? damage.amount * HIGH_ENCHANTMENT_REIMB_FACTOR
    : damage.amount;

const damagePayoutBeforeCap = (damage: Damage, item: Item): number => {
  return Math.max(0, reimbursableAmount(damage, item) - DEDUCTIBLE);
};

const findItem = (policy: Policy, itemType: string): Item | undefined =>
  policy.items.find((it) => it.type === itemType);

const countBy = <T>(items: T[], key: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
};

const assertNonNegativeDamage = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`damage amount must be non-negative, got ${damage.amount}`);
  }
};

const assertDamagesCoveredByPolicy = (damages: Damage[], policy: Policy): void => {
  const damageCounts = countBy(damages, (d) => d.itemType);
  const itemCounts = countBy(policy.items, (item) => item.type);
  for (const [type, dCount] of damageCounts) {
    const iCount = itemCounts.get(type) ?? 0;
    if (dCount > iCount) {
      throw new Error(`too many damages of type ${type} for policy`);
    }
  }
};

const findPolicy = (policies: Map<number, Policy>, id: number): Policy => {
  const policy = policies.get(id);
  if (!policy) throw new Error(`policy ${id} not found`);
  return policy;
};

const validateClaim = (damages: Damage[], policy: Policy): void => {
  damages.forEach(assertNonNegativeDamage);
  assertDamagesCoveredByPolicy(damages, policy);
};

const requestedPayout = (damages: Damage[], policy: Policy): number =>
  damages.reduce(
    (sum, d) => sum + damagePayoutBeforeCap(d, findItem(policy, d.itemType)!),
    0,
  );

const runClaimStep = (step: ClaimStep, policies: Map<number, Policy>): ClaimResult => {
  const policy = findPolicy(policies, step.policy);
  const damages = step.incident.damages;
  validateClaim(damages, policy);
  const payout = roundPayout(Math.min(requestedPayout(damages, policy), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  let hasPriorQuote = false;
  const policies = new Map<number, Policy>();
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const ctx: QuoteContext = { customer: scenario.customer, isFollowUp: hasPriorQuote };
      hasPriorQuote = true;
      policies.set(index, newPolicy(step.items));
      return runQuoteStep(step, ctx);
    }
    return runClaimStep(step, policies);
  });
  return { results };
};
