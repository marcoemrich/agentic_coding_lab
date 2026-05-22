export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  enchantment?: number;
  cursed?: boolean;
  material?: string;
}

export interface QuoteOptions {
  isFollowUp?: boolean;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT = 20;
const FOLLOW_UP_DISCOUNT = 15;
const LOYALTY_THRESHOLD_YEARS = 2;
const HIGH_ENCHANT_THRESHOLD = 5;
const HIGH_ENCHANT_SURCHARGE_RATE = 0.3;
const CURSE_SURCHARGE_RATE = 0.5;

const BASE_PRICES: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_UNIT_PRICE = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

// Base price for a group of items of the same component type (rune/moonstone).
// Exactly 3 of a kind forms a "block" priced at 60; otherwise 25 per item.
function componentGroupBase(count: number): number {
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PRICE : count * COMPONENT_UNIT_PRICE;
}

// Sum of base prices for all items, respecting per-type block discounts for components.
function policyBaseTotal(items: Item[]): number {
  const componentCounts: Record<string, number> = {};
  let nonComponentBase = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      nonComponentBase += BASE_PRICES[item.type];
    }
  }
  const componentBase = Object.values(componentCounts).reduce(
    (sum, count) => sum + componentGroupBase(count),
    0,
  );
  return nonComponentBase + componentBase;
}

// Per-item surcharges (curse, high-enchantment) computed as a percentage of
// the item's individual base price. Components have no surcharges.
function itemSurcharges(item: Item): number {
  if (COMPONENT_TYPES.has(item.type)) return 0;
  const base = BASE_PRICES[item.type];
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANT_SURCHARGE_RATE;
  }
  return surcharge;
}

export interface Policy {
  items: Item[];
}

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
const HIGH_ENCHANT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANT_DAMAGE_DIVISOR = 2;

// Reimbursable amount for a single damage entry, before the per-event deductible.
// High-enchantment items (enchantment >= 8) are reimbursed at 50% of damage.
function reimbursableAmount(policy: Policy, damage: Damage): number {
  const damagedItem = policy.items.find((item) => item.type === damage.itemType);
  const isHighEnchant = (damagedItem?.enchantment ?? 0) >= HIGH_ENCHANT_DAMAGE_THRESHOLD;
  return isHighEnchant ? damage.amount / HIGH_ENCHANT_DAMAGE_DIVISOR : damage.amount;
}

export function claim(policy: Policy, incident: Incident, remainingCap: number): ClaimResult {
  const rawPayout = incident.damages.reduce(
    (sum, damage) => sum + reimbursableAmount(policy, damage) - DEDUCTIBLE,
    0,
  );
  const cappedPayout = Math.min(rawPayout, remainingCap);
  // Round DOWN in MHPCO's favor (payouts) — mirrors Math.ceil on premiums.
  const payout = Math.floor(cappedPayout);
  return { payout, remainingCap: remainingCap - payout };
}

export function quote(customer: Customer, items: Item[], options?: QuoteOptions): number {
  const baseTotal = policyBaseTotal(items);
  const surchargeTotal = items.reduce((sum, item) => sum + itemSurcharges(item), 0);
  const firstInsurance = baseTotal * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? LOYALTY_DISCOUNT : 0;
  const followUpDiscount = options?.isFollowUp ? FOLLOW_UP_DISCOUNT : 0;
  const premium =
    baseTotal + surchargeTotal + firstInsurance - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
  return Math.ceil(premium);
}
