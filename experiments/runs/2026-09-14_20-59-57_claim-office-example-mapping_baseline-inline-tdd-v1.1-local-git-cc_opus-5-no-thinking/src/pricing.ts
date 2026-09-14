export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
}

const CATALOG: Record<string, ItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100, component: false },
  amulet: { insuranceValue: 600, basePremium: 60, component: false },
  staff: { insuranceValue: 800, basePremium: 80, component: false },
  potion: { insuranceValue: 400, basePremium: 40, component: false },
  rune: { insuranceValue: 250, basePremium: 25, component: true },
  moonstone: { insuranceValue: 250, basePremium: 25, component: true },
};

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

export class UnknownItemTypeError extends Error {
  constructor(type: string) {
    super(`unknown item type: ${type}`);
    this.name = 'UnknownItemTypeError';
  }
}

export function specFor(type: string): ItemSpec {
  const spec = CATALOG[type];
  if (!spec) throw new UnknownItemTypeError(type);
  return spec;
}

/**
 * Base premium of an item on its own, before any modifiers.
 * Components are priced per-type in `policyBasePremium`, since a block
 * discount depends on how many alike components share the policy.
 */
export function itemBasePremium(item: Item): number {
  return specFor(item.type).basePremium;
}

/** Sum of the items' insurance values; block discounts do not affect it. */
export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + specFor(item.type).insuranceValue, 0);
}

/**
 * Base premium for a whole policy: main items at list price, components
 * grouped by type so that a group of exactly 3 alike ones forms a block.
 */
export function policyBasePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let total = 0;

  for (const item of items) {
    const spec = specFor(item.type);
    if (spec.component) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += spec.basePremium;
    }
  }

  for (const [type, count] of componentCounts) {
    total +=
      count === BLOCK_SIZE
        ? BLOCK_PREMIUM
        : count * specFor(type).basePremium;
  }

  return total;
}
