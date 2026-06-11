// claim-office.ts

type Item = { type: string; cursed?: boolean; enchantment?: number };

type QuoteStep = { op: string; items: Item[] };

type Damage = { itemType: string; amount: number };

type Incident = { cause: string; damages: Damage[] };

type ClaimStep = { op: string; policy: number; incident: Incident };

type Step = QuoteStep | ClaimStep;

type Customer = { yearsWithMHPCO: number };

type Scenario = {
  customer: Customer;
  steps: Step[];
};

type QuoteResult = { premium: number };

type ClaimResult = { payout: number; remainingCap: number };

type StepResult = QuoteResult | ClaimResult;

type ScenarioResult = {
  results: StepResult[];
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const PROCESSING_FEE = 5;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const CURSE_SURCHARGE_RATE = 0.5;

const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const ENCHANTMENT_SURCHARGE_THRESHOLD = 5;

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_DISCOUNT_THRESHOLD_YEARS = 2;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const DEDUCTIBLE = 100;
const PAYOUT_CAP_MULTIPLIER = 2;

const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const countItemsByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const basePremiumForType = (type: string): number => {
  const basePremium = BASE_PREMIUMS[type];
  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return basePremium;
};

const basePremiumForGroup = (type: string, count: number): number => {
  const basePremium = basePremiumForType(type);
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * basePremium;
};

const totalBasePremium = (items: Item[]): number =>
  [...countItemsByType(items)].reduce(
    (total, [type, count]) => total + basePremiumForGroup(type, count),
    0,
  );

const curseSurchargeForItem = (item: Item): number =>
  item.cursed ? basePremiumForType(item.type) * CURSE_SURCHARGE_RATE : 0;

const enchantmentSurchargeForItem = (item: Item): number =>
  (item.enchantment ?? 0) >= ENCHANTMENT_SURCHARGE_THRESHOLD
    ? basePremiumForType(item.type) * ENCHANTMENT_SURCHARGE_RATE
    : 0;

const totalItemSurcharge = (items: Item[]): number =>
  items.reduce(
    (total, item) =>
      total + curseSurchargeForItem(item) + enchantmentSurchargeForItem(item),
    0,
  );

const policyDiscountRate = (customer: Customer, stepIndex: number): number => {
  const loyaltyDiscountRate =
    customer.yearsWithMHPCO >= LOYALTY_DISCOUNT_THRESHOLD_YEARS
      ? LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscountRate = stepIndex > 0 ? FOLLOW_UP_DISCOUNT_RATE : 0;
  return loyaltyDiscountRate + followUpDiscountRate;
};

const payoutCapForItems = (items: Item[]): number =>
  PAYOUT_CAP_MULTIPLIER *
  items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);

const reimbursementRateForItem = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const payoutForDamage = (damage: Damage, policyItems: Item[]): number => {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
  const damagedItem = policyItems.find(
    (item) => item.type === damage.itemType,
  );
  if (damagedItem === undefined) {
    throw new Error(`Item type not covered by policy: ${damage.itemType}`);
  }
  return damage.amount * reimbursementRateForItem(damagedItem) - DEDUCTIBLE;
};

const assertDamagesWithinCoverage = (
  damages: Damage[],
  policyItems: Item[],
): void => {
  const coveredCounts = countItemsByType(policyItems);
  const claimedCounts = countItemsByType(
    damages.map((damage) => ({ type: damage.itemType })),
  );
  for (const [type, claimed] of claimedCounts) {
    if (claimed > (coveredCounts.get(type) ?? 0)) {
      throw new Error(
        `More damage entries than covered items of type: ${type}`,
      );
    }
  }
};

const incidentPayout = (incident: Incident, policyItems: Item[]): number => {
  assertDamagesWithinCoverage(incident.damages, policyItems);
  return Math.floor(
    incident.damages.reduce(
      (total, damage) => total + payoutForDamage(damage, policyItems),
      0,
    ),
  );
};

const isClaimStep = (step: Step): step is ClaimStep => "incident" in step;

const processClaimStep = (
  step: ClaimStep,
  steps: Step[],
  paidByPolicy: Map<number, number>,
): ClaimResult => {
  const policyItems = (steps[step.policy] as QuoteStep).items;
  const alreadyPaid = paidByPolicy.get(step.policy) ?? 0;
  const remainingCapBeforeClaim = payoutCapForItems(policyItems) - alreadyPaid;
  const payout = Math.min(
    incidentPayout(step.incident, policyItems),
    remainingCapBeforeClaim,
  );
  paidByPolicy.set(step.policy, alreadyPaid + payout);
  return {
    payout,
    remainingCap: remainingCapBeforeClaim - payout,
  };
};

const processQuoteStep = (
  step: QuoteStep,
  customer: Customer,
  stepIndex: number,
): QuoteResult => {
  const basePremium = totalBasePremium(step.items);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const itemSurcharge = totalItemSurcharge(step.items);
  const discount = basePremium * policyDiscountRate(customer, stepIndex);
  return {
    premium: Math.ceil(
      basePremium + firstInsuranceSurcharge + itemSurcharge - discount +
        PROCESSING_FEE,
    ),
  };
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  const paidByPolicy = new Map<number, number>();
  return {
    results: scenario.steps.map((step, index) =>
      isClaimStep(step)
        ? processClaimStep(step, scenario.steps, paidByPolicy)
        : processQuoteStep(step, scenario.customer, index),
    ),
  };
};
