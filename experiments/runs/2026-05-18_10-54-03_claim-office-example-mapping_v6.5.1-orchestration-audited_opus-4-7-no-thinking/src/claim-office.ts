const PROCESSING_FEE = 5;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_INSURANCE_VALUE = 250;
const CURSE_SURCHARGE_RATE = 0.5;
const FIRST_INSURANCE_RATE = 0.1;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HALF_PAYOUT_RATE = 0.5;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const KNOWN_COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isKnownItemType = (type: string): boolean =>
  type in BASE_PREMIUM_BY_TYPE || KNOWN_COMPONENT_TYPES.has(type);

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number; firstQuote?: boolean };
type Scenario = { customer: Customer; steps: Step[] };

const componentGroupPremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_BASE_PREMIUM;

const isMainItem = ({ type }: Item): boolean => type in BASE_PREMIUM_BY_TYPE;

const isHighEnchantment = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const qualifiesForFirstInsurance = (item: Item, isSingleItemPolicy: boolean): boolean =>
  isSingleItemPolicy && !!item.cursed && !isHighEnchantment(item);

const surchargeRates = (item: Item, isSingleItemPolicy: boolean): number[] => [
  item.cursed ? CURSE_SURCHARGE_RATE : 0,
  isHighEnchantment(item) ? HIGH_ENCHANTMENT_RATE : 0,
  qualifiesForFirstInsurance(item, isSingleItemPolicy) ? FIRST_INSURANCE_RATE : 0,
];

const mainItemPremium = (item: Item, isSingleItemPolicy: boolean): number => {
  const base = BASE_PREMIUM_BY_TYPE[item.type];
  const totalRate = surchargeRates(item, isSingleItemPolicy).reduce((a, b) => a + b, 1);
  return base * totalRate;
};

const countBy = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> =>
  values.reduce(
    (counts, value) => counts.set(keyOf(value), (counts.get(keyOf(value)) ?? 0) + 1),
    new Map<string, number>(),
  );

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const sumComponentPremiums = (components: Item[]): number =>
  [...countByType(components).values()]
    .reduce((sum, count) => sum + componentGroupPremium(count), 0);

const partitionItems = (items: Item[]): { mains: Item[]; components: Item[] } =>
  items.reduce<{ mains: Item[]; components: Item[] }>(
    (acc, item) => {
      (isMainItem(item) ? acc.mains : acc.components).push(item);
      return acc;
    },
    { mains: [], components: [] },
  );

const sumItemPremiums = (items: Item[], policyRate: number): number => {
  const { mains, components } = partitionItems(items);
  const isSingleItemPolicy = items.length === 1;
  const { baseSum, premiumSum } = mains.reduce(
    (acc, item) => ({
      baseSum: acc.baseSum + BASE_PREMIUM_BY_TYPE[item.type],
      premiumSum: acc.premiumSum + mainItemPremium(item, isSingleItemPolicy),
    }),
    { baseSum: 0, premiumSum: 0 },
  );
  const componentsSum = sumComponentPremiums(components);
  return premiumSum + componentsSum + (baseSum + componentsSum) * policyRate;
};

const customerRateAdjustments = (customer: Customer, isFollowUp: boolean): number[] => [
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? -LOYALTY_DISCOUNT_RATE : 0,
  customer.firstQuote ? FIRST_INSURANCE_RATE : 0,
  isFollowUp ? -FOLLOWUP_DISCOUNT_RATE : 0,
];

const policyWideRate = (customer: Customer, isFollowUp: boolean): number =>
  customerRateAdjustments(customer, isFollowUp).reduce((sum, rate) => sum + rate, 0);

const ceilInFavor = (value: number): number => Math.ceil(Number(value.toFixed(6)));

const floorInFavor = (value: number): number => Math.floor(value);

const assertKnownItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
};

const assertNonNegativeDamages = (damages: Damage[]): void => {
  const negative = damages.find((d) => d.amount < 0);
  if (negative) throw new Error(`Damage amount must be non-negative: ${negative.amount}`);
};

const assertDamageCountsWithinPolicy = (damages: Damage[], policyItems: Item[]): void => {
  const policyCounts = countByType(policyItems);
  const damageCounts = countBy(damages, (d) => d.itemType);
  for (const [type, count] of damageCounts) {
    if (count > (policyCounts.get(type) ?? 0)) {
      throw new Error(`More damages of type ${type} than policy covers`);
    }
  }
};

const quotePremiumFor = (step: QuoteStep, customer: Customer, isFollowUp: boolean): { premium: number } => {
  assertKnownItemTypes(step.items);
  return {
    premium: ceilInFavor(sumItemPremiums(step.items, policyWideRate(customer, isFollowUp)) + PROCESSING_FEE),
  };
};

const itemInsuranceValue = (item: Item): number =>
  isMainItem(item) ? INSURANCE_VALUE_BY_TYPE[item.type] : COMPONENT_INSURANCE_VALUE;

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

const findPolicyItem = (policyItems: Item[], itemType: string): Item | undefined =>
  policyItems.find((item) => item.type === itemType);

const halvesPayout = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;

const damagePayoutFor = (damage: Damage, policyItem: Item): number => {
  const reimbursed = halvesPayout(policyItem) ? damage.amount * HALF_PAYOUT_RATE : damage.amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

const resolveDamage = (damage: Damage, policyItems: Item[]): Item => {
  const policyItem = findPolicyItem(policyItems, damage.itemType);
  if (!policyItem) throw new Error(`Damage refers to item not in policy: ${damage.itemType}`);
  return policyItem;
};

const claimResult = (
  step: ClaimStep,
  policyItems: Item[],
  remainingCap: number,
): { payout: number; remainingCap: number } => {
  assertNonNegativeDamages(step.incident.damages);
  assertDamageCountsWithinPolicy(step.incident.damages, policyItems);
  const rawPayout = step.incident.damages.reduce(
    (sum, d) => sum + damagePayoutFor(d, resolveDamage(d, policyItems)),
    0,
  );
  const payout = floorInFavor(Math.min(rawPayout, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
};

const policyItemsAt = (scenario: Scenario, policyIndex: number): Item[] =>
  (scenario.steps[policyIndex] as QuoteStep).items;

const policyCap = (scenario: Scenario, policyIndex: number): number =>
  policyInsuranceSum(policyItemsAt(scenario, policyIndex)) * CAP_MULTIPLIER;

type RunState = { results: unknown[]; remainingCaps: Map<number, number> };

const runStep = (state: RunState, step: Step, index: number, scenario: Scenario): RunState => {
  if (step.op === "quote") {
    state.results.push(quotePremiumFor(step, scenario.customer, index > 0));
    return state;
  }
  const remainingCap = state.remainingCaps.get(step.policy) ?? policyCap(scenario, step.policy);
  const result = claimResult(step, policyItemsAt(scenario, step.policy), remainingCap);
  state.remainingCaps.set(step.policy, result.remainingCap);
  state.results.push(result);
  return state;
};

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  const initial: RunState = { results: [], remainingCaps: new Map() };
  const final = scenario.steps.reduce(
    (state, step, i) => runStep(state, step, i, scenario),
    initial,
  );
  return { results: final.results };
};
