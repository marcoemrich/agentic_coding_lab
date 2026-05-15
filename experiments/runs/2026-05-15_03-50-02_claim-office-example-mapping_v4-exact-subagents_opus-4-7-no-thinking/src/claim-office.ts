// claim-office.ts

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const MAIN_ITEM_BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set<string>(["rune", "moonstone"]);
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;

export type Customer = {
  yearsInsured: number;
  previousQuotes: number;
};

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteInput = {
  items: Item[];
  customer: Customer;
};

const BLOCK_SIZE = 3;

const formsOneBlock = (count: number): boolean => {
  if (count < BLOCK_SIZE) return false;
  const leftover = count - BLOCK_SIZE;
  return leftover !== 1;
};

const componentGroupBase = (count: number): number => {
  const blocks = formsOneBlock(count) ? 1 : 0;
  const singles = count - blocks * BLOCK_SIZE;
  return blocks * COMPONENT_BLOCK_PREMIUM + singles * COMPONENT_BASE_PREMIUM;
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const mainItemBase = (item: Item): number =>
  MAIN_ITEM_BASE_PREMIUM_BY_TYPE[item.type] ?? 0;

const basePremium = (items: Item[]): number => {
  const componentCounts: Record<string, number> = {};
  let mainTotal = 0;
  for (const item of items) {
    if (isComponent(item)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      mainTotal += mainItemBase(item);
    }
  }
  const componentTotal = Object.values(componentCounts).reduce(
    (sum, count) => sum + componentGroupBase(count),
    0
  );
  return mainTotal + componentTotal;
};

const itemSurcharges = (items: Item[]): number => {
  let total = 0;
  for (const item of items) {
    if (isComponent(item)) continue;
    if (item.cursed) total += mainItemBase(item) * CURSED_SURCHARGE_RATE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += mainItemBase(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
  }
  return total;
};

const roundUpToGold = (amount: number): number => {
  const precisionSafe = Math.round(amount * 100) / 100;
  return Math.ceil(precisionSafe);
};

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

export type Damage = {
  itemType: string;
  amount: number;
};

export type ClaimInput = {
  items: Item[];
  damages: Damage[];
  remainingCap?: number;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

const DEDUCTIBLE = 100;

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;
const CAP_MULTIPLIER = 2;

const itemInsuranceValue = (item: Item): number => {
  if (isComponent(item)) return COMPONENT_INSURANCE_VALUE;
  return INSURANCE_VALUE_BY_TYPE[item.type] ?? 0;
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

export const claim = (input: ClaimInput): ClaimResult => {
  const payout = input.damages.reduce((sum, damage) => {
    const item = input.items.find((i) => i.type === damage.itemType);
    const baseAmount =
      item && (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
        ? damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE
        : damage.amount;
    return sum + (baseAmount - DEDUCTIBLE);
  }, 0);
  const cap = input.remainingCap ?? insuranceSum(input.items) * CAP_MULTIPLIER;
  const finalPayout = Math.floor(Math.min(payout, cap));
  return { payout: finalPayout, remainingCap: cap - finalPayout };
};

export const quote = (input: QuoteInput): number => {
  const base = basePremium(input.items);
  const surcharges = itemSurcharges(input.items);
  const firstInsurance = base * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    input.customer.yearsInsured >= LOYALTY_THRESHOLD_YEARS
      ? base * LOYALTY_DISCOUNT_RATE
      : 0;
  const followupDiscount =
    input.customer.previousQuotes >= 1 ? base * FOLLOWUP_DISCOUNT_RATE : 0;
  const total =
    base +
    surcharges +
    firstInsurance -
    loyaltyDiscount -
    followupDiscount +
    PROCESSING_FEE;
  return roundUpToGold(total);
};
