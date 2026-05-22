import type { Customer, Item } from './types.js';
import {
  isKnownType,
  isComponent,
  itemBasePremium,
  componentBlockPremium,
} from './items.js';

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOWUP_DISCOUNT = 0.15;

export function quote(customer: Customer, items: Item[]): number {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  // Compute per-item base premiums, including component block packing.
  // "Block requires exactly 3" — applies only when count of a component type is exactly 3.
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }

  // policy base = sum of item base premiums
  let policyBase = 0;
  let itemLevelSurcharges = 0;

  // For components: assign each component its share of the (possibly-blocked) base.
  // For per-item first-insurance, each component still counts as an item with its own basePremium.
  // But: the spec says block of 3 alike → special base 60. We need to define "per-item first-insurance" base.
  // Reading examples: "3 runes → 60 G base premium (block applies)". Integration examples don't combine with first-ins for components, so we infer:
  //   - the policy base premium is the sum (with blocks): 60 for 3 runes.
  //   - first insurance is 10% per item base; using the regular base (25 per rune) gives clean numbers.
  // This matches my 3-runes test (60 base + 7.5 first-ins + 5 fee = 72.5 → 73).

  for (const [type, count] of componentCounts) {
    policyBase += componentBlockPremium(count);
  }

  for (const item of items) {
    if (isComponent(item.type)) {
      // First-insurance surcharge per component item, based on regular per-component premium.
      const itemBase = itemBasePremium(item.type);
      itemLevelSurcharges += itemBase * FIRST_INSURANCE_SURCHARGE;
    } else {
      // main item
      const itemBase = itemBasePremium(item.type);
      policyBase += itemBase;

      if (item.cursed) {
        itemLevelSurcharges += itemBase * CURSE_SURCHARGE;
      }
      if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
        itemLevelSurcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE;
      }
      // first insurance applies to each item
      itemLevelSurcharges += itemBase * FIRST_INSURANCE_SURCHARGE;
    }
  }

  // Policy-wide modifiers
  let policyAdjustments = 0;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    policyAdjustments -= policyBase * LOYALTY_DISCOUNT;
  }
  if (customer.contractCount >= 1) {
    policyAdjustments -= policyBase * FOLLOWUP_DISCOUNT;
  }

  const subtotal = policyBase + itemLevelSurcharges + policyAdjustments + PROCESSING_FEE;
  // Round up in MHPCO's favor
  return Math.ceil(subtotal);
}
