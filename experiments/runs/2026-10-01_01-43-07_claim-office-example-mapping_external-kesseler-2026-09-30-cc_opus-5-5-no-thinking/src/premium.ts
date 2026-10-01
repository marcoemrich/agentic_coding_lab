export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const PERCENT = 100;
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 10;
const LOYALTY_DISCOUNT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 15;
const CURSE_SURCHARGE = 50;
const HIGH_ENCHANTMENT_SURCHARGE = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;

const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = ['rune', 'moonstone'];
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function percentOf(amount: number, percent: number): number {
  return (amount * percent) / PERCENT;
}

function isMainItem(item: Item): boolean {
  return item.type in MAIN_ITEM_BASE_PREMIUMS;
}

function assertKnownType(item: Item): void {
  if (!isMainItem(item) && !COMPONENT_TYPES.includes(item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
}

function componentGroupBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

function itemBasePremium(item: Item, items: Item[]): number {
  if (isMainItem(item)) {
    return MAIN_ITEM_BASE_PREMIUMS[item.type];
  }
  const alikeCount = items.filter((other) => other.type === item.type).length;
  return componentGroupBasePremium(alikeCount) / alikeCount;
}

function itemModifierPercent(item: Item): number {
  const curse = item.cursed ? CURSE_SURCHARGE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_SURCHARGE : 0;
  return curse + enchantment;
}

function policyModifierPercent(customer: Customer, isFollowUp: boolean): number {
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS ? -LOYALTY_DISCOUNT : 0;
  const followUp = isFollowUp ? -FOLLOW_UP_DISCOUNT : 0;
  return FIRST_INSURANCE_SURCHARGE + loyalty + followUp;
}

export function premiumFor(items: Item[], customer: Customer, isFollowUp: boolean): number {
  items.forEach(assertKnownType);
  const basePremiums = items.map((item) => itemBasePremium(item, items));
  const policyBase = sum(basePremiums);
  const itemSurcharges = sum(items.map((item, index) => percentOf(basePremiums[index], itemModifierPercent(item))));
  const policyModifier = percentOf(policyBase, policyModifierPercent(customer, isFollowUp));
  return Math.ceil(policyBase + itemSurcharges + policyModifier + PROCESSING_FEE);
}
