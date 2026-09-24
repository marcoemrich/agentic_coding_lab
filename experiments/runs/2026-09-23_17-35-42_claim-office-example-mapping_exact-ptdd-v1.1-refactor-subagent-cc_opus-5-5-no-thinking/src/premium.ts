/** MHPCO premium tariff: prices one contract's items for a customer. */
import { COMPONENT_BLOCK_BASE_PREMIUM, COMPONENT_BLOCK_SIZE, isComponent, priceOf } from "./priceList.js";

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteResult {
  premium: number;
}

const PROCESSING_FEE = 5;
const HUNDRED_PERCENT = 100;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

function percentOf(amount: number, percent: number): number {
  return (amount * percent) / HUNDRED_PERCENT;
}

/** Premiums are rounded up to whole G, in the MHPCO's favor. */
function roundPremiumInMhpcoFavor(premium: number): number {
  return Math.ceil(premium);
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

function basePremiumOfAlike(type: string, count: number): number {
  if (isComponent(type) && count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_BASE_PREMIUM;
  return count * priceOf(type).basePremium;
}

function policyBasePremiumOf(items: Item[]): number {
  let sum = 0;
  for (const [type, count] of countByType(items)) sum += basePremiumOfAlike(type, count);
  return sum;
}

interface ItemRiskSurcharge {
  appliesTo: (item: Item) => boolean;
  percent: number;
}

/** Item-specific modifiers: each applies to the base premium of the affected item only. */
const ITEM_RISK_SURCHARGES: ItemRiskSurcharge[] = [
  { appliesTo: (item) => item.cursed === true, percent: CURSE_SURCHARGE_PERCENT },
  { appliesTo: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL, percent: HIGH_ENCHANTMENT_SURCHARGE_PERCENT },
];

function itemRiskSurchargesOf(items: Item[]): number {
  let sum = 0;
  for (const item of items)
    for (const surcharge of ITEM_RISK_SURCHARGES)
      if (surcharge.appliesTo(item)) sum += percentOf(priceOf(item.type).basePremium, surcharge.percent);
  return sum;
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

export interface ContractContext {
  customer: Customer;
  isFollowUpContract: boolean;
}

interface PolicyModifier {
  appliesTo: (contract: ContractContext) => boolean;
  /** Positive for a surcharge, negative for a discount. */
  percent: number;
}

/** Policy-wide modifiers: each applies to the base premium of the whole policy. */
const POLICY_MODIFIERS: PolicyModifier[] = [
  { appliesTo: () => true, percent: FIRST_INSURANCE_SURCHARGE_PERCENT },
  { appliesTo: (contract) => isLongStandingCustomer(contract.customer), percent: -LOYALTY_DISCOUNT_PERCENT },
  { appliesTo: (contract) => contract.isFollowUpContract, percent: -FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT },
];

function policyModifiersOf(policyBasePremium: number, contract: ContractContext): number {
  let sum = 0;
  for (const modifier of POLICY_MODIFIERS)
    if (modifier.appliesTo(contract)) sum += percentOf(policyBasePremium, modifier.percent);
  return sum;
}

export function quote(items: Item[], contract: ContractContext): QuoteResult {
  const policyBasePremium = policyBasePremiumOf(items);
  const premium =
    policyBasePremium + itemRiskSurchargesOf(items) + policyModifiersOf(policyBasePremium, contract) + PROCESSING_FEE;
  return { premium: roundPremiumInMhpcoFavor(premium) };
}
