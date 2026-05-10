const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

type Item = { type: string; material: string; enchantment: number; cursed: boolean };

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const componentBlockBaseFor = (count: number, type: string): number =>
  count === BLOCK_SIZE
    ? BLOCK_PRICE
    : count * BASE_PREMIUM_BY_ITEM_TYPE[type];

const countBy = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> =>
  values.reduce((counts, value) => {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const componentsBaseFor = (items: Item[]): number => {
  const countsByType = countByType(items);
  return Array.from(countsByType).reduce(
    (total, [type, count]) => total + componentBlockBaseFor(count, type),
    0
  );
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const surchargesFor = (item: Item, base: number): number => {
  const curse = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const highEnchantment = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curse + highEnchantment;
};

const nonComponentBaseFor = (items: Item[]): number =>
  items.reduce((sum, item) => {
    const base = BASE_PREMIUM_BY_ITEM_TYPE[item.type];
    return sum + base + surchargesFor(item, base);
  }, 0);

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const loyaltyDiscountFor = (yearsWithMHPCO: number, policyBase: number): number =>
  yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? policyBase * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscountFor = (apply: boolean | undefined, policyBase: number): number =>
  apply ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;

const sumOfItemBases = (items: Item[]): number =>
  items.reduce((sum, item) => sum + BASE_PREMIUM_BY_ITEM_TYPE[item.type], 0);

const firstInsuranceSurchargeFor = (apply: boolean | undefined, items: Item[]): number =>
  apply ? sumOfItemBases(items) * FIRST_INSURANCE_SURCHARGE_RATE : 0;

const policyBaseFor = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const nonComponents = items.filter((item) => !isComponent(item));
  return nonComponentBaseFor(nonComponents) + componentsBaseFor(components);
};

type Damage = { itemType: string; amount: number };

const DEDUCTIBLE = 100;

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;

const reimbursableAmountFor = (damage: Damage, item: Item | undefined): number =>
  item && item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;

const rawPayoutFor = (items: Item[], damages: Damage[]): number =>
  damages.reduce((sum, damage) => {
    const item = items.find((i) => i.type === damage.itemType);
    return sum + reimbursableAmountFor(damage, item) - DEDUCTIBLE;
  }, 0);

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE_BY_ITEM_TYPE[item.type], 0);

const validateDamagesAgainstItems = (items: Item[], damages: Damage[]): void => {
  const itemCounts = countByType(items);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    if (count > (itemCounts.get(type) ?? 0)) {
      throw new Error(`More damages of type ${type} than insured items`);
    }
  }
};

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
};

export function claim(input: { items: Item[]; damages: Damage[]; remainingCap?: number }): { payout: number; remainingCap: number } {
  validateDamageAmounts(input.damages);
  validateDamagesAgainstItems(input.items, input.damages);
  const rawPayout = rawPayoutFor(input.items, input.damages);
  const availableCap = input.remainingCap ?? CAP_MULTIPLIER * insuranceSumFor(input.items);
  const payout = Math.floor(Math.min(rawPayout, availableCap));
  return { payout, remainingCap: availableCap - payout };
}

export function quote(input: {
  yearsWithMHPCO: number;
  items: Item[];
  applyFirstInsurance?: boolean;
  applyFollowUpDiscount?: boolean;
}): number {
  for (const item of input.items) {
    if (!(item.type in BASE_PREMIUM_BY_ITEM_TYPE)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const policyBase = policyBaseFor(input.items);
  const itemBasesSum = sumOfItemBases(input.items);
  return Math.ceil(
    policyBase
    + firstInsuranceSurchargeFor(input.applyFirstInsurance, input.items)
    - loyaltyDiscountFor(input.yearsWithMHPCO, itemBasesSum)
    - followUpDiscountFor(input.applyFollowUpDiscount, itemBasesSum)
    + PROCESSING_FEE
  );
}
