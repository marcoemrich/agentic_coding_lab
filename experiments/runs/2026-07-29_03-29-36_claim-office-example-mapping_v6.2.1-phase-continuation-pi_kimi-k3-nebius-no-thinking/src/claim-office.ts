const PROCESSING_FEE = 5;

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_DISCOUNT_PERCENT = 20;

// (amount * percent) / 100 keeps rates exact (100 * 0.3 would be 30.000000000000004)
function percentOf(amount: number, percent: number): number {
  return (amount * percent) / 100;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

interface QuoteItem {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

interface QuoteStep {
  op: "quote";
  items?: QuoteItem[];
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
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

type StepResult = { premium: number } | { payout: number; remainingCap: number };

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function premiumForGroup(type: string, count: number): number {
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * BASE_PREMIUMS[type];
}

function countByType(items: QuoteItem[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function basePremiumOf(items: QuoteItem[]): number {
  const counts = countByType(items);
  let total = 0;
  for (const [type, count] of counts) {
    total += premiumForGroup(type, count);
  }
  return total;
}

// surcharges are a percentage of the item's base premium
function basePremiumSurchargeOf(
  items: QuoteItem[],
  qualifies: (item: QuoteItem) => boolean,
  percent: number,
): number {
  return items
    .filter(qualifies)
    .reduce((sum, item) => sum + percentOf(BASE_PREMIUMS[item.type], percent), 0);
}

function curseSurchargeOf(items: QuoteItem[]): number {
  return basePremiumSurchargeOf(
    items,
    (item) => item.cursed === true,
    CURSE_SURCHARGE_PERCENT,
  );
}

function enchantmentLevelOf(item?: QuoteItem): number {
  return item?.enchantment ?? 0;
}

const HIGH_ENCHANTMENT_LEVEL = 5;

function highEnchantmentSurchargeOf(items: QuoteItem[]): number {
  return basePremiumSurchargeOf(
    items,
    (item) => enchantmentLevelOf(item) >= HIGH_ENCHANTMENT_LEVEL,
    HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
  );
}

const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

function loyaltyDiscountOf(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_MIN_YEARS
    ? percentOf(basePremium, LOYALTY_DISCOUNT_PERCENT)
    : 0;
}

function followUpDiscountOf(
  basePremium: number,
  isFollowUpContract: boolean,
): number {
  return isFollowUpContract
    ? percentOf(basePremium, FOLLOW_UP_DISCOUNT_PERCENT)
    : 0;
}

function quotePremium(
  items: QuoteItem[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number {
  const basePremium = basePremiumOf(items);
  const curseSurcharge = curseSurchargeOf(items);
  const highEnchantmentSurcharge = highEnchantmentSurchargeOf(items);
  const firstInsuranceSurcharge = percentOf(
    basePremium,
    FIRST_INSURANCE_SURCHARGE_PERCENT,
  );
  const loyaltyDiscount = loyaltyDiscountOf(basePremium, yearsWithMHPCO);
  const followUpDiscount = followUpDiscountOf(
    basePremium,
    isFollowUpContract,
  );
  return Math.ceil(
    basePremium +
      curseSurcharge +
      highEnchantmentSurcharge +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
}

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

interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

function insuranceSumOf(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

function reimbursementFor(policy: Policy, damage: Damage): number {
  const item = policy.items.find((candidate) => candidate.type === damage.itemType);
  if (item === undefined) {
    throw new Error(`Damaged item is not part of the policy: ${damage.itemType}`);
  }
  const highEnchantmentClauseApplies =
    enchantmentLevelOf(item) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL;
  const reimbursableAmount = highEnchantmentClauseApplies
    ? percentOf(damage.amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT)
    : damage.amount;
  return reimbursableAmount - DEDUCTIBLE;
}

function assertNonNegativeDamages(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
}

function assertDamagesCovered(policy: Policy, damages: Damage[]): void {
  const coveredCountByType = countByType(policy.items);
  const claimedCountByType = new Map<string, number>();
  for (const damage of damages) {
    const claimedCount = (claimedCountByType.get(damage.itemType) ?? 0) + 1;
    claimedCountByType.set(damage.itemType, claimedCount);
    if (claimedCount > (coveredCountByType.get(damage.itemType) ?? 0)) {
      throw new Error(
        `More damage entries for ${damage.itemType} than the policy covers`,
      );
    }
  }
}

function claimPayout(policy: Policy, damages: Damage[]): number {
  assertNonNegativeDamages(damages);
  assertDamagesCovered(policy, damages);
  const requestedPayout = damages.reduce(
    (sum, damage) => sum + reimbursementFor(policy, damage),
    0,
  );
  const cappedPayout = Math.min(requestedPayout, policy.remainingCap);
  // payouts are rounded down in the MHPCO's favor
  return Math.floor(cappedPayout);
}

function assertKnownItemTypes(items: QuoteItem[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

export function processScenario(scenario: unknown): StepResult[] {
  const { customer, steps } = scenario as Scenario;
  const policiesByStep = new Map<number, Policy>();
  let quotesIssued = 0;

  const issueQuote = (step: QuoteStep, stepIndex: number): StepResult => {
    const items = step.items ?? [];
    assertKnownItemTypes(items);
    const insuranceSum = insuranceSumOf(items);
    policiesByStep.set(stepIndex, {
      items,
      remainingCap: CAP_MULTIPLIER * insuranceSum,
    });
    const isFollowUpContract = quotesIssued > 0;
    const premium = quotePremium(items, customer.yearsWithMHPCO, isFollowUpContract);
    quotesIssued++;
    return { premium };
  };

  const settleClaim = (step: ClaimStep): StepResult => {
    const policy = policiesByStep.get(step.policy) as Policy;
    const payout = claimPayout(policy, step.incident.damages);
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  };

  return steps.map((step, stepIndex) =>
    step.op === "claim" ? settleClaim(step) : issueQuote(step, stepIndex),
  );
}
