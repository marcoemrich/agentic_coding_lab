const priceList: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

const COMPONENT_TYPES = ["rune", "moonstone"];

const sumBy = <T>(items: T[], amount: (item: T) => number): number =>
  items.reduce((sum, item) => sum + amount(item), 0);

const sumOfItemPrices = (items: Item[]): number =>
  sumBy(items, (item) => priceList[item.type]);

const countOf = (type: string, items: Item[]): number =>
  items.filter((item) => item.type === type).length;

const componentPremium = (type: string, items: Item[]): number => {
  const count = countOf(type, items);
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PRICE
    : count * priceList[type];
};

export const basePremium = (items: Item[]): number => {
  const nonComponents = items.filter(
    (item) => !COMPONENT_TYPES.includes(item.type),
  );
  const componentsTotal = COMPONENT_TYPES.reduce(
    (total, type) => total + componentPremium(type, items),
    0,
  );
  return sumOfItemPrices(nonComponents) + componentsTotal;
};

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

type Customer = { yearsWithMHPCO: number };

const itemBasePremium = (item: Item): number => basePremium([item]);

const hasEnchantmentAtLeast = (item: Item, threshold: number): boolean =>
  (item.enchantment ?? 0) >= threshold;

// A surcharge is a fraction of the item's own base premium, charged only when
// the item satisfies the given predicate.
const surchargeWhen =
  (qualifies: (item: Item) => boolean, rate: number) =>
  (item: Item): number =>
    qualifies(item) ? itemBasePremium(item) * rate : 0;

const isCursed = (item: Item): boolean => item.cursed ?? false;

const qualifiesForEnchantmentSurcharge = (item: Item): boolean =>
  hasEnchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD);

const curseSurchargeFor = surchargeWhen(isCursed, CURSE_SURCHARGE_RATE);

const enchantSurchargeFor = surchargeWhen(
  qualifiesForEnchantmentSurcharge,
  HIGH_ENCHANTMENT_RATE,
);

const surchargesFor = (item: Item): number =>
  curseSurchargeFor(item) + enchantSurchargeFor(item);

// Premiums round in MHPCO's favor — up. (Claim payouts round down, also in MHPCO's favor.)
const roundInFavorUp = (amount: number): number => Math.ceil(amount);

// Claim payouts round in MHPCO's favor — down.
const roundInFavorDown = (amount: number): number => Math.floor(amount);

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const policyBase = basePremium(items);
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
      ? policyBase * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  const policyCharges =
    policyBase + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;

  const itemSurcharges = sumBy(items, surchargesFor);

  return roundInFavorUp(policyCharges + itemSurcharges + PROCESSING_FEE);
};

const insuranceValueList: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const insuranceSum = (items: Item[]): number =>
  sumBy(items, (item) => insuranceValueList[item.type]);

// The cap is derived from the unmodified insurance value, independent of premium modifiers.
const initialCap = (items: Item[]): number => insuranceSum(items) * CAP_MULTIPLIER;

type Damage = { itemType: string; amount: number };

const qualifiesForReducedPayout = (item: Item): boolean =>
  hasEnchantmentAtLeast(item, HIGH_ENCHANTMENT_PAYOUT_THRESHOLD);

const coveredAmountFor = (damage: Damage, insuredItem: Item): number =>
  qualifiesForReducedPayout(insuredItem)
    ? damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damage.amount;

// Validates a damage against the policy and returns the insured item it refers
// to. Throws if the amount is negative or the item is not in the policy.
const validatedInsuredItem = (damage: Damage, items: Item[]): Item => {
  if (damage.amount < 0) {
    throw new Error(`Invalid damage amount: ${damage.amount}`);
  }
  const insuredItem = items.find((item) => item.type === damage.itemType);
  if (insuredItem === undefined) {
    throw new Error(`Damaged item not in policy: ${damage.itemType}`);
  }
  return insuredItem;
};

const reimbursementFor = (damage: Damage, items: Item[]): number => {
  const insuredItem = validatedInsuredItem(damage, items);
  return coveredAmountFor(damage, insuredItem) - DEDUCTIBLE;
};

type Incident = { cause: string; damages: Damage[] };

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

type Policy = { items: Item[]; remainingCap: number };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const isKnownType = (type: string): boolean => type in priceList;

const assertKnownTypes = (items: Item[]): void => {
  const unknownItem = items.find((item) => !isKnownType(item.type));
  if (unknownItem !== undefined) {
    throw new Error(`Unknown item type: ${unknownItem.type}`);
  }
};

// A claim may list at most as many damage entries of a type as the policy
// insures items of that type. Reject the whole claim otherwise.
const assertDamagesWithinPolicy = (damages: Damage[], items: Item[]): void => {
  const countDamagesOf = (itemType: string): number =>
    damages.filter((damage) => damage.itemType === itemType).length;
  const overClaimed = damages.find(
    (damage) => countDamagesOf(damage.itemType) > countOf(damage.itemType, items),
  );
  if (overClaimed !== undefined) {
    throw new Error(`Too many damages for item type: ${overClaimed.itemType}`);
  }
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policies: Record<number, Policy> = {};
  let quoteCount = 0;

  const handleQuote = (step: QuoteStep, index: number): QuoteResult => {
    assertKnownTypes(step.items);
    const isFollowUp = quoteCount > 0;
    quoteCount += 1;
    policies[index] = {
      items: step.items,
      remainingCap: initialCap(step.items),
    };
    return { premium: quotePremium(step.items, scenario.customer, isFollowUp) };
  };

  const handleClaim = (step: ClaimStep): ClaimResult => {
    const policy = policies[step.policy];
    const damages = step.incident.damages;
    assertDamagesWithinPolicy(damages, policy.items);
    const desiredPayout = roundInFavorDown(
      sumBy(damages, (damage) => reimbursementFor(damage, policy.items)),
    );
    const payout = Math.min(desiredPayout, policy.remainingCap);
    const remainingCap = policy.remainingCap - payout;
    policy.remainingCap = remainingCap;
    return { payout, remainingCap };
  };

  const results = scenario.steps.map((step, index): StepResult =>
    step.op === "quote" ? handleQuote(step, index) : handleClaim(step),
  );

  return { results };
};
