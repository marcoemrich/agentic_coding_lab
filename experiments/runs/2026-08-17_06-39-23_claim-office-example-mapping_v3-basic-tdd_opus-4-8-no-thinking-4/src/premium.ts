import { policyBasePremium } from './basePremium';
import { isMainItem, itemBasePremium, MainItemType } from './catalog';
import { roundInOfficeFavor } from './rounding';

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface CustomerContext {
  yearsWithMHPCO: number;
  isFollowUp: boolean;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

function itemSurcharge(item: QuoteItem): number {
  if (!isMainItem(item.type)) {
    return 0;
  }
  const itemBase = itemBasePremium(item.type as MainItemType);
  let surcharge = 0;
  if (item.cursed) {
    surcharge += itemBase * CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    surcharge += itemBase * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

function policyAdjustment(policyBase: number, ctx: CustomerContext): number {
  let adjustment = policyBase * FIRST_INSURANCE_SURCHARGE;
  if (ctx.yearsWithMHPCO >= LOYALTY_YEARS) {
    adjustment -= policyBase * LOYALTY_DISCOUNT;
  }
  if (ctx.isFollowUp) {
    adjustment -= policyBase * FOLLOW_UP_DISCOUNT;
  }
  return adjustment;
}

export function quotePremium(items: QuoteItem[], ctx: CustomerContext): number {
  const policyBase = policyBasePremium(items);
  const surcharges = items.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const raw = policyBase + surcharges + policyAdjustment(policyBase, ctx) + PROCESSING_FEE;
  return roundInOfficeFavor(raw, 'premium');
}
