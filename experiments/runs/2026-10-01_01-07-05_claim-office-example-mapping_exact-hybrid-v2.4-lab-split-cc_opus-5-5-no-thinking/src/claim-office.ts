type Item = { type: string; cursed?: boolean; enchantment?: number };

type Damage = { itemType: string; amount: number };

type QuoteStep = { op: "quote"; items: Item[] };

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};

type Step = QuoteStep | ClaimStep;

type QuoteResult = { premium: number };

type ClaimResult = { payout: number; remainingCap: number };

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
// Premium rules
const BASE_PREMIUM_PERCENT = 10;
const PROCESSING_FEE = 5;
const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const FIRST_INSURANCE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

// Claim rules
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const VOLATILE_ENCHANTMENT_THRESHOLD = 8;
const VOLATILE_REIMBURSEMENT_PERCENT = 50;

// Integer percent divided last keeps results exact before Math.ceil.
const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / 100;

const basePremium = (type: string): number =>
  percentOf(INSURANCE_VALUES[type], BASE_PREMIUM_PERCENT);

const isComponentBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.includes(type) && count === BLOCK_SIZE;

const premiumForTypeGroup = (type: string, count: number): number =>
  isComponentBlock(type, count) ? BLOCK_PREMIUM : count * basePremium(type);

const assertKnownType = (type: string): void => {
  if (!(type in INSURANCE_VALUES)) {
    throw new Error(`Unknown item type: ${type}`);
  }
};

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    assertKnownType(item.type);
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const sumBasePremiums = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (sum, [type, count]) => sum + premiumForTypeGroup(type, count),
    0,
  );

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurchargePercent = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_PERCENT : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0);

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce(
    (sum, item) =>
      sum + percentOf(basePremium(item.type), itemSurchargePercent(item)),
    0,
  );

const loyaltyDiscountPercent = (yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT_PERCENT : 0;

// Policy-wide modifiers apply to the base premium; summed as integer percents.
const policyAdjustmentPercent = (
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): number =>
  FIRST_INSURANCE_PERCENT -
  loyaltyDiscountPercent(yearsWithMHPCO) -
  (isFollowUp ? FOLLOW_UP_DISCOUNT_PERCENT : 0);

const quotePremium = (
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): number => {
  const totalBasePremium = sumBasePremiums(items);
  const premium =
    totalBasePremium +
    sumItemSurcharges(items) +
    percentOf(totalBasePremium, policyAdjustmentPercent(yearsWithMHPCO, isFollowUp)) +
    PROCESSING_FEE;
  return Math.ceil(premium);
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

const isVolatile = (item: Item): boolean =>
  (item.enchantment ?? 0) >= VOLATILE_ENCHANTMENT_THRESHOLD;

// Removes and returns the matched item so each damage entry claims a distinct policy item.
const takeDamagedItem = (unclaimedItems: Item[], damage: Damage): Item => {
  const index = unclaimedItems.findIndex((item) => item.type === damage.itemType);
  if (index < 0) {
    throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
  }
  return unclaimedItems.splice(index, 1)[0];
};

const assertNonNegativeAmount = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
};

const reimbursableAmount = (damagedItem: Item, damage: Damage): number =>
  isVolatile(damagedItem)
    ? percentOf(damage.amount, VOLATILE_REIMBURSEMENT_PERCENT)
    : damage.amount;

// Payout is rounded down only after all per-damage amounts are summed.
const claimPayout = (policyItems: Item[], damages: Damage[]): number => {
  const unclaimedItems = [...policyItems];
  return Math.floor(
    damages.reduce((sum, damage) => {
      const damagedItem = takeDamagedItem(unclaimedItems, damage);
      assertNonNegativeAmount(damage);
      return sum + reimbursableAmount(damagedItem, damage) - DEDUCTIBLE;
    }, 0),
  );
};

const coverageCap = (policyItems: Item[]): number =>
  CAP_MULTIPLIER * insuranceSum(policyItems);

const processClaim = (
  policyItems: Item[],
  damages: Damage[],
  alreadyPaid: number,
): ClaimResult => {
  const capBeforeClaim = coverageCap(policyItems) - alreadyPaid;
  const payout = Math.min(claimPayout(policyItems, damages), capBeforeClaim);
  return { payout, remainingCap: capBeforeClaim - payout };
};

const policyItems = (steps: Step[], policyIndex: number): Item[] =>
  (steps[policyIndex] as QuoteStep).items;

export const runScenario = (
  scenario: Scenario,
): { results: (QuoteResult | ClaimResult)[] } => {
  const paidByPolicy = new Map<number, number>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "claim") {
        const alreadyPaid = paidByPolicy.get(step.policy) ?? 0;
        const result = processClaim(
          policyItems(scenario.steps, step.policy),
          step.incident.damages,
          alreadyPaid,
        );
        paidByPolicy.set(step.policy, alreadyPaid + result.payout);
        return result;
      }
      const isFollowUp = index > 0;
      return {
        premium: quotePremium(
          step.items,
          scenario.customer.yearsWithMHPCO,
          isFollowUp,
        ),
      };
    }),
  };
};
