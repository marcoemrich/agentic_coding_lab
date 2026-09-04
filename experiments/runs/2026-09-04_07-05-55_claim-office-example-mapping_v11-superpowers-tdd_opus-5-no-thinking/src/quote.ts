export interface Customer {
  yearsWithMHPCO: number;
  previousContracts: number;
}

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
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = ['rune', 'moonstone'];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_DISCOUNT = 0.15;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const PROCESSING_FEE = 5;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

function policyBasePremium(items: Item[]): number {
  const componentCounts = countByType(items.filter((i) => COMPONENT_TYPES.includes(i.type)));

  let total = items
    .filter((i) => !COMPONENT_TYPES.includes(i.type))
    .reduce((sum, item) => sum + BASE_PREMIUMS[item.type], 0);

  for (const [type, count] of componentCounts) {
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * BASE_PREMIUMS[type];
  }
  return total;
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => {
    const itemBase = BASE_PREMIUMS[item.type];
    let surcharge = 0;
    if (item.cursed) surcharge += itemBase * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
      surcharge += itemBase * HIGH_ENCHANTMENT_SURCHARGE;
    }
    return sum + surcharge;
  }, 0);
}

function policyModifierRate(customer: Customer): number {
  let rate = FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) rate -= LOYALTY_DISCOUNT;
  if (customer.previousContracts > 0) rate -= FOLLOW_UP_DISCOUNT;
  return rate;
}

function assertKnownTypes(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

export function quote(customer: Customer, items: Item[]): number {
  assertKnownTypes(items);
  const base = policyBasePremium(items);
  const total =
    base + itemSurcharges(items) + base * policyModifierRate(customer) + PROCESSING_FEE;
  return Math.ceil(total);
}
