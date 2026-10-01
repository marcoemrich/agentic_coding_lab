export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
};

export type ScenarioResult = { results: unknown[] };

type Item = { type: string; cursed?: boolean; enchantment?: number };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

type ItemTypeTerms = { basePremium: number; insuranceValue: number };

const ITEM_TYPES: Record<string, ItemTypeTerms> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

// quoting
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

// claims
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const sumOf = <T>(values: T[], amountOf: (value: T) => number): number =>
  values.reduce((sum, value) => sum + amountOf(value), 0);

const termsOf = (type: string): ItemTypeTerms => {
  const terms = ITEM_TYPES[type];
  if (terms === undefined) throw new Error(`Unknown item type: ${type}`);
  return terms;
};

const basePremiumOf = (type: string): number => termsOf(type).basePremium;

const countOfType = (items: Item[], type: string): number =>
  items.filter((item) => item.type === type).length;

const completeBlockTypesIn = (items: Item[]): string[] =>
  COMPONENT_TYPES.filter((componentType) => countOfType(items, componentType) === BLOCK_SIZE);

const policyBasePremiumOf = (items: Item[]): number => {
  const blockTypes = completeBlockTypesIn(items);
  const itemsOutsideBlocks = items.filter(({ type }) => !blockTypes.includes(type));
  const blocksPremium = blockTypes.length * BLOCK_PREMIUM;
  const itemsPremium = sumOf(itemsOutsideBlocks, ({ type }) => basePremiumOf(type));
  return blocksPremium + itemsPremium;
};

const isHighlyEnchanted = ({ enchantment = 0 }: Item): boolean =>
  enchantment >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD;

const surchargeRateOf = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

const itemSurchargesOf = (items: Item[]): number =>
  sumOf(items, (item) => basePremiumOf(item.type) * surchargeRateOf(item));

// rounding always favors the MHPCO; the tolerance absorbs floating-point noise (e.g. 60 * 0.1)
const FLOATING_POINT_TOLERANCE = 1e-9;

const roundUpInMHPCOsFavor = (amount: number): number =>
  Math.ceil(amount - FLOATING_POINT_TOLERANCE);

const roundDownInMHPCOsFavor = (amount: number): number =>
  Math.floor(amount + FLOATING_POINT_TOLERANCE);

const isLoyal = ({ yearsWithMHPCO }: Scenario["customer"]): boolean =>
  yearsWithMHPCO >= LOYALTY_YEARS;

const loyaltyDiscountRateOf = (customer: Scenario["customer"]): number =>
  isLoyal(customer) ? LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscountRateOf = (isFollowUpContract: boolean): number =>
  isFollowUpContract ? FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremium = (
  customer: Scenario["customer"],
  items: Item[],
  isFollowUpContract: boolean,
): number => {
  const basePremium = policyBasePremiumOf(items);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = basePremium * loyaltyDiscountRateOf(customer);
  const followUpDiscount = basePremium * followUpDiscountRateOf(isFollowUpContract);
  const itemSurcharges = itemSurchargesOf(items);
  return roundUpInMHPCOsFavor(
    basePremium +
      itemSurcharges +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
};

const insuranceSumOf = (items: Item[]): number =>
  sumOf(items, ({ type }) => termsOf(type).insuranceValue);

const reimbursementRateOf = ({ enchantment = 0 }: Item): number =>
  enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const payoutFor = (damage: Damage, damagedItem: Item): number =>
  damage.amount * reimbursementRateOf(damagedItem) - DEDUCTIBLE;

// removes and returns the first unmatched item of the given type, so each damage claims a distinct item
const takeItemOfType = (unmatchedItems: Item[], itemType: string): Item => {
  const index = unmatchedItems.findIndex(({ type }) => type === itemType);
  if (index < 0) throw new Error(`Damaged item is not insured by the policy: ${itemType}`);
  return unmatchedItems.splice(index, 1)[0];
};

const assertNoNegativeDamages = (damages: Damage[]): void => {
  const negativeDamage = damages.find(({ amount }) => amount < 0);
  if (negativeDamage) throw new Error(`Damage amount must not be negative: ${negativeDamage.amount}`);
};

const settleClaim = ({ incident }: ClaimStep, policyItems: Item[], capBeforeClaim: number) => {
  assertNoNegativeDamages(incident.damages);
  const unmatchedItems = [...policyItems];
  const desiredPayout = roundDownInMHPCOsFavor(
    sumOf(incident.damages, (damage) =>
      payoutFor(damage, takeItemOfType(unmatchedItems, damage.itemType)),
    ),
  );
  const payout = Math.min(desiredPayout, capBeforeClaim);
  return { payout, remainingCap: capBeforeClaim - payout };
};

const initialCapOf = (policyItems: Item[]): number =>
  insuranceSumOf(policyItems) * CAP_MULTIPLIER;

export const runScenario = (scenario: Scenario): ScenarioResult => {
  let quotesSoFar = 0;
  const remainingCaps = new Map<number, number>();

  const handleQuote = ({ items }: QuoteStep) => {
    const premium = quotePremium(scenario.customer, items, quotesSoFar > 0);
    quotesSoFar++;
    return { premium };
  };

  const handleClaim = (step: ClaimStep) => {
    const policyItems = (scenario.steps[step.policy] as QuoteStep).items;
    const capBeforeClaim = remainingCaps.get(step.policy) ?? initialCapOf(policyItems);
    const result = settleClaim(step, policyItems, capBeforeClaim);
    remainingCaps.set(step.policy, result.remainingCap);
    return result;
  };

  const results = scenario.steps.map((rawStep) => {
    const step = rawStep as QuoteStep | ClaimStep;
    return step.op === "claim" ? handleClaim(step) : handleQuote(step);
  });
  return { results };
};
