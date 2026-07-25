export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: "quote";
  items: unknown[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: unknown;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

export interface ItemInput {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const BASE_PREMIUM_PER_ITEM = 25;
const BLOCK_OF_THREE_PREMIUM = 60;

const countByItemType = (items: { type?: string; itemType?: string }[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const type = (item.itemType ?? item.type) as string;
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

export const calculateItemsBasePremium = (items: ItemInput[]): number => {
  const countsByType = countByItemType(items);

  return Array.from(countsByType.values()).reduce(
    (total, count) =>
      total +
      (count === 3 ? BLOCK_OF_THREE_PREMIUM : count * BASE_PREMIUM_PER_ITEM),
    0,
  );
};

interface MainItemConfig {
  basePremium: number;
  insuranceValue: number;
}

const MAIN_ITEM_CONFIG: Record<string, MainItemConfig> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
};

const COMPONENT_INSURANCE_VALUE = 250;

const DEFAULT_MAIN_ITEM_CONFIG: MainItemConfig = {
  basePremium: 0,
  insuranceValue: COMPONENT_INSURANCE_VALUE,
};

const getMainItemConfig = (type: string): MainItemConfig =>
  MAIN_ITEM_CONFIG[type] ?? DEFAULT_MAIN_ITEM_CONFIG;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const calculateItemPremiumWithSurcharges = (item: ItemInput): number => {
  if (!isMainItemType(item.type)) {
    return 0;
  }
  const itemBase = getMainItemConfig(item.type).basePremium;
  const curseSurcharge = item.cursed ? itemBase * CURSE_SURCHARGE_RATE : 0;
  const highEnchantmentSurcharge =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return itemBase + curseSurcharge + highEnchantmentSurcharge;
};

const isMainItemType = (type: string): boolean => type in MAIN_ITEM_CONFIG;

const KNOWN_COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const ALL_KNOWN_ITEM_TYPES = new Set([
  ...Object.keys(MAIN_ITEM_CONFIG),
  ...KNOWN_COMPONENT_TYPES,
]);

const isKnownItemType = (type: string): boolean =>
  ALL_KNOWN_ITEM_TYPES.has(type);

const validateItemTypes = (items: ItemInput[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: '${item.type}'`);
    }
  }
};

interface ItemPartition {
  mainItems: ItemInput[];
  componentItems: ItemInput[];
}

const partitionItemsByType = (items: ItemInput[]): ItemPartition => {
  const mainItems = items.filter((item) => isMainItemType(item.type));
  const componentItems = items.filter((item) => !isMainItemType(item.type));
  return { mainItems, componentItems };
};

const calculateRawPolicyBase = (items: ItemInput[]): number => {
  const { mainItems, componentItems } = partitionItemsByType(items);
  const mainItemsBase = mainItems.reduce(
    (total, item) => total + getMainItemConfig(item.type).basePremium,
    0,
  );
  return mainItemsBase + calculateItemsBasePremium(componentItems);
};

export const calculatePolicyBasePremiumWithItemModifiers = (
  items: ItemInput[],
): number => {
  const { mainItems, componentItems } = partitionItemsByType(items);
  const mainItemsPremium = mainItems.reduce(
    (total, item) => total + calculateItemPremiumWithSurcharges(item),
    0,
  );
  return mainItemsPremium + calculateItemsBasePremium(componentItems);
};

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;

const roundInMhpcoFavorForPremium = (amount: number): number =>
  Math.ceil(amount);

const roundInMhpcoFavorForPayout = (amount: number): number =>
  Math.floor(amount);

const calculateQuotePremium = (
  customer: Customer,
  items: ItemInput[],
  isFollowUpContract: boolean,
): number => {
  validateItemTypes(items);
  const rawPolicyBase = calculateRawPolicyBase(items);
  const policyBaseWithItemSurcharges =
    calculatePolicyBasePremiumWithItemModifiers(items);
  const firstInsuranceSurcharge = rawPolicyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const isLongStanding = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
  const loyaltyDiscount = isLongStanding
    ? rawPolicyBase * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpContractDiscount = isFollowUpContract
    ? rawPolicyBase * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;
  const total =
    policyBaseWithItemSurcharges +
    firstInsuranceSurcharge -
    loyaltyDiscount -
    followUpContractDiscount +
    PROCESSING_FEE;
  return roundInMhpcoFavorForPremium(total);
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const DAMAGE_HIGH_ENCHANTMENT_THRESHOLD = 8;
const DAMAGE_HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const calculateReimbursementRate = (item: ItemInput | undefined): number => {
  if ((item?.enchantment ?? 0) >= DAMAGE_HIGH_ENCHANTMENT_THRESHOLD) {
    return DAMAGE_HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return FULL_REIMBURSEMENT_RATE;
};

const calculateDamagePayout = (
  damage: Damage,
  policyItems: ItemInput[],
): number => {
  const item = policyItems.find(
    (policyItem) => policyItem.type === damage.itemType,
  );
  const reimbursementRate = calculateReimbursementRate(item);
  const reimbursed = damage.amount * reimbursementRate;
  return Math.max(0, reimbursed - DEDUCTIBLE_PER_DAMAGE);
};

const calculateClaimPayout = (
  damages: Damage[],
  policyItems: ItemInput[],
): number => {
  validateClaimDamages(damages, policyItems);
  const total = damages.reduce(
    (sum, damage) => sum + calculateDamagePayout(damage, policyItems),
    0,
  );
  return roundInMhpcoFavorForPayout(total);
};

const validateNoNegativeDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

const validateDamageCountsAgainstPolicy = (
  damages: Damage[],
  policyItems: ItemInput[],
): void => {
  const damageCounts = countByItemType(damages);
  const policyCounts = countByItemType(policyItems);
  for (const [type, count] of damageCounts) {
    if (count > (policyCounts.get(type) ?? 0)) {
      throw new Error(
        `Claim references more '${type}' damages (${count}) than insured (${
          policyCounts.get(type) ?? 0
        })`,
      );
    }
  }
};

const validateClaimDamages = (
  damages: Damage[],
  policyItems: ItemInput[],
): void => {
  validateNoNegativeDamageAmounts(damages);
  validateDamageCountsAgainstPolicy(damages, policyItems);
};

const getItemInsuranceValue = (item: ItemInput): number =>
  getMainItemConfig(item.type).insuranceValue;

const calculateInsuranceSum = (items: ItemInput[]): number =>
  items.reduce((total, item) => total + getItemInsuranceValue(item), 0);

const PAYOUT_CAP_MULTIPLIER = 2;

interface PolicyState {
  items: ItemInput[];
  remainingCap: number;
}

const DEFAULT_POLICY_STATE: PolicyState = { items: [], remainingCap: 0 };

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policyStateByIndex = new Map<number, PolicyState>();
  let hasPriorQuote = false;
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const items = step.items as ItemInput[];
      const isFollowUpContract = hasPriorQuote;
      hasPriorQuote = true;
      const remainingCap = calculateInsuranceSum(items) * PAYOUT_CAP_MULTIPLIER;
      policyStateByIndex.set(index, { items, remainingCap });
      const premium = calculateQuotePremium(
        scenario.customer,
        items,
        isFollowUpContract,
      );
      return { premium };
    }
    const policyState =
      policyStateByIndex.get(step.policy) ?? DEFAULT_POLICY_STATE;
    const damages = (step.incident as { damages: Damage[] }).damages;
    const desiredPayout = calculateClaimPayout(damages, policyState.items);
    const payout = Math.min(desiredPayout, policyState.remainingCap);
    const remainingCap = policyState.remainingCap - payout;
    policyStateByIndex.set(step.policy, { ...policyState, remainingCap });
    return { payout, remainingCap };
  });
  return { results };
};
