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

const COMPONENTS: Record<string, ItemSpec> = {
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

export function isComponent(type: string): boolean {
  return Object.prototype.hasOwnProperty.call(COMPONENTS, type);
}

export function lookup(type: string): ItemSpec | undefined {
  return MAIN_ITEMS[type] ?? COMPONENTS[type];
}
