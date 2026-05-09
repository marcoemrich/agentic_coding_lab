import { Item } from './types.js';

interface ItemPriceInfo {
  insurance: number;
  base: number;
  isComponent: boolean;
}

const MAIN_ITEM_PRICES: Record<string, { insurance: number; base: number }> = {
  sword: { insurance: 1000, base: 100 },
  amulet: { insurance: 600, base: 60 },
  staff: { insurance: 800, base: 80 },
  potion: { insurance: 400, base: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);

export function isComponent(itemType: string): boolean {
  return COMPONENT_TYPES.has(itemType);
}

export function getItemPriceInfo(item: Item): ItemPriceInfo {
  if (MAIN_ITEM_PRICES[item.type]) {
    const p = MAIN_ITEM_PRICES[item.type];
    return { insurance: p.insurance, base: p.base, isComponent: false };
  }
  if (isComponent(item.type)) {
    return { insurance: 250, base: 25, isComponent: true };
  }
  // unknown item type - treat as zero price (defensive default)
  return { insurance: 0, base: 0, isComponent: false };
}

/**
 * Compute the insurance sum for a list of items.
 */
export function computeInsuranceSum(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    total += getItemPriceInfo(item).insurance;
  }
  return total;
}

/**
 * Compute the base premium for items, applying the "block of 3 alike components"
 * discount (3 alike components → 60G base instead of 75G).
 */
function computeBasePremiumForItems(items: Item[]): { perItemBase: Map<number, number> } {
  // We'll compute a per-index base premium; for components grouped in blocks
  // of 3 alike, the block discount distributes 60G across the 3 components
  // proportionally (20G each) so that per-item modifiers (cursed, enchantment)
  // can still be applied to each individually.
  const perItemBase = new Map<number, number>();

  // Group component indices by type
  const componentIndicesByType = new Map<string, number[]>();
  items.forEach((item, idx) => {
    const info = getItemPriceInfo(item);
    if (info.isComponent) {
      if (!componentIndicesByType.has(item.type)) {
        componentIndicesByType.set(item.type, []);
      }
      componentIndicesByType.get(item.type)!.push(idx);
    } else {
      perItemBase.set(idx, info.base);
    }
  });

  for (const [, indices] of componentIndicesByType) {
    let i = 0;
    while (i < indices.length) {
      if (i + 3 <= indices.length) {
        // block of 3: 60G total, 20G each
        for (let k = 0; k < 3; k++) {
          perItemBase.set(indices[i + k], 20);
        }
        i += 3;
      } else {
        // singleton or pair: 25G each
        perItemBase.set(indices[i], 25);
        i += 1;
      }
    }
  }

  return { perItemBase };
}

interface QuoteContext {
  yearsWithMHPCO: number;
  contractIndex: number; // 0 = first insurance for this customer
}

/**
 * Apply per-item risk surcharges (cursed, high enchantment).
 * Both surcharges combine multiplicatively when both apply.
 */
function applyItemRiskSurcharges(base: number, item: Item): number {
  let multiplier = 1;
  if (item.cursed) {
    multiplier *= 1.5;
  }
  if ((item.enchantment ?? 0) >= 5) {
    multiplier *= 1.3;
  }
  return base * multiplier;
}

/**
 * Round a monetary amount in MHPCO's favor (= round up to next whole G).
 */
export function roundInFavor(amount: number): number {
  // Use a small epsilon to avoid floating-point round-up of values that
  // are mathematically exact integers.
  const EPS = 1e-9;
  if (Math.abs(amount - Math.round(amount)) < EPS) {
    return Math.round(amount);
  }
  return Math.ceil(amount);
}

export function computePremium(items: Item[], ctx: QuoteContext): number {
  const { perItemBase } = computeBasePremiumForItems(items);

  // Sum of risk-adjusted base premiums (still in floating point).
  let subtotal = 0;
  items.forEach((item, idx) => {
    const base = perItemBase.get(idx) ?? 0;
    subtotal += applyItemRiskSurcharges(base, item);
  });

  // Customer-level modifiers. Applied multiplicatively.
  let customerMultiplier = 1;
  if (ctx.yearsWithMHPCO >= 2) {
    customerMultiplier *= 0.8; // 20% loyalty discount
  }
  if (ctx.contractIndex === 0) {
    customerMultiplier *= 1.1; // first insurance assessment surcharge
  } else {
    customerMultiplier *= 0.85; // 15% discount for subsequent contracts
  }

  let total = subtotal * customerMultiplier;

  // Processing fee
  total += 5;

  return roundInFavor(total);
}
