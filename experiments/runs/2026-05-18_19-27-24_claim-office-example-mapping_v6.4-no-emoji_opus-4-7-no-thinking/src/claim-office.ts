const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_CONTRACT_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const COMPONENT_BASE_PRICE = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

const BASE_PRICE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const KNOWN_ITEM_TYPES = new Set<string>([
  ...Object.keys(BASE_PRICE_BY_ITEM_TYPE),
  ...COMPONENT_TYPES,
]);

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Customer = { yearsWithMHPCO: number };

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const isKnownItemType = (item: Item): boolean => KNOWN_ITEM_TYPES.has(item.type);

const assertAllItemTypesKnown = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
};

const mainItemBasePrice = (item: Item): number =>
  BASE_PRICE_BY_ITEM_TYPE[item.type] ?? 0;

const componentGroupBasePrice = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PRICE
    : count * COMPONENT_BASE_PRICE;

const groupComponentsByType = (items: Item[]): Map<string, number> => {
  const groups = new Map<string, number>();
  for (const item of items) {
    if (!isComponent(item)) continue;
    groups.set(item.type, (groups.get(item.type) ?? 0) + 1);
  }
  return groups;
};

const sum = (numbers: number[]): number =>
  numbers.reduce((total, n) => total + n, 0);

const policyBasePremium = (items: Item[]): number => {
  const mainItemPremiums = items
    .filter((item) => !isComponent(item))
    .map(mainItemBasePrice);
  const componentGroupPremiums = [...groupComponentsByType(items).values()].map(
    componentGroupBasePrice,
  );
  return sum([...mainItemPremiums, ...componentGroupPremiums]);
};

const curseSurcharge = (item: Item): number =>
  item.cursed ? mainItemBasePrice(item) * CURSE_SURCHARGE_RATE : 0;

const highEnchantmentSurcharge = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? mainItemBasePrice(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;

const itemSurcharges = (items: Item[]): number =>
  sum(items.map((item) => curseSurcharge(item) + highEnchantmentSurcharge(item)));

const firstInsuranceSurcharge = (basePremium: number): number =>
  basePremium * FIRST_INSURANCE_SURCHARGE_RATE;

const loyaltyDiscount = (customer: Customer, basePremium: number): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;

type QuoteContext = { contractIndex?: number };

const followUpDiscount = (
  context: QuoteContext,
  basePremium: number,
): number =>
  (context.contractIndex ?? 0) >= 1
    ? basePremium * FOLLOWUP_CONTRACT_DISCOUNT_RATE
    : 0;

export const quote = (
  customer: Customer,
  items: Item[],
  context: QuoteContext = {},
): number => {
  assertAllItemTypesKnown(items);
  const basePremium = policyBasePremium(items);
  return Math.ceil(
    basePremium +
      firstInsuranceSurcharge(basePremium) +
      itemSurcharges(items) -
      loyaltyDiscount(customer, basePremium) -
      followUpDiscount(context, basePremium) +
      PROCESSING_FEE,
  );
};

type Policy = { items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause?: string; damages: Damage[] };
type ClaimResult = { payout: number; remainingCap: number };

const policyInsuranceSum = (policy: Policy): number =>
  sum(policy.items.map((item) => INSURANCE_VALUE_BY_ITEM_TYPE[item.type] ?? 0));

const policyCap = (policy: Policy): number =>
  policyInsuranceSum(policy) * CAP_MULTIPLIER;

const findPolicyItem = (policy: Policy, itemType: string): Item | undefined =>
  policy.items.find((item) => item.type === itemType);

const assertAllDamagesCovered = (policy: Policy, damages: Damage[]): void => {
  const uncovered = damages.find((damage) => !findPolicyItem(policy, damage.itemType));
  if (uncovered) {
    throw new Error(`Damage references item not in policy: ${uncovered.itemType}`);
  }
};

const payoutRateForItem = (item: Item | undefined): number =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? HIGH_ENCHANTMENT_PAYOUT_RATE
    : 1;

const payoutForDamage = (policy: Policy, damage: Damage): number => {
  const rate = payoutRateForItem(findPolicyItem(policy, damage.itemType));
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
};

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type ScenarioStep = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: ScenarioStep[] };
type QuoteResult = { premium: number };
type ScenarioStepResult = QuoteResult | ClaimResult;
type ScenarioOutcome = { results: ScenarioStepResult[] };

const runQuoteStep = (customer: Customer, step: QuoteStep): QuoteResult => ({
  premium: quote(customer, step.items),
});

const policyFromStep = (steps: ScenarioStep[], policyIndex: number): Policy => {
  const declaringStep = steps[policyIndex] as QuoteStep;
  return { items: declaringStep.items };
};

const runClaimStep = (
  steps: ScenarioStep[],
  step: ClaimStep,
  paidByPolicy: Map<number, number>,
): ClaimResult => {
  const policy = policyFromStep(steps, step.policy);
  const alreadyPaid = paidByPolicy.get(step.policy) ?? 0;
  const result = claim(policy, step.incident, alreadyPaid);
  paidByPolicy.set(step.policy, alreadyPaid + result.payout);
  return result;
};

export const runScenario = (scenario: Scenario): ScenarioOutcome => {
  const paidByPolicy = new Map<number, number>();
  const results: ScenarioStepResult[] = scenario.steps.map((step) =>
    step.op === "quote"
      ? runQuoteStep(scenario.customer, step)
      : runClaimStep(scenario.steps, step, paidByPolicy),
  );
  return { results };
};

const assertAllDamageAmountsNonNegative = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) {
    throw new Error(`Damage amount must be non-negative: ${negative.amount}`);
  }
};

export const claim = (
  policy: Policy,
  incident: Incident,
  alreadyPaid: number = 0,
): ClaimResult => {
  assertAllDamageAmountsNonNegative(incident.damages);
  assertAllDamagesCovered(policy, incident.damages);
  const availableCap = policyCap(policy) - alreadyPaid;
  const desiredPayout = sum(
    incident.damages.map((damage) => payoutForDamage(policy, damage)),
  );
  const payout = Math.min(desiredPayout, availableCap);
  const remainingCap = availableCap - payout;
  return { payout: Math.floor(payout), remainingCap };
};
