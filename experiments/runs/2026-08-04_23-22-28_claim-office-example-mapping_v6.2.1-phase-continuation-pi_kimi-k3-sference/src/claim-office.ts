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

export interface ScenarioResult {
  results: unknown[];
}

interface ItemInfo {
  premium: number;
  insuranceValue: number;
}

const ITEM_CATALOG: Record<string, ItemInfo> = {
  sword: { premium: 100, insuranceValue: 1000 },
  amulet: { premium: 60, insuranceValue: 600 },
  staff: { premium: 80, insuranceValue: 800 },
  potion: { premium: 40, insuranceValue: 400 },
  rune: { premium: 25, insuranceValue: 250 },
  moonstone: { premium: 25, insuranceValue: 250 },
};

const itemInfo = (type: string): ItemInfo => {
  const info = ITEM_CATALOG[type];
  if (info === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return info;
};

const FIRST_INSURANCE_RATE = 0.1;
const PROCESSING_FEE = 5;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;

const typePremium = (type: string): number => itemInfo(type).premium;

const sumBy = <T>(items: T[], value: (item: T) => number): number =>
  items.reduce((sum, item) => sum + value(item), 0);

// A block of exactly COMPONENT_BLOCK_SIZE alike items costs a flat premium;
// any other count is priced per item.
const premiumForTypeGroup = (type: string, count: number): number =>
  count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * typePremium(type);

const countBy = <T>(items: T[], key: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const itemKey = key(item);
    counts.set(itemKey, (counts.get(itemKey) ?? 0) + 1);
  }
  return counts;
};

const basePremium = (items: QuoteItem[]): number =>
  [...countBy(items, (item) => item.type)].reduce(
    (total, [type, count]) => total + premiumForTypeGroup(type, count),
    0,
  );

// Surcharges are a rate times the type premium, summed over qualifying items.
const perItemSurcharge = (
  items: QuoteItem[],
  applies: (item: QuoteItem) => boolean,
  rate: number,
): number =>
  sumBy(items, (item) => (applies(item) ? typePremium(item.type) * rate : 0));

const isCursed = (item: QuoteItem): boolean => item.cursed ?? false;

const curseSurcharge = (items: QuoteItem[]): number =>
  perItemSurcharge(items, isCursed, CURSE_SURCHARGE_RATE);

// A missing enchantment means level 0.
const enchantmentLevel = (item: QuoteItem): number => item.enchantment ?? 0;

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;

const hasHighEnchantment = (item: QuoteItem): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const highEnchantmentSurcharge = (items: QuoteItem[]): number =>
  perItemSurcharge(items, hasHighEnchantment, HIGH_ENCHANTMENT_RATE);

const firstInsuranceSurcharge = (base: number): number =>
  base * FIRST_INSURANCE_RATE;

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

const loyaltyDiscount = (base: number, yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? base * LOYALTY_DISCOUNT_RATE : 0;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const followUpDiscount = (base: number, isFollowUp: boolean): number =>
  isFollowUp ? base * FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremium = (
  items: QuoteItem[],
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): number => {
  const base = basePremium(items);
  return Math.ceil(
    base +
      firstInsuranceSurcharge(base) +
      curseSurcharge(items) +
      highEnchantmentSurcharge(items) -
      loyaltyDiscount(base, yearsWithMHPCO) -
      followUpDiscount(base, isFollowUp) +
      PROCESSING_FEE,
  );
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

const createPolicy = (items: QuoteItem[]): Policy => {
  const insuranceSum = sumBy(items, (item) => itemInfo(item.type).insuranceValue);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const HIGH_ENCHANTMENT_CLAUSE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const damagePayout = (item: QuoteItem, amount: number): number => {
  const reimbursed =
    enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAUSE_THRESHOLD
      ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
      : amount;
  return reimbursed - DEDUCTIBLE;
};

// A claim may only name items the policy actually insures.
const coveredItem = (policy: Policy, itemType: string): QuoteItem => {
  const item = policy.items.find((candidate) => candidate.type === itemType);
  if (!item) {
    throw new Error(`Damaged item not covered by policy: ${itemType}`);
  }
  return item;
};

const validateDamageCounts = (policy: Policy, damages: Damage[]): void => {
  const insuredCountByType = countBy(policy.items, (item) => item.type);
  for (const [itemType, damagedCount] of countBy(damages, (damage) => damage.itemType)) {
    const insuredCount = insuredCountByType.get(itemType) ?? 0;
    if (damagedCount > insuredCount) {
      throw new Error(
        `Claim reports ${damagedCount} damaged ${itemType} item(s) but the policy insures only ${insuredCount}`,
      );
    }
  }
};

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Invalid damage amount: ${damage.amount}`);
    }
  }
};

const processClaim = (policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } => {
  validateDamageAmounts(damages);
  validateDamageCounts(policy, damages);
  const payout = sumBy(damages, (damage) =>
    damagePayout(coveredItem(policy, damage.itemType), damage.amount),
  );
  const cappedPayout = Math.min(Math.floor(payout), policy.remainingCap);
  policy.remainingCap -= cappedPayout;
  return { payout: cappedPayout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "quote") {
        const isFollowUp = index > 0;
        policies.set(index, createPolicy(step.items));
        return {
          premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUp),
        };
      }
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`No policy created at step ${step.policy}`);
      }
      return processClaim(policy, step.incident.damages);
    }),
  };
};
