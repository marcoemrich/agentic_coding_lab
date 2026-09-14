export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
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
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

function basePremiumOf(item: Item): number {
  const premium = BASE_PREMIUMS[item.type];
  if (premium === undefined) {
    throw new Error(`unknown item type: ${item.type}`);
  }
  return premium;
}

function itemSurcharges(item: Item, basePremium: number): number {
  let surcharges = 0;
  if (item.cursed) {
    surcharges += basePremium * CURSE_SURCHARGE;
  }
  if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_LEVEL) {
    surcharges += basePremium * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharges;
}

/** Components are priced per group: exactly three alike ones form a discounted block. */
function componentBasePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  let base = 0;
  for (const [type, count] of counts) {
    base += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * BASE_PREMIUMS[type];
  }
  return base;
}

function policyWideModifiers(
  policyBase: number,
  customer: Customer,
  contractIndex: number,
): number {
  let modifiers = policyBase * FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    modifiers -= policyBase * LOYALTY_DISCOUNT;
  }
  if (contractIndex > 0) {
    modifiers -= policyBase * FOLLOW_UP_DISCOUNT;
  }
  return modifiers;
}

export function quote(
  items: Item[],
  customer: Customer = { yearsWithMHPCO: 0 },
  contractIndex = 0,
): number {
  const components: Item[] = [];
  const mainItems: Item[] = [];
  for (const item of items) {
    basePremiumOf(item);
    (COMPONENT_TYPES.includes(item.type) ? components : mainItems).push(item);
  }

  let policyBase = componentBasePremium(components);
  let premium = policyBase;
  for (const item of mainItems) {
    const basePremium = basePremiumOf(item);
    policyBase += basePremium;
    premium += basePremium + itemSurcharges(item, basePremium);
  }

  premium += policyWideModifiers(policyBase, customer, contractIndex);
  return Math.ceil(premium + PROCESSING_FEE);
}
