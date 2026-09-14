export interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<string, ItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENTS = new Set(['rune', 'moonstone']);

export const COMPONENT_SPEC: ItemSpec = { insuranceValue: 250, basePremium: 25 };

export const BLOCK_SIZE = 3;
export const BLOCK_PREMIUM = 60;

export function isComponent(type: string): boolean {
  return COMPONENTS.has(type);
}

export function lookup(type: string): ItemSpec {
  const main = MAIN_ITEMS[type];
  if (main) return main;
  if (isComponent(type)) return COMPONENT_SPEC;
  throw new Error(`unknown item type: ${type}`);
}
