import type { Customer, Item, Policy } from "./types.js";
import {
  COMPONENT_BUNDLE_BASE_PREMIUM,
  COMPONENT_INSURANCE_VALUE,
  COMPONENT_SINGLE_BASE_PREMIUM,
  PROCESSING_FEE,
  applyItemModifiers,
  getMainItemInfo,
  isMainItem,
} from "./pricing.js";

/**
 * Compute the insurance sum (total insured value) for a list of items.
 */
export function computeInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    const main = getMainItemInfo(item.type);
    if (main) {
      sum += main.insuranceValue;
    } else {
      sum += COMPONENT_INSURANCE_VALUE;
    }
  }
  return sum;
}

/**
 * Compute the raw item-level premium contribution (before contract-level
 * modifiers and processing fee), with bundle discounts applied for
 * components.
 */
export function computeItemsBasePremium(items: Item[]): number {
  let total = 0;

  // Main items: apply modifiers individually.
  for (const item of items) {
    if (isMainItem(item.type)) {
      const info = getMainItemInfo(item.type)!;
      total += applyItemModifiers(info.basePremium, item);
    }
  }

  // Components: group by (type, cursed, highEnchantment) and form bundles of 3.
  const componentGroups = new Map<string, Item[]>();
  for (const item of items) {
    if (!isMainItem(item.type)) {
      const key = `${item.type}|${item.cursed ? 1 : 0}|${(item.enchantment ?? 0) >= 5 ? 1 : 0}`;
      const arr = componentGroups.get(key) ?? [];
      arr.push(item);
      componentGroups.set(key, arr);
    }
  }

  for (const group of componentGroups.values()) {
    const sample = group[0];
    const bundles = Math.floor(group.length / 3);
    const singles = group.length % 3;
    for (let i = 0; i < bundles; i++) {
      total += applyItemModifiers(COMPONENT_BUNDLE_BASE_PREMIUM, sample);
    }
    for (let i = 0; i < singles; i++) {
      total += applyItemModifiers(COMPONENT_SINGLE_BASE_PREMIUM, sample);
    }
  }

  return total;
}

/**
 * Snap floating-point residue (within 1e-6 of an integer) to the nearest
 * integer, so that intentional whole-G values are not pushed up by Math.ceil
 * due to binary-float artefacts like 100 * 1.1 = 110.00000000000001.
 */
function roundForFavor(value: number): number {
  const rounded = Math.round(value);
  if (Math.abs(value - rounded) < 1e-6) return rounded;
  return value;
}

export interface QuoteContext {
  customer: Customer;
  /** Number of policies already in force for this customer (0 = first). */
  priorPolicyCount: number;
}

/**
 * Compute the premium for a list of items in a given context. Returns
 * an integer (rounded up in MHPCO's favor).
 */
export function computePremium(items: Item[], ctx: QuoteContext): number {
  let premium = computeItemsBasePremium(items);

  // Contract-level modifiers.
  if (ctx.customer.yearsWithMHPCO >= 2) {
    premium *= 0.8; // 20% loyalty discount
  }

  if (ctx.priorPolicyCount === 0) {
    premium *= 1.1; // 10% initial assessment surcharge for first insurance
  } else {
    premium *= 0.85; // 15% discount on each contract after the first
  }

  premium += PROCESSING_FEE;

  // Round to whole G in MHPCO's favor (round up). Snap small floating-point
  // residue first so e.g. 100*1.1 = 110.00000000000001 does not become 111.
  return Math.ceil(roundForFavor(premium));
}

/**
 * Build a policy record from a list of items.
 */
export function makePolicy(items: Item[]): Policy {
  const insuranceSum = computeInsuranceSum(items);
  return {
    items: items.map((i) => ({ ...i })),
    insuranceSum,
    remainingCap: insuranceSum * 2,
  };
}
