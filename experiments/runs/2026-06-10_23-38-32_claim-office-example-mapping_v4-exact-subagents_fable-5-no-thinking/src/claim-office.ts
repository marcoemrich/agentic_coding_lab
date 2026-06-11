// claim-office.ts

export type Customer = {
  yearsWithMHPCO: number;
};

export type Item = {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
};

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: Incident;
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type StepResult = {
  premium?: number;
  payout?: number;
  remainingCap?: number;
};

export type ScenarioResult = {
  results: StepResult[];
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

type ItemTypeRates = {
  basePremium: number;
  insuranceValue: number;
};

const COMPONENT_RATES: ItemTypeRates = { basePremium: 25, insuranceValue: 250 };

const ITEM_TYPE_RATES: Record<string, ItemTypeRates> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: COMPONENT_RATES,
  moonstone: COMPONENT_RATES,
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;

const CURSE_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const ratesOf = (type: string): ItemTypeRates => {
  const rates = ITEM_TYPE_RATES[type];
  if (rates === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }
  return rates;
};

const basePremiumOf = (type: string): number => ratesOf(type).basePremium;

const roundUpInMHPCOFavor = (amount: number): number => Math.ceil(amount);

const roundDownInMHPCOFavor = (amount: number): number => Math.floor(amount);

const typeGroupPremiumOf = (type: string, count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PRICE
    : count * basePremiumOf(type);

const surchargeOf = (
  items: Item[],
  appliesTo: (item: Item) => boolean,
  rate: number,
): number =>
  items.reduce(
    (surcharge, item) =>
      appliesTo(item)
        ? surcharge + basePremiumOf(item.type) * rate
        : surcharge,
    0,
  );

const curseSurchargeOf = (items: Item[]): number =>
  surchargeOf(items, (item) => Boolean(item.cursed), CURSE_SURCHARGE_RATE);

const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const enchantmentSurchargeOf = (items: Item[]): number =>
  surchargeOf(
    items,
    (item) => enchantmentOf(item) >= HIGH_ENCHANTMENT_THRESHOLD,
    ENCHANTMENT_SURCHARGE_RATE,
  );

const policyBasePremiumOf = (items: Item[]): number => {
  const countsByType = new Map<string, number>();
  for (const item of items) {
    countsByType.set(item.type, (countsByType.get(item.type) ?? 0) + 1);
  }
  return [...countsByType].reduce(
    (typeGroupsPremium, [type, count]) =>
      typeGroupsPremium + typeGroupPremiumOf(type, count),
    0,
  );
};

const loyaltyDiscountOf = (
  customer: Customer,
  policyBasePremium: number,
): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? policyBasePremium * LOYALTY_DISCOUNT_RATE
    : 0;

const followUpDiscountOf = (
  isFollowUpQuote: boolean,
  policyBasePremium: number,
): number => (isFollowUpQuote ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE : 0);

const quotePremiumOf = (
  customer: Customer,
  items: Item[],
  isFollowUpQuote: boolean,
): number => {
  const policyBasePremium = policyBasePremiumOf(items);
  const itemSurcharges = curseSurchargeOf(items) + enchantmentSurchargeOf(items);
  const firstInsuranceSurcharge = policyBasePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = loyaltyDiscountOf(customer, policyBasePremium);
  const followUpDiscount = followUpDiscountOf(isFollowUpQuote, policyBasePremium);
  return roundUpInMHPCOFavor(
    policyBasePremium +
      itemSurcharges +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
};

const PAYOUT_CAP_FACTOR = 2;

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const processQuote = (
  customer: Customer,
  quote: QuoteStep,
  isFollowUpQuote: boolean,
): StepResult => ({
  premium: quotePremiumOf(customer, quote.items, isFollowUpQuote),
});

const takeInsuredItemFor = (availableItems: Item[], damage: Damage): Item => {
  const index = availableItems.findIndex(
    (item) => item.type === damage.itemType,
  );
  if (index === -1)
    throw new Error(`item not covered by policy: ${damage.itemType}`);
  const [insuredItem] = availableItems.splice(index, 1);
  return insuredItem;
};

const reimbursementRateOf = (insuredItem: Item): number =>
  enchantmentOf(insuredItem) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const reimbursementOf = (damage: Damage, insuredItem: Item): number => {
  if (damage.amount < 0)
    throw new Error(`negative damage amount: ${damage.amount}`);
  return damage.amount * reimbursementRateOf(insuredItem);
};

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + ratesOf(item.type).insuranceValue, 0);

const payoutCapOf = (policy: QuoteStep): number =>
  insuranceSumOf(policy.items) * PAYOUT_CAP_FACTOR;

const uncappedPayoutOf = (policy: QuoteStep, damages: Damage[]): number => {
  const availableItems = [...policy.items];
  return damages.reduce(
    (total, damage) =>
      total +
      reimbursementOf(damage, takeInsuredItemFor(availableItems, damage)) -
      DEDUCTIBLE,
    0,
  );
};

const processClaim = (
  claim: ClaimStep,
  steps: Step[],
  remainingCaps: Map<number, number>,
): StepResult => {
  const policy = steps[claim.policy] as QuoteStep;
  const availableCap = remainingCaps.get(claim.policy) ?? payoutCapOf(policy);
  const uncappedPayout = uncappedPayoutOf(policy, claim.incident.damages);
  const payout = Math.min(roundDownInMHPCOFavor(uncappedPayout), availableCap);
  const remainingCap = availableCap - payout;
  remainingCaps.set(claim.policy, remainingCap);
  return { payout, remainingCap };
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  const remainingCaps = new Map<number, number>();
  return {
    results: scenario.steps.map((step, stepIndex) =>
      step.op === "quote"
        ? processQuote(scenario.customer, step, stepIndex > 0)
        : processClaim(step, scenario.steps, remainingCaps),
    ),
  };
};
