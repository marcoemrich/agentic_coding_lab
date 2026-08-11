type Customer = { yearsWithMHPCO: number };
type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;
type ScenarioResult = { results: StepResult[] };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_PCT = 0.10;
const LOYALTY_PCT = 0.20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_PCT = 0.15;
const CURSE_PCT = 0.50;
const HIGH_ENCH_PCT = 0.30;
const HIGH_ENCH_THRESHOLD = 5;
const FLOAT_TOLERANCE = 1e-9;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCH_PAYOUT_FACTOR = 0.5;
const HIGH_ENCH_PAYOUT_THRESHOLD = 8;
const INSURANCE_VALUE_FACTOR = 10;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const insuranceValueOf = (type: string): number => BASE_PREMIUM[type] * INSURANCE_VALUE_FACTOR;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponentType = (type: string): boolean => COMPONENT_TYPES.has(type);

const roundUp = (n: number): number => Math.ceil(n - FLOAT_TOLERANCE);
const roundDown = (n: number): number => Math.floor(n + FLOAT_TOLERANCE);

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const groupBasePremium = (type: string, count: number): number =>
  isComponentType(type) && count === BLOCK_SIZE
    ? BLOCK_PREMIUM
    : count * BASE_PREMIUM[type];

const sumBasePremiums = (items: Item[]): number => {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += groupBasePremium(type, count);
  }
  return total;
};

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCH_THRESHOLD;

const itemSurchargePct = (item: Item): number =>
  (item.cursed ? CURSE_PCT : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCH_PCT : 0);

const itemSurcharge = (item: Item): number =>
  BASE_PREMIUM[item.type] * itemSurchargePct(item);

const itemSurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurcharge(item), 0);

const loyaltyDiscountPct = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_PCT : 0;

const followUpDiscountPct = (priorQuoteCount: number): number =>
  priorQuoteCount > 0 ? FOLLOW_UP_PCT : 0;

const policyBaseMultiplier = (customer: Customer, priorQuoteCount: number): number =>
  1 + FIRST_INSURANCE_PCT - loyaltyDiscountPct(customer) - followUpDiscountPct(priorQuoteCount);

const computeQuotePremium = (items: Item[], customer: Customer, priorQuoteCount: number): number => {
  const policyBase = sumBasePremiums(items);
  return roundUp(
    policyBase * policyBaseMultiplier(customer, priorQuoteCount) + itemSurcharges(items) + PROCESSING_FEE,
  );
};

type Policy = { items: Item[]; remainingCap: number };

const makePolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const reimbursableAmount = (item: Item, damageAmount: number): number =>
  (item.enchantment ?? 0) >= HIGH_ENCH_PAYOUT_THRESHOLD
    ? damageAmount * HIGH_ENCH_PAYOUT_FACTOR
    : damageAmount;

const payoutForDamage = (item: Item, damage: Damage): number =>
  Math.max(0, reimbursableAmount(item, damage.amount) - DEDUCTIBLE);

const validateDamage = (damage: Damage): void => {
  if (damage.amount < 0) throw new Error(`negative damage amount: ${damage.amount}`);
};

const matchDamageToItem = (items: Item[], damage: Damage, consumed: Set<number>): number => {
  const idx = items.findIndex((item, i) => !consumed.has(i) && item.type === damage.itemType);
  if (idx === -1) throw new Error(`damage references item not in policy: ${damage.itemType}`);
  return idx;
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  let totalPayout = 0;
  const consumed = new Set<number>();
  for (const damage of incident.damages) {
    validateDamage(damage);
    const idx = matchDamageToItem(policy.items, damage, consumed);
    consumed.add(idx);
    const capRemaining = policy.remainingCap - totalPayout;
    totalPayout += Math.min(payoutForDamage(policy.items[idx], damage), capRemaining);
  }
  policy.remainingCap -= totalPayout;
  return { payout: roundDown(totalPayout), remainingCap: policy.remainingCap };
};

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const results: StepResult[] = [];
  const policies: Policy[] = [];
  let priorQuoteCount = 0;
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      validateItems(step.items);
      results.push({ premium: computeQuotePremium(step.items, scenario.customer, priorQuoteCount) });
      policies.push(makePolicy(step.items));
      priorQuoteCount++;
    } else {
      const policy = policies[step.policy];
      results.push(processClaim(policy, step.incident));
    }
  }
  return { results };
};
