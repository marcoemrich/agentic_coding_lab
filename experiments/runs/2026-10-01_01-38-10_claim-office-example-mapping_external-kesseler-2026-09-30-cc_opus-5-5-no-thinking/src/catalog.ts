export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface ItemKind {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
}

const COMPONENT: ItemKind = { insuranceValue: 250, basePremium: 25, component: true };

const CATALOG: Record<string, ItemKind> = {
  sword: { insuranceValue: 1000, basePremium: 100, component: false },
  amulet: { insuranceValue: 600, basePremium: 60, component: false },
  staff: { insuranceValue: 800, basePremium: 80, component: false },
  potion: { insuranceValue: 400, basePremium: 40, component: false },
  rune: COMPONENT,
  moonstone: COMPONENT,
};

export function kindOf(type: string): ItemKind {
  if (!Object.hasOwn(CATALOG, type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return CATALOG[type];
}
