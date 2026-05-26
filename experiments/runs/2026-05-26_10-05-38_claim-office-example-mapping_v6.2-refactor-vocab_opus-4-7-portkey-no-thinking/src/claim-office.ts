const PROCESSING_FEE = 5;
const BLOCK_PRICE = 60;
const BLOCK_SIZE = 3;

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

type Item = { type: string; cursed?: boolean; enchantment?: number };
type Step = { items: Item[] };
type Customer = {
  yearsWithMHPCO: number;
  isFirstInsurance?: boolean;
  isFollowUpContract?: boolean;
};
type Scenario = { customer: Customer; steps: Step[] };

const basePremiumFor = (type: string): number =>
  BASE_PREMIUM_BY_ITEM_TYPE[type] ?? 0;

const isBlockOfAlikeComponents = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE;

const priceForGroup = (type: string, count: number): number =>
  isBlockOfAlikeComponents(type, count)
    ? BLOCK_PRICE
    : count * basePremiumFor(type);

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const surchargeRate = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

const itemSurcharge = (item: Item): number =>
  basePremiumFor(item.type) * surchargeRate(item);

const policyBasePremium = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (total, [type, count]) => total + priceForGroup(type, count),
    0,
  );

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurcharge(item), 0);

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const isLongStandingCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD;

const loyaltyDiscount = (policyBase: number, customer: Customer): number =>
  isLongStandingCustomer(customer) ? policyBase * LOYALTY_DISCOUNT_RATE : 0;

const firstInsuranceSurcharge = (policyBase: number, customer: Customer): number =>
  customer.isFirstInsurance ? policyBase * FIRST_INSURANCE_SURCHARGE_RATE : 0;

const followUpDiscount = (policyBase: number, customer: Customer): number =>
  customer.isFollowUpContract ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;

const customerAdjustment = (policyBase: number, customer: Customer): number =>
  firstInsuranceSurcharge(policyBase, customer)
  - loyaltyDiscount(policyBase, customer)
  - followUpDiscount(policyBase, customer);

const quotePremiumFor = (step: Step, customer: Customer): number => {
  const policyBase = policyBasePremium(step.items);
  return policyBase
    + customerAdjustment(policyBase, customer)
    + sumItemSurcharges(step.items)
    + PROCESSING_FEE;
};

// MHPCO always rounds in its own favor: premiums (money in) go UP.
const roundPremiumInOfficesFavor = (amount: number): number => Math.ceil(amount);

export const processScenario = (input: unknown): unknown => {
  const { customer, steps } = input as Scenario;
  return {
    results: steps.map((step) => ({
      premium: roundPremiumInOfficesFavor(quotePremiumFor(step, customer)),
    })),
  };
};
