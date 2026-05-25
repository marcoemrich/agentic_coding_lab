import { Item } from './types.js';

export interface ItemSpec {
  insuredValue: number;
  basePremium: number;
  isComponent: boolean;
}

const MAIN_ITEMS: Record<string, ItemSpec> = {
  sword:  { insuredValue: 1000, basePremium: 100, isComponent: false },
  amulet: { insuredValue:  600, basePremium:  60, isComponent: false },
  staff:  { insuredValue:  800, basePremium:  80, isComponent: false },
  potion: { insuredValue:  400, basePremium:  40, isComponent: false },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_VALUE = 250;
const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_BASE = 60; // for a block of 3 alike components

export function specFor(type: string): ItemSpec {
  if (MAIN_ITEMS[type]) return MAIN_ITEMS[type];
  if (COMPONENT_TYPES.has(type)) {
    return { insuredValue: COMPONENT_VALUE, basePremium: COMPONENT_BASE, isComponent: true };
  }
  throw new Error(`Unknown item type: ${type}`);
}

export function insuredValue(item: Item): number {
  return specFor(item.type).insuredValue;
}

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

/**
 * Compute the base premium for an item including item-level surcharges
 * (cursed +50%, highly enchanted +30%).
 * Used for main items; components are priced collectively (block discounts)
 * but the same item-level surcharges apply on a per-component basis.
 */
export function itemPremium(basePremium: number, item: Item): number {
  let p = basePremium;
  if (item.cursed) p *= 1.5;
  if ((item.enchantment ?? 0) >= 5) p *= 1.3;
  return p;
}

/**
 * Compute the policy's total insurance sum (sum of insured values).
 */
export function totalInsuranceSum(items: Item[]): number {
  return items.reduce((sum, it) => sum + insuredValue(it), 0);
}

/**
 * Compute the raw (pre-policy-modifier, pre-fee) premium for a list of items.
 *
 * Components of the same type are grouped: every block of 3 alike components
 * uses the special block base premium (60G instead of 3*25=75G). The block
 * premium is distributed equally across the 3 component items so that
 * item-level surcharges can apply individually.
 */
export function rawPremium(items: Item[]): number {
  let total = 0;

  // Handle main items individually
  for (const item of items) {
    const spec = specFor(item.type);
    if (!spec.isComponent) {
      total += itemPremium(spec.basePremium, item);
    }
  }

  // Group components by type
  const componentsByType: Record<string, Item[]> = {};
  for (const item of items) {
    if (isComponent(item.type)) {
      (componentsByType[item.type] ||= []).push(item);
    }
  }

  for (const list of Object.values(componentsByType)) {
    // Number of full blocks of 3
    const fullBlocks = Math.floor(list.length / 3);
    const remainder = list.length % 3;
    // Per-component base inside a block: 60 / 3 = 20G
    const blockPerItem = COMPONENT_BLOCK_BASE / 3;

    // Apply surcharges per-component to keep semantics consistent.
    let idx = 0;
    for (let b = 0; b < fullBlocks; b++) {
      for (let i = 0; i < 3; i++) {
        total += itemPremium(blockPerItem, list[idx++]);
      }
    }
    for (let i = 0; i < remainder; i++) {
      total += itemPremium(COMPONENT_BASE, list[idx++]);
    }
  }

  return total;
}

export interface PolicyModifiers {
  yearsWithMHPCO: number;
  contractIndex: number; // 0 for first contract, 1 for second, etc.
}

const LOYALTY_DISCOUNT = 0.20;
const FIRST_INSURANCE_SURCHARGE = 0.10;
const SUBSEQUENT_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

/**
 * Apply policy-level modifiers and processing fee to a raw premium, then
 * round up to whole G (MHPCO's favor).
 */
export function applyPolicyModifiers(raw: number, mods: PolicyModifiers): number {
  let p = raw;
  if (mods.yearsWithMHPCO >= 2) {
    p *= 1 - LOYALTY_DISCOUNT;
  }
  if (mods.contractIndex === 0) {
    p *= 1 + FIRST_INSURANCE_SURCHARGE;
  } else {
    p *= 1 - SUBSEQUENT_DISCOUNT;
  }
  p += PROCESSING_FEE;
  return ceilG(p);
}

// Round up to whole G, but absorb tiny float artifacts (≤ 1e-6) so that
// values like 115.00000000000001 round to 115 rather than 116.
function ceilG(value: number): number {
  const rounded = Math.round(value);
  if (Math.abs(value - rounded) < 1e-6) return rounded;
  return Math.ceil(value);
}

export function quotePremium(items: Item[], mods: PolicyModifiers): number {
  return applyPolicyModifiers(rawPremium(items), mods);
}
