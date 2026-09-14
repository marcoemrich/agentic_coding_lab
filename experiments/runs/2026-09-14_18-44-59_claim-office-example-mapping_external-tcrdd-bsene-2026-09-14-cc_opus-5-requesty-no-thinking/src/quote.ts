export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const BASE_PREMIUM: Record<string, number> = {
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
const HIGH_ENCHANTMENT = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

function basePremiumOf(item: Item): number {
  const premium = BASE_PREMIUM[item.type];
  if (premium === undefined) {
    throw new Error(`unknown item type: ${item.type}`);
  }
  return premium;
}

/** Surcharges that attach to a single item rather than to the policy. */
function itemSurcharges(item: Item): number {
  const itemBase = basePremiumOf(item);
  let surcharges = 0;
  if (item.cursed === true) {
    surcharges += itemBase * CURSE_SURCHARGE;
  }
  if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT) {
    surcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharges;
}

/** Savings from every building block of exactly 3 alike components. */
function blockSavings(items: Item[]): number {
  return COMPONENT_TYPES.reduce((savings, componentType) => {
    const count = items.filter((item) => item.type === componentType).length;
    if (count !== BLOCK_SIZE) {
      return savings;
    }
    return savings + count * BASE_PREMIUM[componentType] - BLOCK_PREMIUM;
  }, 0);
}

/** Modifiers that apply to the policy base premium as a whole. */
function policyModifiers(base: number, customer: Customer, previousContracts: number): number {
  let modifiers = base * FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    modifiers -= base * LOYALTY_DISCOUNT;
  }
  if (previousContracts > 0) {
    modifiers -= base * FOLLOW_UP_DISCOUNT;
  }
  return modifiers;
}

export function quote(
  items: Item[],
  customer: Customer = { yearsWithMHPCO: 0 },
  previousContracts = 0,
): number {
  const base = items.reduce((sum, item) => sum + basePremiumOf(item), 0) - blockSavings(items);
  const surcharges = items.reduce((sum, item) => sum + itemSurcharges(item), 0);
  const total =
    base + surcharges + policyModifiers(base, customer, previousContracts) + PROCESSING_FEE;
  // The MHPCO rounds premiums in its own favour.
  return Math.ceil(total);
}
