interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Customer {
  yearsWithMHPCO: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: Customer;
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResult;

interface Policy {
  items: Item[];
  remainingCap: number;
}

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const KNOWN_ITEM_TYPES = new Set(Object.keys(INSURANCE_VALUE));

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCH_PAYOUT_THRESHOLD = 8;
const HIGH_ENCH_PAYOUT_RATE = 0.5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE = 60;

const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOWUP_RATE = 0.15;
const PROCESSING_FEE = 5;
const ROUNDING_PRECISION = 6;

const componentGroupBase = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE : count * COMPONENT_BASE;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const countBy = <T>(values: T[], key: (value: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const value of values) {
    counts[key(value)] = (counts[key(value)] ?? 0) + 1;
  }
  return counts;
};

const withSurcharge = (base: number, rate: number): number => base + base * rate;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurchargeRate = (item: Item): number =>
  FIRST_INSURANCE_RATE +
  (item.cursed ? CURSE_RATE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_RATE : 0);

const mainItemPremium = (item: Item): number =>
  withSurcharge(BASE_PREMIUM[item.type], itemSurchargeRate(item));

const mainItems = (items: Item[]): Item[] => items.filter((item) => !isComponent(item));

const mainItemBaseSum = (items: Item[]): number =>
  mainItems(items).reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);

const mainItemTotal = (items: Item[]): number =>
  mainItems(items).reduce((sum, item) => sum + mainItemPremium(item), 0);

const componentCounts = (items: Item[]): Record<string, number> =>
  countBy(items.filter(isComponent), (item) => item.type);

const componentBaseSum = (items: Item[]): number =>
  Object.values(componentCounts(items)).reduce(
    (sum, count) => sum + componentGroupBase(count),
    0,
  );

const componentTotal = (items: Item[]): number =>
  withSurcharge(componentBaseSum(items), FIRST_INSURANCE_RATE);

const policyBase = (items: Item[]): number => mainItemBaseSum(items) + componentBaseSum(items);

const policyDiscount = (items: Item[], rate: number, applies: boolean): number =>
  applies ? rate * policyBase(items) : 0;

const loyaltyDiscount = (items: Item[], customer: Customer): number =>
  policyDiscount(items, LOYALTY_RATE, customer.yearsWithMHPCO >= LOYALTY_THRESHOLD);

const followUpDiscount = (items: Item[], isFollowUp: boolean): number =>
  policyDiscount(items, FOLLOWUP_RATE, isFollowUp);

const roundTo = (amount: number, rounder: (value: number) => number): number =>
  rounder(Number(amount.toFixed(ROUNDING_PRECISION)));

const roundUpToWhole = (amount: number): number => roundTo(amount, Math.ceil);

const roundDownToWhole = (amount: number): number => roundTo(amount, Math.floor);

const itemPremiumSum = (items: Item[]): number =>
  mainItemTotal(items) + componentTotal(items);

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number =>
  roundUpToWhole(
    itemPremiumSum(items) -
      loyaltyDiscount(items, customer) -
      followUpDiscount(items, isFollowUp) +
      PROCESSING_FEE,
  );

const isQuote = (step: Step): boolean => step.op === "quote";

const priorQuoteCount = (steps: Step[], index: number): number =>
  steps.slice(0, index).filter(isQuote).length;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const damageReimbursement = (item: Item | undefined, amount: number): number =>
  item && (item.enchantment ?? 0) >= HIGH_ENCH_PAYOUT_THRESHOLD
    ? HIGH_ENCH_PAYOUT_RATE * amount
    : amount;

const damagePayout = (item: Item | undefined, damage: Damage): number =>
  damageReimbursement(item, damage.amount) - DEDUCTIBLE;

const findInsuredItem = (items: Item[], itemType: string): Item | undefined =>
  items.find((item) => item.type === itemType);

const incidentPayout = (damages: Damage[], items: Item[]): number =>
  damages.reduce(
    (sum, damage) => sum + damagePayout(findInsuredItem(items, damage.itemType), damage),
    0,
  );

const assertClaimable = (damages: Damage[], items: Item[]): void => {
  const insured = countBy(items, (item) => item.type);
  const claimed = countBy(damages, (damage) => damage.itemType);
  for (const [itemType, count] of Object.entries(claimed)) {
    if (count > (insured[itemType] ?? 0)) {
      throw new Error(`Claim references more ${itemType} items than the policy covers`);
    }
  }
};

const assertNonNegativeAmounts = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) {
    throw new Error(`Negative damage amount: ${negative.amount}`);
  }
};

const processClaim = (step: ClaimStep, policies: Policy[]): ClaimResult => {
  const policy = policies[step.policy];
  assertNonNegativeAmounts(step.incident.damages);
  assertClaimable(step.incident.damages, policy.items);
  const desiredPayout = incidentPayout(step.incident.damages, policy.items);
  const payout = roundDownToWhole(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const assertKnownItems = (items: Item[]): void => {
  const unknown = items.find((item) => !KNOWN_ITEM_TYPES.has(item.type));
  if (unknown) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

const processQuote = (
  step: QuoteStep,
  index: number,
  scenario: Scenario,
  policies: Policy[],
): QuoteResult => {
  assertKnownItems(step.items);
  const isFollowUp = priorQuoteCount(scenario.steps, index) > 0;
  policies[index] = {
    items: step.items,
    remainingCap: CAP_MULTIPLIER * insuranceSum(step.items),
  };
  return { premium: quotePremium(step.items, scenario.customer, isFollowUp) };
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policies: Policy[] = [];
  const results = scenario.steps.map((step, index): StepResult =>
    step.op === "claim"
      ? processClaim(step, policies)
      : processQuote(step, index, scenario, policies),
  );
  return { results };
};
