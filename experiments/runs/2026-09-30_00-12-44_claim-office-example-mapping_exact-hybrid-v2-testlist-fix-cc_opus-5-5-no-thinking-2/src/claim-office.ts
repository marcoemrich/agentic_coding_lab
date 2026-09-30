type Item = { type: string; cursed?: boolean; enchantment?: number };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
};

export type ScenarioResult = { results: object[] };

// MHPCO price list: insurance value and base premium per item type
const PRICE_LIST: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

const PROCESSING_FEE = 5;
// A block of 3 alike components costs 60 G instead of 3 × 25 = 75 G
const COMPONENT_BLOCK_SIZE = 3;
const BLOCK_DISCOUNT = 15;

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;
const COVERAGE_CAP_MULTIPLIER = 2;

const PERCENT_BASE = 100;

// Multiplies before dividing, so percentages of integer amounts stay exact
const percentOf = (amount: number, percent: number): number => (amount * percent) / PERCENT_BASE;

const firstInsuranceSurcharge = (policyBasePremium: number): number =>
  percentOf(policyBasePremium, FIRST_INSURANCE_SURCHARGE_PERCENT);

const loyaltyDiscount = (policyBasePremium: number, yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= LOYALTY_MIN_YEARS ? percentOf(policyBasePremium, LOYALTY_DISCOUNT_PERCENT) : 0;

const followUpDiscount = (policyBasePremium: number, isFollowUpContract: boolean): number =>
  isFollowUpContract ? percentOf(policyBasePremium, FOLLOW_UP_DISCOUNT_PERCENT) : 0;

// Only final amounts are rounded, always in MHPCO's favor:
// premiums are rounded up, payouts are rounded down
const roundPremiumInMHPCOsFavor = (premium: number): number => Math.ceil(premium);
const roundPayoutInMHPCOsFavor = (payout: number): number => Math.floor(payout);

const blockDiscountFor = (items: Item[], type: string): number => {
  const count = items.filter((item) => item.type === type).length;
  return count === COMPONENT_BLOCK_SIZE ? BLOCK_DISCOUNT : 0;
};

const componentBlockDiscounts = (items: Item[]): number =>
  blockDiscountFor(items, "rune") + blockDiscountFor(items, "moonstone");

const basePremiumOf = (item: Item): number => PRICE_LIST[item.type].basePremium;

const totalBasePremium = (items: Item[]): number => {
  const itemPremiums = items.reduce((sum, item) => sum + basePremiumOf(item), 0);
  return itemPremiums - componentBlockDiscounts(items);
};

// Sums a surcharge computed from each qualifying item's own base premium
const perItemSurcharge = (
  items: Item[],
  applies: (item: Item) => boolean,
  surchargeOf: (basePremium: number) => number,
): number =>
  items.filter(applies).reduce((sum, item) => sum + surchargeOf(basePremiumOf(item)), 0);

const curseSurcharge = (items: Item[]): number =>
  perItemSurcharge(
    items,
    (item) => item.cursed === true,
    (premium) => percentOf(premium, CURSE_SURCHARGE_PERCENT),
  );

const highEnchantmentSurcharge = (items: Item[]): number =>
  perItemSurcharge(
    items,
    (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    (premium) => percentOf(premium, HIGH_ENCHANTMENT_SURCHARGE_PERCENT),
  );

const assertKnownItemTypes = (items: Item[]): void => {
  const unknownItem = items.find((item) => !(item.type in PRICE_LIST));
  if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
};

const quotePremium = (
  step: QuoteStep,
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number => {
  assertKnownItemTypes(step.items);
  const policyBasePremium = totalBasePremium(step.items);
  return roundPremiumInMHPCOsFavor(
    policyBasePremium +
      curseSurcharge(step.items) +
      highEnchantmentSurcharge(step.items) +
      firstInsuranceSurcharge(policyBasePremium) -
      loyaltyDiscount(policyBasePremium, yearsWithMHPCO) -
      followUpDiscount(policyBasePremium, isFollowUpContract) +
      PROCESSING_FEE,
  );
};

const DEDUCTIBLE = 100;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + PRICE_LIST[item.type].insuranceValue, 0);

const coverageCap = (items: Item[]): number => COVERAGE_CAP_MULTIPLIER * insuranceSum(items);

const isClaim = (step: unknown): step is ClaimStep => (step as ClaimStep).op === "claim";

// A damage to an item not covered by the policy rejects the whole claim
const insuredItemFor = (damage: Damage, policyItems: Item[]): Item => {
  const insuredItem = policyItems.find((item) => item.type === damage.itemType);
  if (!insuredItem) throw new Error(`Damaged item is not insured: ${damage.itemType}`);
  return insuredItem;
};

const reimbursableAmount = (damage: Damage, policyItems: Item[]): number =>
  (insuredItemFor(damage, policyItems).enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? percentOf(damage.amount, REDUCED_REIMBURSEMENT_PERCENT)
    : damage.amount;

// Each damage is paid out minus the per-damage deductible, never below zero
const damagePayout = (damage: Damage, policyItems: Item[]): number =>
  Math.max(0, reimbursableAmount(damage, policyItems) - DEDUCTIBLE);

const claimPayout = (step: ClaimStep, policyItems: Item[]): number =>
  roundPayoutInMHPCOsFavor(
    step.incident.damages.reduce((sum, damage) => sum + damagePayout(damage, policyItems), 0),
  );

const assertNonNegativeDamages = (damages: Damage[]): void => {
  const negativeDamage = damages.find((damage) => damage.amount < 0);
  if (negativeDamage) throw new Error(`Damage amount must not be negative: ${negativeDamage.amount}`);
};

// Each insured item can be damaged at most once per claim.
// Uninsured types are left to insuredItemFor, which reports them as not insured.
const assertNoMoreDamagesThanInsured = (damages: Damage[], policyItems: Item[]): void => {
  const overclaimed = damages.find(({ itemType }) => {
    const insuredCount = policyItems.filter((item) => item.type === itemType).length;
    const damagedCount = damages.filter((d) => d.itemType === itemType).length;
    return insuredCount > 0 && damagedCount > insuredCount;
  });
  if (overclaimed) throw new Error(`More ${overclaimed.itemType} damages than insured`);
};

// Pays the claim up to whatever is left of the policy's coverage cap
const settleClaim = (step: ClaimStep, policyItems: Item[], alreadyPaidOut: number) => {
  assertNonNegativeDamages(step.incident.damages);
  assertNoMoreDamagesThanInsured(step.incident.damages, policyItems);
  const capLeft = coverageCap(policyItems) - alreadyPaidOut;
  const payout = Math.min(claimPayout(step, policyItems), capLeft);
  return { payout, remainingCap: capLeft - payout };
};

// Every contract after the customer's first one is a follow-up contract
const isFollowUpContract = (steps: unknown[], index: number): boolean =>
  steps.slice(0, index).some((step) => !isClaim(step));

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const paidOutPerPolicy = new Map<number, number>();
  const results = scenario.steps.map((step, index) => {
    if (isClaim(step)) {
      const policy = scenario.steps[step.policy] as QuoteStep;
      const alreadyPaidOut = paidOutPerPolicy.get(step.policy) ?? 0;
      const settlement = settleClaim(step, policy.items, alreadyPaidOut);
      paidOutPerPolicy.set(step.policy, alreadyPaidOut + settlement.payout);
      return settlement;
    }
    return {
      premium: quotePremium(
        step as QuoteStep,
        scenario.customer.yearsWithMHPCO,
        isFollowUpContract(scenario.steps, index),
      ),
    };
  });
  return { results };
};
