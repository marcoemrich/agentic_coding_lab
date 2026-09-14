export interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
}

export interface Customer {
  yearsWithMHPCO: number;
}

/**
 * Amounts are accumulated in hundredths of a G so that percentage
 * modifiers stay exact; only the final premium is rounded.
 */
const SCALE = 100;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENTS = ['rune', 'moonstone'];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE = 50;
const HIGH_ENCHANTMENT_SURCHARGE = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT = 20;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 10;
const FOLLOW_UP_DISCOUNT = 15;
const PROCESSING_FEE = 5;

const PERCENT = 100;

function percent(amount: number, rate: number): number {
  return (amount * rate) / PERCENT;
}

function basePremiumOf(item: Item): number {
  const price = BASE_PREMIUM[item.type];
  if (price === undefined) {
    throw new Error(`unknown item type: ${item.type}`);
  }
  return price * SCALE;
}

function countsByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

/**
 * A building block of exactly 3 alike components is offered at a flat
 * base premium instead of the per-component price.
 */
function blockRebate(items: Item[]): number {
  let rebate = 0;
  for (const [type, count] of countsByType(items)) {
    if (COMPONENTS.includes(type) && count === BLOCK_SIZE) {
      rebate += (count * BASE_PREMIUM[type] - BLOCK_PREMIUM) * SCALE;
    }
  }
  return rebate;
}

/** Cursed and highly enchanted items are surcharged on their own base premium. */
function itemSurchargeOf(item: Item): number {
  const itemBase = basePremiumOf(item);
  let surcharge = 0;
  if (item.cursed) {
    surcharge += percent(itemBase, CURSE_SURCHARGE);
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    surcharge += percent(itemBase, HIGH_ENCHANTMENT_SURCHARGE);
  }
  return surcharge;
}

export function quote(
  items: Item[],
  customer: Customer = { yearsWithMHPCO: 0 },
  contractIndex = 0,
): number {
  const itemSurcharges = items.reduce((sum, item) => sum + itemSurchargeOf(item), 0);
  const policyBase = items.reduce((sum, item) => sum + basePremiumOf(item), 0) - blockRebate(items);

  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_YEARS ? percent(policyBase, LOYALTY_DISCOUNT) : 0;
  const followUp = contractIndex > 0 ? percent(policyBase, FOLLOW_UP_DISCOUNT) : 0;
  const firstInsurance = percent(policyBase, FIRST_INSURANCE_SURCHARGE);

  const total =
    policyBase + itemSurcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE * SCALE;

  // Rounded up, in the MHPCO's favour.
  return Math.ceil(total / SCALE);
}
