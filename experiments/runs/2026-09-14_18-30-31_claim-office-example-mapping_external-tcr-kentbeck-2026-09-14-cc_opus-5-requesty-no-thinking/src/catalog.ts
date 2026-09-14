export interface ItemSpec {
  value: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<string, ItemSpec> = {
  sword: { value: 1000, basePremium: 100 },
  amulet: { value: 600, basePremium: 60 },
  staff: { value: 800, basePremium: 80 },
  potion: { value: 400, basePremium: 40 },
};

const COMPONENTS: Record<string, ItemSpec> = {
  rune: { value: 250, basePremium: 25 },
  moonstone: { value: 250, basePremium: 25 },
};

export function lookupItem(type: string): ItemSpec | undefined {
  return MAIN_ITEMS[type] ?? COMPONENTS[type];
}

export function isComponent(type: string): boolean {
  return type in COMPONENTS;
}
