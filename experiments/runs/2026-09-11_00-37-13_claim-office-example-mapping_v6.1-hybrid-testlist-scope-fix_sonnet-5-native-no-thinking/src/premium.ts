export interface Customer {
  yearsWithMHPCO: number;
}

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isMainItem = (item: Item): boolean => item.type in BASE_PREMIUMS;

const validateItemType = (item: Item): void => {
  if (!isMainItem(item) && !COMPONENT_TYPES.has(item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
};

const componentsBasePremium = (components: Item[]): number => {
  const countsByType = new Map<string, number>();
  for (const component of components) {
    countsByType.set(component.type, (countsByType.get(component.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of countsByType.values()) {
    total +=
      count === COMPONENT_BLOCK_SIZE
        ? COMPONENT_BLOCK_PREMIUM
        : count * COMPONENT_BASE_PREMIUM;
  }
  return total;
};

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const itemBasePremium = (item: Item): number =>
  BASE_PREMIUMS[item.type] ?? COMPONENT_BASE_PREMIUM;

const itemModifiersSurcharge = (item: Item, base: number): number => {
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSED_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
};

const calculateBasePremium = (items: Item[]): number => {
  const mainItems = items.filter(isMainItem);
  const components = items.filter((item) => !isMainItem(item));
  const mainItemsPremium = mainItems.reduce(
    (sum, item) => sum + itemBasePremium(item),
    0,
  );
  return mainItemsPremium + componentsBasePremium(components);
};

const calculateItemModifiersSurcharge = (items: Item[]): number =>
  items.reduce(
    (sum, item) => sum + itemModifiersSurcharge(item, itemBasePremium(item)),
    0,
  );

export const calculatePremium = (
  customer: Customer,
  items: Item[],
  isFirstContract: boolean,
): number => {
  items.forEach(validateItemType);
  const basePremium = calculateBasePremium(items);
  const itemModifiers = calculateItemModifiersSurcharge(items);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
      ? basePremium * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpContractDiscount = isFirstContract
    ? 0
    : basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  return Math.ceil(
    basePremium +
      itemModifiers +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpContractDiscount +
      PROCESSING_FEE,
  );
};
