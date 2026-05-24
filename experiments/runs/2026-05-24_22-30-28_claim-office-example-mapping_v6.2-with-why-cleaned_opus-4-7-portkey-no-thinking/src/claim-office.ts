export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type Damage = { itemType: string; amount: number };

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResult = {
  results: StepResult[];
};

// Quote constants
const PROCESSING_FEE = 5;
const FIRST_CONTRACT_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const BLOCK_OF_THREE_DISCOUNT = 15;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

type CatalogEntry = { basePremium: number; insuranceValue: number };

const ITEM_CATALOG: Record<string, CatalogEntry> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const catalogEntryFor = (type: string): CatalogEntry => {
  const entry = ITEM_CATALOG[type];
  if (!entry) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return entry;
};

// Claim constants
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const BLOCK_OF_THREE_ELIGIBLE_TYPES = ["rune", "moonstone"];

const blockOfThreeDiscount = (alikeComponentCount: number): number =>
  alikeComponentCount === 3 ? BLOCK_OF_THREE_DISCOUNT : 0;

const countItemsOfType = (items: Item[], type: string): number =>
  items.filter((item) => item.type === type).length;

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const isCursed = (item: Item): boolean => item.cursed === true;
const qualifiesForHighEnchantmentSurcharge = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD;

type Rule<T> = { applies: (input: T) => boolean; rate: number };

const sumApplicableRates = <T>(
  rules: ReadonlyArray<Rule<T>>,
  input: T,
  base: number,
): number =>
  rules.reduce((sum, { applies, rate }) => sum + (applies(input) ? base * rate : 0), 0);

const ITEM_SURCHARGE_RATES: ReadonlyArray<Rule<Item>> = [
  { applies: isCursed, rate: CURSE_SURCHARGE_RATE },
  { applies: qualifiesForHighEnchantmentSurcharge, rate: HIGH_ENCHANTMENT_SURCHARGE_RATE },
];

const basePremiumFor = (item: Item): number => catalogEntryFor(item.type).basePremium;

const surchargesForItem = (item: Item): number =>
  sumApplicableRates(ITEM_SURCHARGE_RATES, item, basePremiumFor(item));

const sumItemSpecificSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + surchargesForItem(item), 0);

const blockOfThreeDiscountTotal = (items: Item[]): number =>
  BLOCK_OF_THREE_ELIGIBLE_TYPES.reduce(
    (sum, type) => sum + blockOfThreeDiscount(countItemsOfType(items, type)),
    0,
  );

const basePremiumForItems = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumFor(item), 0) -
  blockOfThreeDiscountTotal(items);

type QuoteContext = { customer: Scenario["customer"]; isFollowUp: boolean };

// Positive rate = surcharge, negative = discount.
const POLICY_ADJUSTMENTS: ReadonlyArray<Rule<QuoteContext>> = [
  { applies: () => true, rate: FIRST_CONTRACT_SURCHARGE_RATE },
  {
    applies: (ctx) => ctx.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    rate: -LOYALTY_DISCOUNT_RATE,
  },
  { applies: (ctx) => ctx.isFollowUp, rate: -FOLLOW_UP_CONTRACT_DISCOUNT_RATE },
];

const sumPolicyAdjustments = (basePremium: number, ctx: QuoteContext): number =>
  sumApplicableRates(POLICY_ADJUSTMENTS, ctx, basePremium);

// MHPCO always rounds in its own favor: charge a bit more, pay out a bit less.
const roundPremiumInFavorOfInsurer = Math.ceil;
const roundPayoutInFavorOfInsurer = Math.floor;

const quote = (
  step: QuoteStep,
  customer: Scenario["customer"],
  isFollowUp: boolean,
): QuoteResult => {
  const basePremium = basePremiumForItems(step.items);
  const itemSurcharges = sumItemSpecificSurcharges(step.items);
  const policyAdjustments = sumPolicyAdjustments(basePremium, { customer, isFollowUp });
  const premium = roundPremiumInFavorOfInsurer(
    basePremium + itemSurcharges + policyAdjustments + PROCESSING_FEE,
  );
  return { premium };
};

type Policy = { items: Item[]; cap: number };

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + catalogEntryFor(item.type).insuranceValue, 0);

const initialCapFor = (items: Item[]): number => insuranceSumOf(items) * CAP_MULTIPLIER;

const findInsuredItem = (policy: Policy, itemType: string): Item => {
  const item = policy.items.find((item) => item.type === itemType);
  if (!item) {
    throw new Error(`No insured item of type ${itemType} in policy`);
  }
  return item;
};

const qualifiesForHighEnchantmentPayoutReduction = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;

const payoutForDamage = (damage: Damage, insuredItem: Item): number => {
  const reimbursable = qualifiesForHighEnchantmentPayoutReduction(insuredItem)
    ? damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damage.amount;
  return Math.max(0, reimbursable - DEDUCTIBLE);
};

const countDamagesByType = (damages: Damage[]): Map<string, number> =>
  damages.reduce((counts, dmg) => {
    counts.set(dmg.itemType, (counts.get(dmg.itemType) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());

const assertDamagesWithinPolicy = (damages: Damage[], policy: Policy): void => {
  for (const [itemType, damagedCount] of countDamagesByType(damages)) {
    const insuredCount = countItemsOfType(policy.items, itemType);
    if (insuredCount === 0) {
      throw new Error(`No insured item of type ${itemType} in policy`);
    }
    if (damagedCount > insuredCount) {
      throw new Error(`Damage count for ${itemType} exceeds insured quantity`);
    }
  }
};

const claim = (step: ClaimStep, policy: Policy): ClaimResult => {
  assertDamagesWithinPolicy(step.incident.damages, policy);
  const grossPayout = step.incident.damages.reduce(
    (sum, dmg) => sum + payoutForDamage(dmg, findInsuredItem(policy, dmg.itemType)),
    0,
  );
  const cappedPayout = Math.min(grossPayout, policy.cap);
  return {
    payout: roundPayoutInFavorOfInsurer(cappedPayout),
    remainingCap: policy.cap - cappedPayout,
  };
};

const handleQuoteStep = (
  step: QuoteStep,
  customer: Scenario["customer"],
  policies: Policy[],
): QuoteResult => {
  const isFollowUp = policies.length > 0;
  const result = quote(step, customer, isFollowUp);
  policies.push({ items: step.items, cap: initialCapFor(step.items) });
  return result;
};

const handleClaimStep = (step: ClaimStep, policies: Policy[]): ClaimResult => {
  const policy = policies[step.policy];
  const result = claim(step, policy);
  policy.cap = result.remainingCap;
  return result;
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step) =>
    step.op === "quote"
      ? handleQuoteStep(step, scenario.customer, policies)
      : handleClaimStep(step, policies),
  );
  return { results };
};
