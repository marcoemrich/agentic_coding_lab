export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;

const MAIN_ITEMS: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};

const COMPONENT_TYPES = ['rune', 'moonstone'];
const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;

const total = (amounts: number[]): number => amounts.reduce((a, b) => a + b, 0);

export class UnknownItemTypeError extends Error {
  constructor(type: string) {
    super(`unknown item type: ${type}`);
  }
}

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

export function insuranceValueOf(item: Item): number {
  const main = MAIN_ITEMS[item.type];
  if (main !== undefined) return main.value;
  if (isComponent(item.type)) return COMPONENT_VALUE;
  throw new UnknownItemTypeError(item.type);
}

/**
 * Base premium per item, in the order the items were given. Components of the
 * same type form a block when there are exactly three; the block premium is
 * split evenly across its members so item-specific modifiers have a base.
 */
export function itemBasePremiums(items: Item[]): number[] {
  const premiums = new Array<number>(items.length);
  const componentIndices = new Map<string, number[]>();

  items.forEach((item, index) => {
    const main = MAIN_ITEMS[item.type];
    if (main !== undefined) {
      premiums[index] = main.premium;
    } else if (isComponent(item.type)) {
      const group = componentIndices.get(item.type) ?? [];
      group.push(index);
      componentIndices.set(item.type, group);
    } else {
      throw new UnknownItemTypeError(item.type);
    }
  });

  for (const indices of componentIndices.values()) {
    const isBlock = indices.length === BLOCK_SIZE;
    const each = isBlock ? BLOCK_PREMIUM / BLOCK_SIZE : COMPONENT_PREMIUM;
    for (const index of indices) premiums[index] = each;
  }

  return premiums;
}

/** Item-specific surcharges, each applied to the base premium of its own item. */
export function itemSurcharges(items: Item[], bases = itemBasePremiums(items)): number {
  return total(
    items.map((item, index) => {
      const base = bases[index];
      const curse = item.cursed === true ? base * CURSE_SURCHARGE : 0;
      const enchanted =
        (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
          ? base * HIGH_ENCHANTMENT_SURCHARGE
          : 0;
      return curse + enchanted;
    }),
  );
}

export function policyBasePremium(items: Item[]): number {
  return total(itemBasePremiums(items));
}

/**
 * Policy-wide modifiers, each applied to the policy base premium. Every item in
 * a quote counts as a first insurance regardless of customer history, so the
 * initial assessment surcharge is always charged.
 */
function policySurcharges(base: number, customer: Customer, previousQuotes: number): number {
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS ? -base * LOYALTY_DISCOUNT : 0;
  const firstInsurance = base * FIRST_INSURANCE_SURCHARGE;
  const followUp = previousQuotes > 0 ? -base * FOLLOW_UP_DISCOUNT : 0;
  return loyalty + firstInsurance + followUp;
}

/** Rounds up: whole G, in the MHPCO's favour. */
function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

export function quotePremium(
  items: Item[],
  customer: Customer,
  previousQuotes: number,
): number {
  const bases = itemBasePremiums(items);
  const base = total(bases);
  return roundPremium(
    base +
      itemSurcharges(items, bases) +
      policySurcharges(base, customer, previousQuotes) +
      PROCESSING_FEE,
  );
}
