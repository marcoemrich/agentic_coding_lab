import { Item, Customer } from './types.js';
import {
  getItemSpec,
  isComponentType,
  isKnownType,
  COMPONENT_BLOCK_PREMIUM,
  COMPONENT_BLOCK_SIZE,
} from './catalogue.js';

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOWUP_CONTRACT_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

function basePremiumFor(item: Item): number {
  return getItemSpec(item.type).basePremium;
}

function countByType(items: Item[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
}

// A pack of exactly COMPONENT_BLOCK_SIZE of one component type is offered
// at the special block premium; otherwise components are priced individually.
function componentsBasePremium(items: Item[]): number {
  const componentItems = items.filter((i) => isComponentType(i.type));
  const counts = countByType(componentItems);
  let total = 0;
  for (const type of Object.keys(counts)) {
    const count = counts[type];
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * getItemSpec(type).basePremium;
    }
  }
  return total;
}

function mainItemsBasePremium(items: Item[]): number {
  return items
    .filter((i) => !isComponentType(i.type))
    .reduce((sum, item) => sum + basePremiumFor(item), 0);
}

function policyBasePremium(items: Item[]): number {
  return mainItemsBasePremium(items) + componentsBasePremium(items);
}

function itemSurcharge(item: Item): number {
  const base = basePremiumFor(item);
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

function totalItemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemSurcharge(item), 0);
}

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

export interface PremiumContext {
  customer: Customer;
  quoteIndex: number; // 0-based index among quotes in scenario
}

// Policy-wide modifiers (loyalty, first insurance, follow-up contract) apply
// to the policy base premium — the sum of item base premiums, exclusive of
// item-specific surcharges. The processing fee is added last.
export function computePremium(items: Item[], ctx: PremiumContext): number {
  validateItems(items);

  const policyBase = policyBasePremium(items);
  let total = policyBase + totalItemSurcharges(items);

  if (ctx.customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    total -= policyBase * LOYALTY_DISCOUNT;
  }
  total += policyBase * FIRST_INSURANCE_SURCHARGE;
  if (ctx.quoteIndex > 0) {
    total -= policyBase * FOLLOWUP_CONTRACT_DISCOUNT;
  }
  total += PROCESSING_FEE;

  return Math.ceil(total);
}
