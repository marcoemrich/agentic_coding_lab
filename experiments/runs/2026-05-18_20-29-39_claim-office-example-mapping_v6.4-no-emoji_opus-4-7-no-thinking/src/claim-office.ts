export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

export type Customer = { yearsWithMHPCO: number };

export type Damage = { itemType: string; amount: number };

export type Incident = { cause?: string; damages: Damage[] };

export type Step = {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
};

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type ScenarioResult = {
  results: StepResult[];
};

const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const PAYOUT_HIGH_ENCHANTMENT_THRESHOLD = 8;
const PAYOUT_HIGH_ENCHANTMENT_RATE = 0.5;

type StepResult = { premium?: number; payout?: number; remainingCap?: number };

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE_RATE = 0.5;
const FIRST_INSURANCE_RATE = 0.1;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isKnownItemType = (type: string): boolean => type in BASE_PREMIUMS;

const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const basePremiumFor = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const groupKeyFor = (item: Item, index: number): string =>
  COMPONENT_TYPES.has(item.type) ? item.type : `item:${index}`;

const groupItemsForPricing = (items: Item[]): Item[][] => {
  const groups = new Map<string, Item[]>();
  items.forEach((item, index) => {
    const key = groupKeyFor(item, index);
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  });
  return [...groups.values()];
};

const premiumForGroup = (group: Item[]): number =>
  group.length === BLOCK_SIZE
    ? BLOCK_PREMIUM
    : group.reduce((total, item) => total + basePremiumFor(item), 0);

const totalBasePremiumFor = (items: Item[]): number =>
  groupItemsForPricing(items).reduce((total, group) => total + premiumForGroup(group), 0);

const itemSurchargeFor = (
  items: Item[],
  qualifies: (item: Item) => boolean,
  rate: number,
): number =>
  items.reduce(
    (total, item) => (qualifies(item) ? total + basePremiumFor(item) * rate : total),
    0,
  );

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

type QuoteContext = { customer: Customer; quoteIndex: number };

type PolicyModifier = (base: number, items: Item[], context: QuoteContext) => number;

const discountWhen =
  (rate: number, qualifies: (context: QuoteContext) => boolean): PolicyModifier =>
  (base, _items, context) =>
    qualifies(context) ? -(base * rate) : 0;

const isLoyalCustomer = ({ customer }: QuoteContext): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const isFollowUpQuote = ({ quoteIndex }: QuoteContext): boolean => quoteIndex > 0;

const cursedSurcharge: PolicyModifier = (_base, items) =>
  itemSurchargeFor(items, isCursed, CURSE_SURCHARGE_RATE);

const highEnchantmentSurcharge: PolicyModifier = (_base, items) =>
  itemSurchargeFor(items, isHighlyEnchanted, HIGH_ENCHANTMENT_RATE);

const firstInsuranceSurcharge: PolicyModifier = (base) => base * FIRST_INSURANCE_RATE;

const loyaltyDiscount = discountWhen(LOYALTY_DISCOUNT_RATE, isLoyalCustomer);

const followUpDiscount = discountWhen(FOLLOW_UP_DISCOUNT_RATE, isFollowUpQuote);

const POLICY_MODIFIERS: PolicyModifier[] = [
  cursedSurcharge,
  highEnchantmentSurcharge,
  firstInsuranceSurcharge,
  loyaltyDiscount,
  followUpDiscount,
];

const sumModifiers = (base: number, items: Item[], context: QuoteContext): number =>
  POLICY_MODIFIERS.reduce((total, modifier) => total + modifier(base, items, context), 0);

const quotePremium = (items: Item[], context: QuoteContext): number => {
  assertKnownItemTypes(items);
  const base = totalBasePremiumFor(items);
  return Math.ceil(base + sumModifiers(base, items, context) + PROCESSING_FEE);
};

const insuranceValueFor = (item: Item): number => INSURANCE_VALUES[item.type] ?? 0;

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueFor(item), 0);

const policyItemsFor = (step: Step, scenario: Scenario): Item[] =>
  scenario.steps[step.policy ?? 0].items ?? [];

const damagesIn = (step: Step): Damage[] => step.incident?.damages ?? [];

type CoveredDamage = { damage: Damage; item: Item };

const assertDamageAmountsNonNegative = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
  }
};

const matchDamageToInsuredItem = (damage: Damage, items: Item[]): CoveredDamage => {
  const item = items.find((candidate) => candidate.type === damage.itemType);
  if (!item) throw new Error(`damaged item not in policy: ${damage.itemType}`);
  return { damage, item };
};

const coverDamages = (damages: Damage[], items: Item[]): CoveredDamage[] => {
  assertDamageAmountsNonNegative(damages);
  return damages.map((damage) => matchDamageToInsuredItem(damage, items));
};

const triggersPartialPayout = (item: Item): boolean =>
  (item.enchantment ?? 0) >= PAYOUT_HIGH_ENCHANTMENT_THRESHOLD;

const reimbursableAmount = ({ damage, item }: CoveredDamage): number =>
  triggersPartialPayout(item) ? damage.amount * PAYOUT_HIGH_ENCHANTMENT_RATE : damage.amount;

const payoutForDamage = (covered: CoveredDamage): number =>
  Math.max(0, reimbursableAmount(covered) - DEDUCTIBLE);

const totalPayoutFor = (covered: CoveredDamage[]): number =>
  covered.reduce((total, c) => total + payoutForDamage(c), 0);

const processClaim = (
  step: Step,
  scenario: Scenario,
  alreadyPaid: number,
): { result: StepResult; paid: number } => {
  const policyItems = policyItemsFor(step, scenario);
  const covered = coverDamages(damagesIn(step), policyItems);
  const remainingCapBefore = CAP_MULTIPLIER * insuranceSumOf(policyItems) - alreadyPaid;
  const payout = Math.min(totalPayoutFor(covered), remainingCapBefore);
  return {
    result: { payout, remainingCap: remainingCapBefore - payout },
    paid: alreadyPaid + payout,
  };
};

type RunState = { results: StepResult[]; paidByPolicy: Map<number, number> };

const withPaid = (
  paidByPolicy: Map<number, number>,
  policyIndex: number,
  paid: number,
): Map<number, number> => new Map(paidByPolicy).set(policyIndex, paid);

const appendResult = (state: RunState, result: StepResult): RunState => ({
  ...state,
  results: [...state.results, result],
});

const handleClaim = (state: RunState, step: Step, scenario: Scenario): RunState => {
  const policyIndex = step.policy ?? 0;
  const alreadyPaid = state.paidByPolicy.get(policyIndex) ?? 0;
  const { result, paid } = processClaim(step, scenario, alreadyPaid);
  return {
    results: [...state.results, result],
    paidByPolicy: withPaid(state.paidByPolicy, policyIndex, paid),
  };
};

const handleQuote = (
  state: RunState,
  step: Step,
  scenario: Scenario,
  quoteIndex: number,
): RunState =>
  appendResult(state, {
    premium: quotePremium(step.items ?? [], { customer: scenario.customer, quoteIndex }),
  });

const processStep = (
  state: RunState,
  step: Step,
  scenario: Scenario,
  quoteIndex: number,
): RunState =>
  step.op === "claim"
    ? handleClaim(state, step, scenario)
    : handleQuote(state, step, scenario, quoteIndex);

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const initial: RunState = { results: [], paidByPolicy: new Map() };
  const final = scenario.steps.reduce(
    (state, step, index) => processStep(state, step, scenario, index),
    initial,
  );
  return { results: final.results };
};
