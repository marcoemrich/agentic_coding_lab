const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };

const basePremiumFor = (item: Item): number => {
  if (!(item.type in BASE_PREMIUM_BY_TYPE)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return BASE_PREMIUM_BY_TYPE[item.type];
};

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const surchargeRate = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

const mainItemPremium = (item: Item): number => {
  const base = basePremiumFor(item);
  return base + base * surchargeRate(item);
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.includes(item.type);

const componentGroupPremium = (group: Item[]): number =>
  group.length === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : group.reduce((sum, item) => sum + basePremiumFor(item), 0);

const groupComponentsByType = (items: Item[]): Item[][] => {
  const groups: Record<string, Item[]> = {};
  for (const item of items) {
    (groups[item.type] ||= []).push(item);
  }
  return Object.values(groups);
};

type Customer = { yearsWithMHPCO: number; previousQuotes?: number };

const loyaltyDiscountRate = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscountRate = (customer: Customer): number =>
  (customer.previousQuotes ?? 0) >= 1 ? FOLLOW_UP_DISCOUNT_RATE : 0;

const sumItemsPremium = (items: Item[], mainPremium: (item: Item) => number): number => {
  const components = items.filter(isComponent);
  const mainItems = items.filter((item) => !isComponent(item));
  const mainTotal = mainItems.reduce((sum, item) => sum + mainPremium(item), 0);
  const componentTotal = groupComponentsByType(components).reduce(
    (sum, group) => sum + componentGroupPremium(group),
    0,
  );
  return mainTotal + componentTotal;
};

export function quote(customer: Customer, items: Item[]): number {
  const itemsTotal = sumItemsPremium(items, mainItemPremium);
  const policyBase = sumItemsPremium(items, basePremiumFor);
  const loyaltyDiscount = policyBase * loyaltyDiscountRate(customer);
  const followUpDiscount = policyBase * followUpDiscountRate(customer);
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const total = itemsTotal - loyaltyDiscount - followUpDiscount + firstInsuranceSurcharge + PROCESSING_FEE;
  return Math.ceil(total);
}

type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };

const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

export function claim(items: Item[], incident: Incident): number {
  const damageCounts: Record<string, number> = {};
  for (const damage of incident.damages) {
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  const policyCounts: Record<string, number> = {};
  for (const item of items) {
    policyCounts[item.type] = (policyCounts[item.type] ?? 0) + 1;
  }
  for (const type in damageCounts) {
    if (damageCounts[type] > (policyCounts[type] ?? 0)) {
      throw new Error(`More damages for ${type} than policy covers`);
    }
  }
  const total = incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
    const item = items.find((i) => i.type === damage.itemType);
    if (!item) {
      throw new Error(`Item type not in policy: ${damage.itemType}`);
    }
    const rate =
      (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
        ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
        : 1;
    return sum + (damage.amount * rate - DEDUCTIBLE_PER_DAMAGE);
  }, 0);
  return Math.floor(total);
}
