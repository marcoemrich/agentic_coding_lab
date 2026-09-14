export interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
}

const MAIN_ITEMS: Record<string, ItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100, component: false },
  amulet: { insuranceValue: 600, basePremium: 60, component: false },
  staff: { insuranceValue: 800, basePremium: 80, component: false },
  potion: { insuranceValue: 400, basePremium: 40, component: false },
};

const COMPONENTS = ['rune', 'moonstone'];

const COMPONENT_SPEC: ItemSpec = {
  insuranceValue: 250,
  basePremium: 25,
  component: true,
};

export function specFor(type: string): ItemSpec | undefined {
  if (Object.prototype.hasOwnProperty.call(MAIN_ITEMS, type)) {
    return MAIN_ITEMS[type];
  }
  if (COMPONENTS.includes(type)) {
    return COMPONENT_SPEC;
  }
  return undefined;
}
