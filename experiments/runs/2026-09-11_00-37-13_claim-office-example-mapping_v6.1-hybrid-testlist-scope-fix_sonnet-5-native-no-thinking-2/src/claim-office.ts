// ============================================================================
// Shared
// ============================================================================

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;

const PERCENT_BASE = 100;

const applyPercent = (amount: number, percent: number): number => (amount * percent) / PERCENT_BASE;

type QuoteItem = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type Customer = {
  yearsWithMHPCO: number;
};

type QuoteStep = {
  op: "quote";
  items: QuoteItem[];
};

type Damage = { itemType: string; amount: number };

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};

type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
export type Result = QuoteResult | ClaimResult;

// ============================================================================
// Quote
// ============================================================================

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const BLOCK_SIZE = 3;
const BLOCK_PRICE: Record<string, number> = {
  rune: 60,
  moonstone: 60,
};

const groupByType = (items: QuoteItem[]): Record<string, QuoteItem[]> => {
  const groups: Record<string, QuoteItem[]> = {};
  for (const item of items) {
    (groups[item.type] ??= []).push(item);
  }
  return groups;
};

const isPricedAsBlock = (type: string, count: number): boolean =>
  count === BLOCK_SIZE && type in BLOCK_PRICE;

const priceGroup = (type: string, items: QuoteItem[]): number =>
  isPricedAsBlock(type, items.length)
    ? BLOCK_PRICE[type]
    : items.length * BASE_PREMIUM_BY_TYPE[type];

const assertKnownItemTypes = (items: QuoteItem[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM_BY_TYPE)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const calculateBasePremium = (items: QuoteItem[]): number => {
  const groupsByType = groupByType(items);
  return Object.entries(groupsByType).reduce(
    (sum, [type, groupItems]) => sum + priceGroup(type, groupItems),
    0
  );
};

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

const calculateItemSurcharge = (items: QuoteItem[]): number =>
  items.reduce((sum, item) => {
    const itemBasePremium = BASE_PREMIUM_BY_TYPE[item.type];
    const surchargePercent =
      (item.cursed ? CURSE_SURCHARGE_PERCENT : 0) +
      ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0);
    return sum + applyPercent(itemBasePremium, surchargePercent);
  }, 0);

const calculatePolicyModifierPercent = (
  customer: Customer,
  isFollowUpContract: boolean
): number => {
  const isLoyalCustomer = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
  return (
    FIRST_INSURANCE_SURCHARGE_PERCENT +
    (isLoyalCustomer ? -LOYALTY_DISCOUNT_PERCENT : 0) +
    (isFollowUpContract ? -FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0)
  );
};

const quotePremium = (
  step: QuoteStep,
  customer: Customer,
  isFollowUpContract: boolean
): number => {
  assertKnownItemTypes(step.items);
  const basePremium = calculateBasePremium(step.items);
  const itemSurcharge = calculateItemSurcharge(step.items);
  const policyModifierPercent = calculatePolicyModifierPercent(customer, isFollowUpContract);
  const policyModifierAmount = applyPercent(basePremium, policyModifierPercent);
  const premiumBeforeFee = basePremium + itemSurcharge + policyModifierAmount;
  return Math.ceil(premiumBeforeFee + PROCESSING_FEE);
};

// ============================================================================
// Claim
// ============================================================================

const BASE_INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;

const insuranceSum = (items: QuoteItem[]): number =>
  items.reduce((sum, item) => sum + BASE_INSURANCE_VALUE_BY_TYPE[item.type], 0);

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const FULL_REIMBURSEMENT_PERCENT = 100;

// Note: the spec's "dragon-material" clause grants full reimbursement, which is
// numerically identical to the default (no-clause) case below — so `material`
// does not need to be inspected here. This is not an oversight; revisit if a
// future rule makes dragon-material's payout diverge from the default.
const reimbursementPercent = (item: QuoteItem): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT
    : FULL_REIMBURSEMENT_PERCENT;

const damagePayout = (damage: Damage, policyItems: QuoteItem[]): number => {
  const item = policyItems.find((policyItem) => policyItem.type === damage.itemType)!;
  const reimbursement = applyPercent(damage.amount, reimbursementPercent(item));
  return reimbursement - DEDUCTIBLE;
};

const assertValidDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Invalid damage amount: ${damage.amount}`);
    }
  }
};

const countPolicyItemsByType = (policyItems: QuoteItem[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of policyItems) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
};

const countDamagesByItemType = (damages: Damage[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const damage of damages) {
    counts[damage.itemType] = (counts[damage.itemType] ?? 0) + 1;
  }
  return counts;
};

const assertDamagesWithinPolicyCoverage = (damages: Damage[], policyItems: QuoteItem[]): void => {
  const damageCounts = countDamagesByItemType(damages);
  const policyCounts = countPolicyItemsByType(policyItems);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0)) {
      throw new Error(`More damage entries of type ${type} than the policy covers`);
    }
  }
};

const claimPayout = (
  claimStep: ClaimStep,
  policyItems: QuoteItem[],
  cumulativePayout: number
): ClaimResult => {
  assertValidDamages(claimStep.incident.damages);
  assertDamagesWithinPolicyCoverage(claimStep.incident.damages, policyItems);
  const cap = CAP_MULTIPLIER * insuranceSum(policyItems);
  const desiredPayout = claimStep.incident.damages.reduce(
    (sum, damage) => sum + damagePayout(damage, policyItems),
    0
  );
  const payout = Math.floor(Math.min(desiredPayout, cap - cumulativePayout));
  const remainingCap = cap - cumulativePayout - payout;
  return { payout, remainingCap };
};

// ============================================================================
// Orchestration
// ============================================================================

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  const policyItemsByStepIndex: Record<number, QuoteItem[]> = {};
  const cumulativePayoutByPolicy: Record<number, number> = {};
  let quoteStepsSeen = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const policyItems = policyItemsByStepIndex[step.policy];
      const cumulativePayout = cumulativePayoutByPolicy[step.policy] ?? 0;
      const result = claimPayout(step, policyItems, cumulativePayout);
      cumulativePayoutByPolicy[step.policy] = cumulativePayout + result.payout;
      return result;
    }
    const isFollowUpContract = quoteStepsSeen > 0;
    quoteStepsSeen += 1;
    policyItemsByStepIndex[index] = step.items;
    return { premium: quotePremium(step, scenario.customer, isFollowUpContract) };
  });
  return { results };
};
