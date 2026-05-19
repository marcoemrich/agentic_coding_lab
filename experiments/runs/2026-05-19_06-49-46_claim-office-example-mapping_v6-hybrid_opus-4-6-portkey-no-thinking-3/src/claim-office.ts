const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const mainItemPremiums: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40 };
const componentTypes = new Set(["rune", "moonstone"]);

type Item = { type: string; cursed?: boolean; enchantment?: number };
type Customer = { yearsWithMHPCO: number; contractNumber: number };

const isComponent = (item: Item): boolean => componentTypes.has(item.type);

const componentBasePremium = (components: Item[]): number => {
  const counts: Record<string, number> = {};
  for (const item of components) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return Object.values(counts).reduce(
    (sum, count) => sum + (count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM),
    0,
  );
};

const mainItemBasePremium = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (mainItemPremiums[item.type] ?? 0), 0);

const surchargeFor = (items: Item[], predicate: (item: Item) => boolean, rate: number): number =>
  items
    .filter(predicate)
    .reduce((sum, item) => sum + (mainItemPremiums[item.type] ?? 0) * rate, 0);

export const quote = (items: Item[], customer: Customer) => {
  const components = items.filter(isComponent);
  const mainItems = items.filter((item) => !isComponent(item));

  const totalBasePremium = mainItemBasePremium(mainItems) + componentBasePremium(components);
  const curseSurcharge = surchargeFor(mainItems, (item) => !!item.cursed, CURSE_SURCHARGE_RATE);
  const enchantmentSurcharge = surchargeFor(
    mainItems,
    (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    ENCHANTMENT_SURCHARGE_RATE,
  );
  const itemSurcharges = curseSurcharge + enchantmentSurcharge;
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
    ? totalBasePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const followupDiscount = customer.contractNumber >= 2
    ? totalBasePremium * FOLLOWUP_DISCOUNT_RATE
    : 0;
  const firstInsuranceSurcharge = totalBasePremium * FIRST_INSURANCE_RATE;
  const premium = Math.ceil(
    totalBasePremium
    + itemSurcharges
    + firstInsuranceSurcharge
    - loyaltyDiscount
    - followupDiscount
    + PROCESSING_FEE,
  );
  return { premium };
};

type Policy = { premium: number; items: Item[]; insuranceSum: number; remainingCap: number };
type Damage = { itemType: string; amount: number };
type Incident = { damages: Damage[] };
type ClaimResult = { payout: number; remainingCap: number };

export const claim = (policy: Policy, incident: Incident): ClaimResult => {
  return { payout: 0, remainingCap: 0 };
};
