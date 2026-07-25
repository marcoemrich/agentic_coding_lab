// Quote / premium constants
const PROCESSING_FEE_GOLD = 5;
const BASE_PREMIUMS_GOLD: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const UNKNOWN_ITEM_BASE_PREMIUM_GOLD = 100;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENTS_PER_BLOCK = 3;
const BLOCK_BASE_PREMIUM_GOLD = 60;
const COMPONENT_BASE_PREMIUM_GOLD = 25;

// Item modifier constants
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const CURSE_SURCHARGE_RATE = 0.5;

// Customer modifier constants
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

// Claim constants
const DEDUCTIBLE_GOLD = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const INSURANCE_VALUES_GOLD: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

type Customer = {
  yearsWithMHPCO: number;
};

type Step = {
  op?: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
};

type ScenarioInput = {
  customer: Customer;
  steps: Step[];
};

type Item = {
  type?: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};

type PremiumBreakdown = {
  policyBase: number;
  itemSurcharges: number;
};

type Damage = {
  itemType: string;
  amount: number;
};

type Incident = {
  cause?: string;
  damages: Damage[];
};

type Policy = {
  insuranceSum: number;
  remainingCap: number;
  items: Item[];
};

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type Result = QuoteResult | ClaimResult;

const itemType = (item: Item): string => item.type ?? "";

const basePremiumForItem = (item: Item): number =>
  BASE_PREMIUMS_GOLD[itemType(item)] ?? UNKNOWN_ITEM_BASE_PREMIUM_GOLD;

const itemSurchargeFor = (item: Item, basePremium: number): number => {
  const curseRate = item.cursed ? CURSE_SURCHARGE_RATE : 0;
  const enchantmentRate =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return basePremium * (curseRate + enchantmentRate);
};

const componentBasePremiumForCount = (count: number): number =>
  count === COMPONENTS_PER_BLOCK
    ? BLOCK_BASE_PREMIUM_GOLD
    : count * COMPONENT_BASE_PREMIUM_GOLD;

const premiumBreakdownForItems = (items: Item[]): PremiumBreakdown => {
  const componentCounts = new Map<string, number>();
  let policyBase = 0;
  let itemSurcharges = 0;

  for (const item of items) {
    const type = itemType(item);
    if (COMPONENT_TYPES.has(type)) {
      componentCounts.set(type, (componentCounts.get(type) ?? 0) + 1);
    } else {
      const base = basePremiumForItem(item);
      policyBase += base;
      itemSurcharges += itemSurchargeFor(item, base);
    }
  }

  for (const count of componentCounts.values()) {
    policyBase += componentBasePremiumForCount(count);
  }

  return { policyBase, itemSurcharges };
};

const loyaltyDiscountRateFor = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? -LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscountRateFor = (quoteIndex: number): number =>
  quoteIndex > 0 ? -FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremium = (customer: Customer, items: Item[], quoteIndex: number): QuoteResult => {
  const { policyBase, itemSurcharges } = premiumBreakdownForItems(items);
  const policyWideRate =
    loyaltyDiscountRateFor(customer) +
    FIRST_INSURANCE_SURCHARGE_RATE +
    followUpDiscountRateFor(quoteIndex);
  const policyWideAdjustment = policyBase * policyWideRate;
  const premium = policyBase + itemSurcharges + policyWideAdjustment + PROCESSING_FEE_GOLD;
  return { premium: Math.ceil(premium) };
};

const KNOWN_ITEM_TYPES = new Set([
  ...Object.keys(BASE_PREMIUMS_GOLD),
  ...COMPONENT_TYPES,
]);

const validateQuoteItems = (items: Item[]): void => {
  for (const item of items) {
    const type = itemType(item);
    if (!KNOWN_ITEM_TYPES.has(type)) {
      throw new Error(`Unknown item type: ${type}`);
    }
  }
};

const createPolicy = (items: Item[]): Policy => {
  validateQuoteItems(items);
  const insuranceSum = items.reduce(
    (sum, item) => sum + INSURANCE_VALUES_GOLD[itemType(item)],
    0,
  );
  return { insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER, items };
};

const reimbursableAmountFor = (item: Item | undefined, amount: number): number => {
  const enchantment = item?.enchantment ?? 0;
  if (enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return amount;
};

const reimbursementFor = (damage: Damage, policy: Policy): number => {
  const item = policy.items.find((policyItem) => policyItem.type === damage.itemType);
  const adjustedAmount = reimbursableAmountFor(item, damage.amount);
  return Math.max(0, adjustedAmount - DEDUCTIBLE_GOLD);
};

const countByKey = <T>(items: T[], keyExtractor: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyExtractor(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const itemCountsByType = (items: Item[]): Map<string, number> =>
  countByKey(items, itemType);

const damageCountsByType = (damages: Damage[]): Map<string, number> =>
  countByKey(damages, (damage) => damage.itemType);

const validateClaim = (policy: Policy, incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }
  }
  const policyCounts = itemCountsByType(policy.items);
  const damageCounts = damageCountsByType(incident.damages);
  for (const [type, count] of damageCounts.entries()) {
    if ((policyCounts.get(type) ?? 0) < count) {
      throw new Error(`Claim damages exceed insured count for ${type}`);
    }
  }
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  validateClaim(policy, incident);
  const totalPayout = incident.damages.reduce(
    (sum, damage) => sum + reimbursementFor(damage, policy),
    0,
  );
  const roundedPayout = Math.floor(Math.min(totalPayout, policy.remainingCap));
  policy.remainingCap -= roundedPayout;
  return { payout: roundedPayout, remainingCap: policy.remainingCap };
};

const processQuoteStep = (
  step: Step,
  customer: Customer,
  quoteIndex: number,
): { result: QuoteResult; policy: Policy } => {
  const items = step.items ?? [];
  const policy = createPolicy(items);
  return {
    result: quotePremium(customer, items, quoteIndex),
    policy,
  };
};

const processClaimStep = (
  step: Step,
  policies: Map<number, Policy>,
): ClaimResult => {
  const policy = policies.get(step.policy ?? -1);
  if (!policy || !step.incident) {
    return { payout: 0, remainingCap: 0 };
  }
  return processClaim(policy, step.incident);
};

export const processScenario = (scenario: ScenarioInput): { results: Result[] } => {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteIndex = 0;

  for (const [stepIndex, step] of scenario.steps.entries()) {
    if (step.op === "quote") {
      const { result, policy } = processQuoteStep(step, scenario.customer, quoteIndex);
      policies.set(stepIndex, policy);
      results.push(result);
      quoteIndex += 1;
    } else if (step.op === "claim") {
      results.push(processClaimStep(step, policies));
    }
  }

  return { results };
};
