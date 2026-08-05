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
  results: ({ premium: number } | { payout: number; remainingCap: number })[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_PERCENT = 10;

const percentOf = (percent: number, amount: number): number => (amount * percent) / 100;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

interface ItemSpec {
  basePremium: number;
  insuranceValue: number;
}

const MAIN_ITEM_SPECS: Record<string, ItemSpec> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
};

const COMPONENT_SPEC: ItemSpec = { basePremium: 25, insuranceValue: 250 };

const itemSpec = (item: QuoteItem): ItemSpec =>
  COMPONENT_TYPES.has(item.type) ? COMPONENT_SPEC : MAIN_ITEM_SPECS[item.type];

const itemBasePremium = (item: QuoteItem): number => itemSpec(item).basePremium;

const itemInsuranceValue = (item: QuoteItem): number => itemSpec(item).insuranceValue;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

const hasEnchantmentAtLeast = (item: QuoteItem, level: number): boolean =>
  (item.enchantment ?? 0) >= level;

const componentBlockDiscount = (items: QuoteItem[]): number => {
  let discount = 0;
  for (const componentType of COMPONENT_TYPES) {
    const alikeCount = items.filter((item) => item.type === componentType).length;
    if (alikeCount === COMPONENT_BLOCK_SIZE) {
      discount += COMPONENT_BLOCK_SIZE * COMPONENT_SPEC.basePremium - COMPONENT_BLOCK_BASE_PREMIUM;
    }
  }
  return discount;
};

const surchargeFor = (
  items: QuoteItem[],
  percent: number,
  appliesTo: (item: QuoteItem) => boolean,
): number =>
  items
    .filter(appliesTo)
    .reduce((sum, item) => sum + percentOf(percent, itemBasePremium(item)), 0);

const CURSE_SURCHARGE_PERCENT = 50;

const curseSurcharge = (items: QuoteItem[]): number =>
  surchargeFor(items, CURSE_SURCHARGE_PERCENT, (item) => item.cursed === true);

const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

const highEnchantmentSurcharge = (items: QuoteItem[]): number =>
  surchargeFor(
    items,
    HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
    (item) => hasEnchantmentAtLeast(item, HIGH_ENCHANTMENT_LEVEL),
  );

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;

const loyaltyDiscount = (basePremium: number, yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? percentOf(LOYALTY_DISCOUNT_PERCENT, basePremium)
    : 0;

const firstInsuranceSurcharge = (basePremium: number): number =>
  percentOf(FIRST_INSURANCE_PERCENT, basePremium);

const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

const followUpContractDiscount = (basePremium: number, isFollowUpContract: boolean): number =>
  isFollowUpContract ? percentOf(FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT, basePremium) : 0;

const quotePremium = (
  items: QuoteItem[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number => {
  const basePremium =
    items.reduce((sum, item) => sum + itemBasePremium(item), 0) - componentBlockDiscount(items);
  const surcharges =
    curseSurcharge(items) + highEnchantmentSurcharge(items) + firstInsuranceSurcharge(basePremium);
  const discounts =
    loyaltyDiscount(basePremium, yearsWithMHPCO) +
    followUpContractDiscount(basePremium, isFollowUpContract);
  return Math.ceil(basePremium + surcharges - discounts) + PROCESSING_FEE;
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

const policyCap = (items: QuoteItem[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0) * CAP_MULTIPLIER;

interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

const damageReimbursement = (policy: Policy, damage: Damage): number => {
  const item = policy.items.find((candidate) => candidate.type === damage.itemType);
  if (item === undefined) {
    throw new Error(`Damaged item type '${damage.itemType}' is not covered by the policy`);
  }
  const reimbursableAmount = hasEnchantmentAtLeast(item, HIGH_ENCHANTMENT_CLAIM_LEVEL)
    ? percentOf(HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT, damage.amount)
    : damage.amount;
  return reimbursableAmount - DEDUCTIBLE;
};

const claimPayout = (policy: Policy, damages: Damage[]): number =>
  Math.floor(damages.reduce((sum, damage) => sum + damageReimbursement(policy, damage), 0));

const countDamagesOfType = (damages: Damage[], itemType: string): number =>
  damages.filter((damage) => damage.itemType === itemType).length;

const countCoveredItemsOfType = (policy: Policy, itemType: string): number =>
  policy.items.filter((item) => item.type === itemType).length;

const assertDamageCountsWithinCoverage = (policy: Policy, damages: Damage[]): void => {
  const damagedTypes = new Set(damages.map((damage) => damage.itemType));
  for (const itemType of damagedTypes) {
    const damagedCount = countDamagesOfType(damages, itemType);
    const coveredCount = countCoveredItemsOfType(policy, itemType);
    if (damagedCount > coveredCount) {
      throw new Error(
        `Claim reports ${damagedCount} damaged '${itemType}' item(s), but the policy covers only ${coveredCount}`,
      );
    }
  }
};

const assertNonNegativeAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative (got ${damage.amount})`);
    }
  }
};

const applyClaim = (
  policy: Policy,
  damages: Damage[],
): { payout: number; remainingCap: number } => {
  assertNonNegativeAmounts(damages);
  assertDamageCountsWithinCoverage(policy, damages);
  const payout = Math.min(claimPayout(policy, damages), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const results: ScenarioResult["results"] = [];
  const policies: Policy[] = [];
  let quoteCount = 0;
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const isFollowUpContract = quoteCount > 0;
      results.push({
        premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUpContract),
      });
      policies.push({ items: step.items, remainingCap: policyCap(step.items) });
      quoteCount++;
    } else {
      results.push(applyClaim(policies[step.policy], step.incident.damages));
    }
  }
  return { results };
};
