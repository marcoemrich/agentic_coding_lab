export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteInput {
  customer: Customer;
  items: Item[];
  contractIndex: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PCT = 10;
const CURSED_SURCHARGE_PCT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PCT = 30;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_PCT = 20;
const MULTI_CONTRACT_DISCOUNT_PCT = 15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BUNDLE_SIZE = 3;
const COMPONENT_BUNDLE_PREMIUM = 60;

const basePremiumFor = (type: string): number => BASE_PREMIUMS[type] ?? 0;

const isComponent = (type: string): boolean => COMPONENT_TYPES.has(type);

const premiumForComponentGroup = (type: string, count: number): number => {
  const bundles = Math.floor(count / COMPONENT_BUNDLE_SIZE);
  const singles = count % COMPONENT_BUNDLE_SIZE;
  return bundles * COMPONENT_BUNDLE_PREMIUM + singles * basePremiumFor(type);
};

const itemRiskMultiplier = (item: Item): number => {
  let pct = 0;
  if (item.cursed) pct += CURSED_SURCHARGE_PCT;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) pct += HIGH_ENCHANTMENT_SURCHARGE_PCT;
  return (100 + pct) / 100;
};

const sumItemPremiums = (items: Item[]): number => {
  const componentBuckets: Record<string, Item[]> = {};
  let mainTotal = 0;
  for (const item of items) {
    if (isComponent(item.type)) {
      (componentBuckets[item.type] ??= []).push(item);
    } else {
      mainTotal += basePremiumFor(item.type) * itemRiskMultiplier(item);
    }
  }
  let componentTotal = 0;
  for (const [type, group] of Object.entries(componentBuckets)) {
    // Bundle pricing is on the group, individual surcharges apply per item.
    // For simplicity: compute baseline group price, then add per-item surcharge deltas.
    const groupBase = premiumForComponentGroup(type, group.length);
    const perItemBase = basePremiumFor(type);
    const surchargeDelta = group.reduce(
      (sum, item) => sum + perItemBase * (itemRiskMultiplier(item) - 1),
      0,
    );
    componentTotal += groupBase + surchargeDelta;
  }
  return mainTotal + componentTotal;
};

const isFirstInsurance = (contractIndex: number): boolean => contractIndex === 0;

const applyPercent = (amount: number, pct: number): number => (amount * (100 + pct)) / 100;

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

export const quote = (input: QuoteInput): number => {
  let amount = sumItemPremiums(input.items);
  if (isFirstInsurance(input.contractIndex)) {
    amount = applyPercent(amount, FIRST_INSURANCE_SURCHARGE_PCT);
  }
  if (!isFirstInsurance(input.contractIndex)) {
    amount = applyPercent(amount, -MULTI_CONTRACT_DISCOUNT_PCT);
  }
  if (isLoyalCustomer(input.customer)) {
    amount = applyPercent(amount, -LOYALTY_DISCOUNT_PCT);
  }
  return Math.ceil(amount) + PROCESSING_FEE;
};
