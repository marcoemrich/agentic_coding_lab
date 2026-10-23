import { catalogEntry } from "./catalog.js";
import { countByType } from "./items.js";

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function isComponent(type: string): boolean {
  return type === "rune" || type === "moonstone";
}

function countByItemType(items: Item[]): Map<string, number> {
  return countByType(items, (item) => item.type);
}

export function policyBasePremium(items: Item[]): number {
  const counts = countByItemType(items);
  let total = 0;
  for (const [type, count] of counts) {
    if (isComponent(type) && count === BLOCK_SIZE) {
      total += BLOCK_PREMIUM;
    } else {
      total += catalogEntry(type).premium * count;
    }
  }
  return total;
}

export function itemRiskSurcharge(items: Item[]): number {
  return items.reduce((total, item) => total + itemSurcharge(item), 0);
}

function itemSurcharge(item: Item): number {
  const premium = catalogEntry(item.type).premium;
  let surcharge = 0;
  if (item.cursed === true) {
    surcharge += premium * CURSED_SURCHARGE_RATE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += premium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

export interface ContractContext {
  isFollowUpContract: boolean;
}

export function quotePremium(
  items: Item[],
  customer: Customer,
  contract: ContractContext = { isFollowUpContract: false },
): number {
  const base = policyBasePremium(items);
  const risk = itemRiskSurcharge(items);
  const initialAssessment = base * INITIAL_ASSESSMENT_RATE;
  const discount = policyDiscount(base, customer, contract);
  return roundPremiumUp(base + risk + initialAssessment - discount + PROCESSING_FEE);
}

function roundPremiumUp(amount: number): number {
  return Math.ceil(amount);
}

function policyDiscount(
  base: number,
  customer: Customer,
  contract: ContractContext,
): number {
  let discount = 0;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    discount += base * LOYALTY_DISCOUNT_RATE;
  }
  if (contract.isFollowUpContract) {
    discount += base * FOLLOW_UP_DISCOUNT_RATE;
  }
  return discount;
}
