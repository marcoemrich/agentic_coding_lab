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

export interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

export const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function basePremiumOf(item: Item): number {
  return PRICE_LIST[item.type].basePremium;
}

export function assertKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (PRICE_LIST[item.type] === undefined) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
}

function listPremium(items: Item[]): number {
  return items.reduce((total, item) => total + basePremiumOf(item), 0);
}

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function itemSurcharge(item: Item): number {
  const basePremium = basePremiumOf(item);
  const cursedSurcharge = item.cursed ? basePremium * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = isHighlyEnchanted(item)
    ? basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return cursedSurcharge + enchantmentSurcharge;
}

export function itemModifierPremium(items: Item[]): number {
  return items.reduce((total, item) => total + itemSurcharge(item), 0);
}

function groupByType(components: Item[]): Item[][] {
  const groups = new Map<string, Item[]>();
  for (const component of components) {
    const group = groups.get(component.type) ?? [];
    group.push(component);
    groups.set(component.type, group);
  }
  return [...groups.values()];
}

function blockOrListPremium(group: Item[]): number {
  return group.length === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : listPremium(group);
}

function componentPremium(components: Item[]): number {
  return groupByType(components).reduce(
    (total, group) => total + blockOrListPremium(group),
    0,
  );
}

export function policyBasePremium(items: Item[]): number {
  const components = items.filter((item) => COMPONENT_TYPES.has(item.type));
  const mainItems = items.filter((item) => !COMPONENT_TYPES.has(item.type));

  return listPremium(mainItems) + componentPremium(components);
}

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS;
}

function firstInsuranceSurcharge(basePremium: number): number {
  return basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
}

function followUpDiscount(
  basePremium: number,
  isFirstContract: boolean,
): number {
  return isFirstContract ? 0 : basePremium * FOLLOW_UP_DISCOUNT_RATE;
}

function policyContractModifier(
  basePremium: number,
  isFirstContract: boolean,
): number {
  return (
    firstInsuranceSurcharge(basePremium) -
    followUpDiscount(basePremium, isFirstContract)
  );
}

function policyModifierPremium(
  items: Item[],
  customer: Customer,
  isFirstContract: boolean,
): number {
  const basePremium = policyBasePremium(items);
  const loyalty = isLongStandingCustomer(customer)
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  return policyContractModifier(basePremium, isFirstContract) - loyalty;
}

export function quotePremium(
  items: Item[],
  customer: Customer,
  isFirstContract: boolean,
): number {
  const total =
    policyBasePremium(items) +
    itemModifierPremium(items) +
    policyModifierPremium(items, customer, isFirstContract) +
    PROCESSING_FEE;
  return Math.ceil(total);
}
