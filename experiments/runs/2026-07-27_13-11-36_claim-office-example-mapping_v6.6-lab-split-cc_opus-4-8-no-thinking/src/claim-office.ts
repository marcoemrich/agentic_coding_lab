export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const PERCENT_WHOLE = 100;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / PERCENT_WHOLE;

const sumBy = <T>(values: T[], valueOf: (value: T) => number): number =>
  values.reduce((sum, value) => sum + valueOf(value), 0);

const basePremium = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const componentGroupPremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;

const firstInsuranceSurcharge = (base: number): number =>
  percentOf(base, FIRST_INSURANCE_SURCHARGE_PERCENT);

const roundPremiumInMhpcoFavor = (premium: number): number =>
  Math.ceil(premium);

const roundPayoutInMhpcoFavor = (payout: number): number =>
  Math.floor(payout);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const isMainItem = (item: Item): boolean => !isComponent(item);

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const componentsTotalByType = (components: Item[]): number =>
  sumBy([...countByType(components).values()], componentGroupPremium);

const itemsBasePremium = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const mainItems = items.filter(isMainItem);
  return sumBy(mainItems, basePremium) + componentsTotalByType(components);
};

const itemSurcharge = (item: Item): number => {
  const base = basePremium(item);
  const curse = item.cursed ? percentOf(base, CURSE_SURCHARGE_PERCENT) : 0;
  const highEnchantment =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? percentOf(base, HIGH_ENCHANTMENT_SURCHARGE_PERCENT)
      : 0;
  return curse + highEnchantment;
};

const itemSurcharges = (items: Item[]): number => sumBy(items, itemSurcharge);

const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

const loyaltyDiscount = (customer: Customer, base: number): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
    ? percentOf(base, LOYALTY_DISCOUNT_PERCENT)
    : 0;

const followUpContractDiscount = (contractIndex: number, base: number): number =>
  contractIndex > 0 ? percentOf(base, FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT) : 0;

const policyModifiers = (
  customer: Customer,
  contractIndex: number,
  base: number,
): number =>
  firstInsuranceSurcharge(base) -
  loyaltyDiscount(customer, base) -
  followUpContractDiscount(contractIndex, base);

const isKnownItemType = (item: Item): boolean => item.type in BASE_PREMIUMS;

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

export const quote = (
  customer: Customer,
  items: Item[],
  contractIndex: number,
): number => {
  validateItemTypes(items);
  const base = itemsBasePremium(items);
  const total =
    base +
    policyModifiers(customer, contractIndex, base) +
    itemSurcharges(items) +
    PROCESSING_FEE;
  return roundPremiumInMhpcoFavor(total);
};

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const insuranceValue = (item: Item): number => INSURANCE_VALUES[item.type] ?? 0;

const insuranceSum = (items: Item[]): number => sumBy(items, insuranceValue);

const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

const reimbursedAmount = (item: Item, amount: number): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD
    ? percentOf(amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT)
    : amount;

const damagePayout = (damage: Damage, item: Item): number =>
  Math.max(0, reimbursedAmount(item, damage.amount) - DEDUCTIBLE);

const insuredItemFor = (items: Item[], damage: Damage): Item =>
  items.find((item) => item.type === damage.itemType) as Item;

const totalDamagePayout = (items: Item[], damages: Damage[]): number =>
  sumBy(damages, (damage) =>
    damagePayout(damage, insuredItemFor(items, damage)),
  );

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

const validateDamageCounts = (items: Item[], damages: Damage[]): void => {
  const insuredCounts = countByType(items);
  const damageCounts = new Map<string, number>();
  for (const damage of damages) {
    const next = (damageCounts.get(damage.itemType) ?? 0) + 1;
    if (next > (insuredCounts.get(damage.itemType) ?? 0)) {
      throw new Error(
        `More ${damage.itemType} damages than insured items in the policy`,
      );
    }
    damageCounts.set(damage.itemType, next);
  }
};

const validateIncident = (items: Item[], incident: Incident): void => {
  validateDamageAmounts(incident.damages);
  validateDamageCounts(items, incident.damages);
};

export const claim = (
  items: Item[],
  incident: Incident,
  priorPayouts: number,
): ClaimResult => {
  validateIncident(items, incident);
  const cap = insuranceSum(items) * CAP_MULTIPLIER;
  const remainingBefore = cap - priorPayouts;
  const rawPayout = totalDamagePayout(items, incident.damages);
  const payout = Math.min(roundPayoutInMhpcoFavor(rawPayout), remainingBefore);
  return { payout, remainingCap: remainingBefore - payout };
};
