export interface CustomerInput {
  yearsWithMHPCO: number;
}

export interface ItemInput {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_MIN_LEVEL = 5;
const CURSE_SURCHARGE_RATE = 0.5;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const basePremiumFor = (item: ItemInput): number => {
  const premium = BASE_PREMIUM_BY_TYPE[item.type];
  if (premium === undefined) {
    throw new Error(`Unknown item type: '${item.type}'`);
  }
  return premium;
};

// Guards against floating-point drift (e.g. 92.99999999997) before
// rounding up, so premiums never round to the wrong whole gold amount.
export const roundUpToWholeGold = (amount: number): number =>
  Math.ceil(Number(amount.toFixed(6)));

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

// A block of exactly COMPONENT_BLOCK_SIZE alike components earns a flat
// block premium instead of paying the base premium per component.
const premiumForAlikeComponentGroup = (countOfType: number): number =>
  countOfType === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : countOfType * COMPONENT_BASE_PREMIUM;

const countComponentsByType = (
  components: ItemInput[]
): Map<string, number> => {
  const countsByType = new Map<string, number>();
  for (const component of components) {
    countsByType.set(
      component.type,
      (countsByType.get(component.type) ?? 0) + 1
    );
  }
  return countsByType;
};

export const calculateComponentsBasePremium = (
  components: ItemInput[]
): number => {
  let total = 0;
  for (const count of countComponentsByType(components).values()) {
    total += premiumForAlikeComponentGroup(count);
  }
  return total;
};

export interface PolicyOptions {
  isFollowUpContract?: boolean;
}

const policyModifierRateFor = (
  customer: CustomerInput,
  options: PolicyOptions
): number => {
  const loyaltyDiscountRate =
    customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS ? -LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscountRate = options.isFollowUpContract
    ? -FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;
  return (
    FIRST_INSURANCE_SURCHARGE_RATE + loyaltyDiscountRate + followUpDiscountRate
  );
};

const itemModifierRateFor = (item: ItemInput): number => {
  const enchantmentSurchargeRate =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_MIN_LEVEL
      ? HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  const curseSurchargeRate = item.cursed ? CURSE_SURCHARGE_RATE : 0;
  return enchantmentSurchargeRate + curseSurchargeRate;
};

// Computes each item's base premium once and folds it into both the
// policy base premium and the item-modifier total in a single pass,
// avoiding calling basePremiumFor(item) twice per item.
const summarizeItems = (
  items: ItemInput[]
): { policyBasePremium: number; itemModifiersTotal: number } =>
  items.reduce(
    (totals, item) => {
      const itemBasePremium = basePremiumFor(item);
      return {
        policyBasePremium: totals.policyBasePremium + itemBasePremium,
        itemModifiersTotal:
          totals.itemModifiersTotal +
          itemBasePremium * itemModifierRateFor(item),
      };
    },
    { policyBasePremium: 0, itemModifiersTotal: 0 }
  );

export const calculatePremium = (
  customer: CustomerInput,
  items: ItemInput[],
  options: PolicyOptions = {}
): number => {
  if (items.length === 0) {
    return PROCESSING_FEE;
  }
  const { policyBasePremium, itemModifiersTotal } = summarizeItems(items);
  const policyModifierAmount =
    policyBasePremium * policyModifierRateFor(customer, options);
  const premiumBeforeRounding =
    policyBasePremium + itemModifiersTotal + policyModifierAmount + PROCESSING_FEE;
  return roundUpToWholeGold(premiumBeforeRounding);
};
