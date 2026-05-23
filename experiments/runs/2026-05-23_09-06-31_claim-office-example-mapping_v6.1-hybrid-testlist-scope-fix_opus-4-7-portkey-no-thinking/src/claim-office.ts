export type Item = Record<string, unknown>;
export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Array<{ itemType: string; amount: number }> } };
export type Step = QuoteStep | ClaimStep;
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type ScenarioResult = { results: Array<QuoteResult | ClaimResult> };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const itemBasePremium = (item: Item): number =>
  BASE_PREMIUM_BY_TYPE[item.type as string] ?? 0;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE = 60;

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const type = item.type as string;
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

const typeGroupBase = (type: string, count: number): number => {
  const unitBase = BASE_PREMIUM_BY_TYPE[type] ?? 0;
  if (COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_BASE;
  }
  return count * unitBase;
};

const itemsBaseSum = (items: Item[]): number => {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += typeGroupBase(type, count);
  }
  return total;
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const itemCurseSurcharge = (item: Item): number =>
  item.cursed === true ? itemBasePremium(item) * CURSE_SURCHARGE_RATE : 0;

const itemHighEnchantmentSurcharge = (item: Item): number => {
  const ench = item.enchantment;
  return typeof ench === "number" && ench >= HIGH_ENCHANTMENT_THRESHOLD
    ? itemBasePremium(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
};

const itemSpecificSurchargesSum = (items: Item[]): number =>
  items.reduce(
    (sum, item) =>
      sum + itemCurseSurcharge(item) + itemHighEnchantmentSurcharge(item),
    0,
  );

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const loyaltyDiscount = (baseSum: number, yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? baseSum * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscount = (baseSum: number, priorQuoteCount: number): number =>
  priorQuoteCount > 0 ? baseSum * FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremium = (
  items: Item[],
  customer: { yearsWithMHPCO: number },
  priorQuoteCount: number,
): number => {
  const baseSum = itemsBaseSum(items);
  const firstInsuranceSurcharge = baseSum * FIRST_INSURANCE_SURCHARGE_RATE;
  const itemSurcharges = itemSpecificSurchargesSum(items);
  const loyalty = loyaltyDiscount(baseSum, customer.yearsWithMHPCO);
  const followUp = followUpDiscount(baseSum, priorQuoteCount);
  return Math.ceil(
    baseSum + itemSurcharges - loyalty - followUp + firstInsuranceSurcharge + PROCESSING_FEE,
  );
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const itemInsuranceValue = (item: Item): number =>
  INSURANCE_VALUE_BY_TYPE[item.type as string] ?? 0;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

type Policy = { items: Item[]; remainingCap: number };

type ScenarioState = { priorQuoteCount: number; policies: Policy[] };

const initialState = (): ScenarioState => ({ priorQuoteCount: 0, policies: [] });

type Damage = { itemType: string; amount: number };

const itemReimbursementRate = (item: Item | undefined): number => {
  const ench = item?.enchantment;
  if (typeof ench === "number" && ench >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    return HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  return 1;
};

const findItemForDamage = (policy: Policy, damage: Damage): Item | undefined =>
  policy.items.find((item) => item.type === damage.itemType);

const damagePayout = (damage: Damage, policy: Policy): number => {
  const item = findItemForDamage(policy, damage);
  const reimbursed = damage.amount * itemReimbursementRate(item);
  return Math.max(0, reimbursed - DEDUCTIBLE_PER_DAMAGE);
};

const damagesPayoutSum = (damages: Damage[], policy: Policy): number =>
  damages.reduce((sum, damage) => sum + damagePayout(damage, policy), 0);

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    const type = item.type as string;
    if (!(type in BASE_PREMIUM_BY_TYPE)) {
      throw new Error(`unknown item type: ${type}`);
    }
  }
};

const handleQuoteStep = (
  step: QuoteStep,
  customer: Scenario["customer"],
  state: ScenarioState,
): { result: QuoteResult; state: ScenarioState } => {
  validateItemTypes(step.items);
  const policy: Policy = {
    items: step.items,
    remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
  };
  return {
    result: { premium: quotePremium(step.items, customer, state.priorQuoteCount) },
    state: {
      priorQuoteCount: state.priorQuoteCount + 1,
      policies: [...state.policies, policy],
    },
  };
};

const replaceAt = <T>(items: T[], index: number, replacement: T): T[] =>
  items.map((item, i) => (i === index ? replacement : item));

const validateDamagesAgainstPolicy = (damages: Damage[], policy: Policy): void => {
  const damageCounts = new Map<string, number>();
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must be non-negative; got ${damage.amount}`);
    }
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
  }
  const policyCounts = countByType(policy.items);
  for (const [type, count] of damageCounts) {
    if ((policyCounts.get(type) ?? 0) < count) {
      throw new Error(
        `claim has more ${type} damages (${count}) than the policy covers`,
      );
    }
  }
};

const handleClaimStep = (
  step: ClaimStep,
  state: ScenarioState,
): { result: ClaimResult; state: ScenarioState } => {
  const policy = state.policies[step.policy];
  validateDamagesAgainstPolicy(step.incident.damages, policy);
  const uncappedPayout = damagesPayoutSum(step.incident.damages, policy);
  const payout = Math.floor(Math.min(uncappedPayout, policy.remainingCap));
  const remainingCap = policy.remainingCap - payout;
  return {
    result: { payout, remainingCap },
    state: {
      ...state,
      policies: replaceAt(state.policies, step.policy, { ...policy, remainingCap }),
    },
  };
};

const handleStep = (
  step: Step,
  customer: Scenario["customer"],
  state: ScenarioState,
): { result: QuoteResult | ClaimResult; state: ScenarioState } =>
  step.op === "quote"
    ? handleQuoteStep(step, customer, state)
    : handleClaimStep(step, state);

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const results: Array<QuoteResult | ClaimResult> = [];
  let state = initialState();
  for (const step of scenario.steps) {
    const next = handleStep(step, scenario.customer, state);
    results.push(next.result);
    state = next.state;
  }
  return { results };
};
