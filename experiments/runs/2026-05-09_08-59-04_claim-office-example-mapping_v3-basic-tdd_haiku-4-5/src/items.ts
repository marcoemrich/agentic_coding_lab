export interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
}

export const ITEM_SPECS: Record<string, ItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

export function getItemSpec(type: string): ItemSpec {
  const spec = ITEM_SPECS[type];
  if (!spec) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return spec;
}
