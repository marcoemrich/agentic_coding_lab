export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

const ITEM_BASE_VALUE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export const isKnownItemType = (type: string): boolean =>
  type in ITEM_BASE_VALUE;

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_PREMIUM = 60;
const BLOCK_SIZE = 3;
const INSURANCE_VALUE_MULTIPLIER = 10;

const isComponent = (type: string): boolean =>
  COMPONENT_TYPES.includes(type);

const componentGroupPremium = (count: number, unitValue: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * unitValue;

export const policyBasePremium = (
  items: readonly Item[]
): number => {
  const componentCounts: Record<string, number> = {};
  let total = 0;
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += ITEM_BASE_VALUE[item.type];
    }
  }
  for (const [type, count] of Object.entries(componentCounts)) {
    total += componentGroupPremium(count, ITEM_BASE_VALUE[type]);
  }
  return total;
};

export const insuranceSum = (items: readonly Item[]): number =>
  items.reduce(
    (total, item) =>
      total + ITEM_BASE_VALUE[item.type] * INSURANCE_VALUE_MULTIPLIER,
    0
  );

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

// Apply a rate to a base amount only when the condition holds; otherwise 0.
const conditionalAmount = (
  base: number,
  rate: number,
  condition: boolean
): number => (condition ? base * rate : 0);

const itemSurcharge = (item: Item): number => {
  const baseValue = ITEM_BASE_VALUE[item.type];
  return (
    conditionalAmount(baseValue, CURSE_SURCHARGE_RATE, item.cursed === true) +
    conditionalAmount(
      baseValue,
      HIGH_ENCHANTMENT_RATE,
      (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    )
  );
};

export const quotePremium = (
  items: readonly Item[],
  customer: { yearsWithMHPCO: number },
  isFollowUp: boolean
): number => {
  const base = policyBasePremium(items);
  const surcharge = items.reduce(
    (total, item) => total + itemSurcharge(item),
    0
  );
  const firstInsurance = base * FIRST_INSURANCE_RATE;
  const loyalty = conditionalAmount(
    base,
    LOYALTY_DISCOUNT_RATE,
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
  );
  const followUp = conditionalAmount(base, FOLLOW_UP_DISCOUNT_RATE, isFollowUp);
  return Math.ceil(
    base + surcharge + firstInsurance - loyalty - followUp + PROCESSING_FEE
  );
};
