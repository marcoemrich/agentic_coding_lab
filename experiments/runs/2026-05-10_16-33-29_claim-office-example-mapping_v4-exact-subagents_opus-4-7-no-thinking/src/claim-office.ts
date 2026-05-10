// claim-office.ts

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteInput = {
  items: Item[];
  customerYears: number;
  previousContracts: number;
};

const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_DAMAGE_REIMBURSEMENT_RATE = 0.5;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

function groupByType(items: Item[]): Map<string, Item[]> {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return groups;
}

function premiumForGroup(type: string, group: Item[]): number {
  if (COMPONENT_TYPES.has(type) && group.length === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return group.length * BASE_PREMIUM_BY_TYPE[type];
}

function isEnchantmentAtLeast(item: Item, threshold: number): boolean {
  return item.enchantment !== undefined && item.enchantment >= threshold;
}

function modifierRateForItem(item: Item): number {
  let rate = 0;
  if (item.cursed) {
    rate += CURSE_SURCHARGE_RATE;
  }
  if (isEnchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD)) {
    rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return rate;
}

function premiumForModifiedItem(item: Item): number {
  const base = BASE_PREMIUM_BY_TYPE[item.type];
  return base + base * modifierRateForItem(item);
}

function hasCursedItem(items: Item[]): boolean {
  return items.some((item) => item.cursed);
}

function hasHighEnchantmentItem(items: Item[]): boolean {
  return items.some((item) => isEnchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD));
}

function hasItemModifier(items: Item[]): boolean {
  return hasCursedItem(items) || hasHighEnchantmentItem(items);
}

function sumByType(items: Item[], valueByType: Record<string, number>): number {
  return items.reduce((sum, item) => sum + valueByType[item.type], 0);
}

function baseTotalForItems(items: Item[]): number {
  return sumByType(items, BASE_PREMIUM_BY_TYPE);
}

function premiumForItems(items: Item[]): number {
  if (hasItemModifier(items)) {
    return items.reduce((sum, item) => sum + premiumForModifiedItem(item), 0);
  }
  return Array.from(groupByType(items)).reduce(
    (sum, [type, group]) => sum + premiumForGroup(type, group),
    0,
  );
}

function qualifiesForFirstInsuranceSurcharge(input: QuoteInput): boolean {
  return input.items.length === 1 && hasItemModifier(input.items);
}

function qualifiesForLoyaltyDiscount(input: QuoteInput): boolean {
  return input.customerYears >= LOYALTY_YEARS_THRESHOLD;
}

function qualifiesForFollowupDiscount(input: QuoteInput): boolean {
  return input.previousContracts >= 1;
}

export type Damage = {
  itemType: string;
  amount: number;
};

export type ClaimInput = {
  items: Item[];
  remainingCap: number;
  damages: Damage[];
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

function payoutForDamage(damage: Damage, items: Item[]): number {
  const item = items.find((i) => i.type === damage.itemType);
  const isHighEnchantmentDamage =
    item !== undefined && isEnchantmentAtLeast(item, HIGH_ENCHANTMENT_DAMAGE_THRESHOLD);
  const reimbursement = isHighEnchantmentDamage
    ? damage.amount * HIGH_ENCHANTMENT_DAMAGE_REIMBURSEMENT_RATE
    : damage.amount;
  return reimbursement - DEDUCTIBLE;
}

export function claim(input: ClaimInput): ClaimResult {
  const { items, remainingCap, damages } = input;
  const uncappedPayout = damages.reduce(
    (sum, damage) => sum + payoutForDamage(damage, items),
    0,
  );
  const payout = Math.min(Math.floor(uncappedPayout), remainingCap);
  return { payout, remainingCap: remainingCap - payout };
}

export function insuranceSum(items: Item[]): number {
  return sumByType(items, INSURANCE_VALUE_BY_TYPE);
}

export function isKnownItemType(type: string): boolean {
  return type in BASE_PREMIUM_BY_TYPE;
}

function policyAdjustmentRate(input: QuoteInput): number {
  let rate = 0;
  if (qualifiesForFirstInsuranceSurcharge(input)) {
    rate += FIRST_INSURANCE_SURCHARGE_RATE;
  }
  if (qualifiesForLoyaltyDiscount(input)) {
    rate -= LOYALTY_DISCOUNT_RATE;
  }
  if (qualifiesForFollowupDiscount(input)) {
    rate -= FOLLOWUP_DISCOUNT_RATE;
  }
  return rate;
}

export function quote(input: QuoteInput): number {
  const premium = premiumForItems(input.items);
  const baseTotal = baseTotalForItems(input.items);
  const adjustment = baseTotal * policyAdjustmentRate(input);
  return Math.ceil(premium + adjustment + PROCESSING_FEE);
}
