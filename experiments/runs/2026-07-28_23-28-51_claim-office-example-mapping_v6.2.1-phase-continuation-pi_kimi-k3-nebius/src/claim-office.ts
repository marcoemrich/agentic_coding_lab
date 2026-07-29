export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;

const FIRST_INSURANCE_MULTIPLIER = 1.1;

const roundPremiumUp = (amount: number): number => {
  const FLOAT_EPSILON = 1e-9;
  return Math.ceil(amount - FLOAT_EPSILON);
};

interface ItemSpec {
  basePremium: number;
  isComponent?: boolean;
  insuranceValue?: number;
}

const ITEM_CATALOG: Record<string, ItemSpec> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80 },
  potion: { basePremium: 40 },
  rune: { basePremium: 25, isComponent: true, insuranceValue: 250 },
  moonstone: { basePremium: 25, isComponent: true },
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const basePremiumForType = (items: QuoteItem[], type: string): number => {
  const count = items.filter((item) => item.type === type).length;
  const qualifiesForBlockPrice =
    ITEM_CATALOG[type].isComponent === true && count === COMPONENT_BLOCK_SIZE;
  return qualifiesForBlockPrice
    ? COMPONENT_BLOCK_PREMIUM
    : count * ITEM_CATALOG[type].basePremium;
};

const totalBasePremium = (items: QuoteItem[]): number =>
  [...new Set(items.map((item) => item.type))].reduce(
    (sum, type) => sum + basePremiumForType(items, type),
    0,
  );

const itemSurcharge = (
  items: QuoteItem[],
  applies: (item: QuoteItem) => boolean,
  rate: number,
): number =>
  items
    .filter(applies)
    .reduce((sum, item) => sum + ITEM_CATALOG[item.type].basePremium * rate, 0);

const CURSE_SURCHARGE_RATE = 0.5;

const curseSurcharge = (items: QuoteItem[]): number =>
  itemSurcharge(items, (item) => item.cursed === true, CURSE_SURCHARGE_RATE);

const enchantmentOf = (item: QuoteItem | undefined): number =>
  item?.enchantment ?? 0;

const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;

const highEnchantmentSurcharge = (items: QuoteItem[]): number =>
  itemSurcharge(
    items,
    (item) => enchantmentOf(item) >= HIGH_ENCHANTMENT_LEVEL,
    HIGH_ENCHANTMENT_RATE,
  );

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

const percentageDiscount = (
  basePremium: number,
  applies: boolean,
  rate: number,
): number => (applies ? basePremium * rate : 0);

const loyaltyDiscount = (
  basePremium: number,
  yearsWithMHPCO: number,
): number =>
  percentageDiscount(
    basePremium,
    yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    LOYALTY_DISCOUNT_RATE,
  );

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const followUpDiscount = (basePremium: number, isFollowUp: boolean): number =>
  percentageDiscount(basePremium, isFollowUp, FOLLOW_UP_DISCOUNT_RATE);

const quotePremium = (
  items: QuoteItem[],
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): number => {
  const basePremium = totalBasePremium(items);
  return (
    roundPremiumUp(
      basePremium * FIRST_INSURANCE_MULTIPLIER +
        curseSurcharge(items) +
        highEnchantmentSurcharge(items) -
        loyaltyDiscount(basePremium, yearsWithMHPCO) -
        followUpDiscount(basePremium, isFollowUp),
    ) + PROCESSING_FEE
  );
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const insuranceSum = (items: QuoteItem[]): number =>
  items.reduce(
    (sum, item) => sum + (ITEM_CATALOG[item.type].insuranceValue ?? 0),
    0,
  );

const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_CLAUSE_RATE = 0.5;

const payoutForDamage = (damage: Damage, policy: QuoteStep): number => {
  const insuredItem = policy.items.find((i) => i.type === damage.itemType);
  const reimbursementRate =
    enchantmentOf(insuredItem) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL
      ? HIGH_ENCHANTMENT_CLAUSE_RATE
      : 1;
  return damage.amount * reimbursementRate - DEDUCTIBLE;
};

const claimResult = (
  incident: ClaimStep["incident"],
  policy: QuoteStep,
): Result => {
  const payout = incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(damage, policy),
    0,
  );
  const cap = CAP_MULTIPLIER * insuranceSum(policy.items);
  return { payout, remainingCap: cap - payout };
};

export const runScenario = (scenario: Scenario): Result[] => {
  let quotesSeen = 0;
  return scenario.steps.map((step) => {
    if (step.op === "quote") {
      const isFollowUp = quotesSeen > 0;
      quotesSeen += 1;
      return {
        premium: quotePremium(
          step.items,
          scenario.customer.yearsWithMHPCO,
          isFollowUp,
        ),
      };
    }
    const policy = scenario.steps[step.policy] as QuoteStep;
    return claimResult(step.incident, policy);
  });
};
