export interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
  isComponent: boolean;
}

export const CATALOG: Record<string, ItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100, isComponent: false },
  amulet: { insuranceValue: 600, basePremium: 60, isComponent: false },
  staff: { insuranceValue: 800, basePremium: 80, isComponent: false },
  potion: { insuranceValue: 400, basePremium: 40, isComponent: false },
  rune: { insuranceValue: 250, basePremium: 25, isComponent: true },
  moonstone: { insuranceValue: 250, basePremium: 25, isComponent: true },
};

/** Special base premium for a building block of exactly 3 alike components. */
export const COMPONENT_BLOCK_SIZE = 3;
export const COMPONENT_BLOCK_PREMIUM = 60;

export function specFor(type: string): ItemSpec {
  const spec = CATALOG[type];
  if (!spec) throw new Error(`unknown item type: ${type}`);
  return spec;
}
