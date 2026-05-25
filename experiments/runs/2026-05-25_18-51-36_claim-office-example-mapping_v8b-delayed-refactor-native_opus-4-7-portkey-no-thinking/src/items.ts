import { Item } from "./types.js";

export interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
  isComponent: boolean;
}

const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const ITEM_CATALOG: Record<string, ItemSpec> = {
  sword:     { insuranceValue: 1000, basePremium: 100, isComponent: false },
  amulet:    { insuranceValue:  600, basePremium:  60, isComponent: false },
  staff:     { insuranceValue:  800, basePremium:  80, isComponent: false },
  potion:    { insuranceValue:  400, basePremium:  40, isComponent: false },
  rune:      { insuranceValue:  250, basePremium:  25, isComponent: true  },
  moonstone: { insuranceValue:  250, basePremium:  25, isComponent: true  },
};

function specOf(type: string): ItemSpec {
  const spec = ITEM_CATALOG[type];
  if (!spec) throw new Error(`Unknown item type: ${type}`);
  return spec;
}

export function isKnownType(type: string): boolean {
  return ITEM_CATALOG[type] !== undefined;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + specOf(item.type).insuranceValue, 0);
}

// Returns per-item base premiums (un-discounted, for item-specific surcharges)
// and the policy's total base premium (with block discount applied to
// components: exactly 3 alike components → 60 G, otherwise per-item pricing).
export function policyBasePremiums(items: Item[]): {
  perItemBase: number[];
  totalBase: number;
} {
  const perItemBase: number[] = [];
  const componentCounts: Record<string, number> = {};
  let mainItemsBase = 0;

  for (const item of items) {
    const spec = specOf(item.type);
    perItemBase.push(spec.basePremium);
    if (spec.isComponent) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      mainItemsBase += spec.basePremium;
    }
  }

  let componentsBase = 0;
  for (const [type, count] of Object.entries(componentCounts)) {
    componentsBase += count === COMPONENT_BLOCK_SIZE
      ? COMPONENT_BLOCK_PREMIUM
      : count * specOf(type).basePremium;
  }

  return { perItemBase, totalBase: mainItemsBase + componentsBase };
}
