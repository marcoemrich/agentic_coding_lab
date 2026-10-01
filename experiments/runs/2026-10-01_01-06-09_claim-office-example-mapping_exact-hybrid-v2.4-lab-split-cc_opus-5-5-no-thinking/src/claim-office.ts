export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteStep = { op: "quote"; items: Item[] };

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

export type Result = QuoteResult | ClaimResult;

// ---------------------------------------------------------------------------
// Item catalog
// ---------------------------------------------------------------------------

type CatalogEntry = { insuranceValue: number; basePremium: number };

const ITEM_CATALOG: Record<string, CatalogEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

const catalogEntryOf = (item: Item): CatalogEntry => {
  const entry = ITEM_CATALOG[item.type];
  if (entry === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return entry;
};

const basePremiumOf = (item: Item): number => catalogEntryOf(item).basePremium;
const insuranceValueOf = (item: Item): number =>
  catalogEntryOf(item).insuranceValue;

// ---------------------------------------------------------------------------
// Quotes
// ---------------------------------------------------------------------------

const PROCESSING_FEE = 5;

// Multiply before dividing so whole-number percentages avoid floating-point error (e.g. `* 0.1`).
const PERCENT = 100;
const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / PERCENT;

const enchantmentOf = (item: Item | undefined): number =>
  item?.enchantment ?? 0;

// Policy-wide modifiers: a percentage of the policy's total base premium.
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const firstInsuranceSurcharge = (basePremium: number): number =>
  percentOf(basePremium, FIRST_INSURANCE_SURCHARGE_PERCENT);

const LOYALTY_MIN_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;

const loyaltyDiscount = (
  basePremium: number,
  yearsWithMHPCO: number,
): number =>
  yearsWithMHPCO >= LOYALTY_MIN_YEARS
    ? percentOf(basePremium, LOYALTY_DISCOUNT_PERCENT)
    : 0;

// Components are insured in blocks: exactly COMPONENT_BLOCK_SIZE alike components are insured
// together at a flat COMPONENT_BLOCK_PREMIUM instead of their individual base premiums.
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const countOfType = (items: Item[], type: string): number =>
  items.filter((item) => item.type === type).length;

// How much cheaper a block of `type` is than insuring its components individually.
const blockSavings = (type: string): number =>
  COMPONENT_BLOCK_SIZE * basePremiumOf({ type }) - COMPONENT_BLOCK_PREMIUM;

const componentBlockDiscount = (items: Item[]): number =>
  COMPONENT_TYPES.filter(
    (type) => countOfType(items, type) === COMPONENT_BLOCK_SIZE,
  ).reduce((discount, type) => discount + blockSavings(type), 0);

const totalBasePremium = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumOf(item), 0) -
  componentBlockDiscount(items);

// Item-specific modifiers: a percentage of the base premium of each item matching the condition.
const itemSurcharge =
  (appliesTo: (item: Item) => boolean, percent: number) =>
  (items: Item[]): number =>
    items
      .filter(appliesTo)
      .reduce((sum, item) => sum + percentOf(basePremiumOf(item), percent), 0);

const CURSE_SURCHARGE_PERCENT = 50;
const curseSurcharge = itemSurcharge(
  (item) => item.cursed === true,
  CURSE_SURCHARGE_PERCENT,
);

const HIGH_ENCHANTMENT_MIN_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const highEnchantmentSurcharge = itemSurcharge(
  (item) => enchantmentOf(item) >= HIGH_ENCHANTMENT_MIN_LEVEL,
  HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
);

const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const followUpDiscount = (basePremium: number, isFollowUp: boolean): number =>
  isFollowUp ? percentOf(basePremium, FOLLOW_UP_DISCOUNT_PERCENT) : 0;

const quotePremium = (
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): number => {
  const basePremium = totalBasePremium(items);
  // Only the final amount is rounded — up, in the MHPCO's favor.
  return Math.ceil(
    basePremium +
      curseSurcharge(items) +
      highEnchantmentSurcharge(items) +
      firstInsuranceSurcharge(basePremium) -
      loyaltyDiscount(basePremium, yearsWithMHPCO) -
      followUpDiscount(basePremium, isFollowUp) +
      PROCESSING_FEE,
  );
};

// A quote is a follow-up when the customer already received a quote earlier in the scenario.
const hasEarlierQuote = (steps: Step[], index: number): boolean =>
  steps.slice(0, index).some((step) => step.op === "quote");

const quoteResult = (
  step: QuoteStep,
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): QuoteResult => ({
  premium: quotePremium(step.items, yearsWithMHPCO, isFollowUp),
});

// ---------------------------------------------------------------------------
// Claims
// ---------------------------------------------------------------------------

const DEDUCTIBLE = 100;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueOf(item), 0);

const COVERAGE_CAP_MULTIPLIER = 2;
const coverageCap = (items: Item[]): number =>
  COVERAGE_CAP_MULTIPLIER * insuranceSum(items);

// Highly enchanted items are only partially reimbursed.
const PARTIAL_REIMBURSEMENT_MIN_ENCHANTMENT = 8;
const PARTIAL_REIMBURSEMENT_PERCENT = 50;

const reimbursedAmount = (damage: Damage, item: Item | undefined): number =>
  enchantmentOf(item) >= PARTIAL_REIMBURSEMENT_MIN_ENCHANTMENT
    ? percentOf(damage.amount, PARTIAL_REIMBURSEMENT_PERCENT)
    : damage.amount;

const payoutFor = (damage: Damage, policyItems: Item[]): number => {
  const item = policyItems.find(
    (candidate) => candidate.type === damage.itemType,
  );
  return reimbursedAmount(damage, item) - DEDUCTIBLE;
};

const damagedCountOfType = (damages: Damage[], itemType: string): number =>
  damages.filter((damage) => damage.itemType === itemType).length;

const assertAmountsNonNegative = (damages: Damage[]): void => {
  damages.forEach(({ itemType, amount }) => {
    if (amount < 0) {
      throw new Error(`Invalid damage amount for ${itemType}: ${amount}`);
    }
  });
};

// Each damage entry must be backed by its own insured item.
const assertDamagesInsured = (damages: Damage[], policyItems: Item[]): void => {
  const damagedTypes = new Set(damages.map((damage) => damage.itemType));
  damagedTypes.forEach((itemType) => {
    if (
      damagedCountOfType(damages, itemType) > countOfType(policyItems, itemType)
    ) {
      throw new Error(
        `Claim lists more damaged ${itemType} items than the policy covers`,
      );
    }
  });
};

// An invalid damage rejects the whole claim.
const assertValidDamages = (damages: Damage[], policyItems: Item[]): void => {
  assertAmountsNonNegative(damages);
  assertDamagesInsured(damages, policyItems);
};

// The payout the damages would warrant before the policy's coverage cap is applied.
const uncappedPayout = (damages: Damage[], policyItems: Item[]): number =>
  // Only the final amount is rounded — down, in the MHPCO's favor.
  Math.floor(
    damages.reduce((sum, damage) => sum + payoutFor(damage, policyItems), 0),
  );

const claimResult = (
  step: ClaimStep,
  policyItems: Item[],
  alreadyPaid: number,
): ClaimResult => {
  assertValidDamages(step.incident.damages, policyItems);
  const availableCap = coverageCap(policyItems) - alreadyPaid;
  const payout = Math.min(
    uncappedPayout(step.incident.damages, policyItems),
    availableCap,
  );
  return { payout, remainingCap: availableCap - payout };
};

// ---------------------------------------------------------------------------
// Scenario
// ---------------------------------------------------------------------------

// A claim references its policy by the index of the quote step that created it.
const insuredItemsOf = (steps: Step[], claim: ClaimStep): Item[] =>
  (steps[claim.policy] as QuoteStep).items;

export const processScenario = ({
  customer,
  steps,
}: Scenario): { results: Result[] } => {
  const paidPerPolicy = new Map<number, number>();
  return {
    results: steps.map((step, index) => {
      if (step.op === "quote") {
        return quoteResult(
          step,
          customer.yearsWithMHPCO,
          hasEarlierQuote(steps, index),
        );
      }
      const alreadyPaid = paidPerPolicy.get(step.policy) ?? 0;
      const result = claimResult(
        step,
        insuredItemsOf(steps, step),
        alreadyPaid,
      );
      paidPerPolicy.set(step.policy, alreadyPaid + result.payout);
      return result;
    }),
  };
};
