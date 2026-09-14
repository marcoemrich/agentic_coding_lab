export type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone';

export interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
}

const CATALOG: Record<ItemType, ItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100, component: false },
  amulet: { insuranceValue: 600, basePremium: 60, component: false },
  staff: { insuranceValue: 800, basePremium: 80, component: false },
  potion: { insuranceValue: 400, basePremium: 40, component: false },
  rune: { insuranceValue: 250, basePremium: 25, component: true },
  moonstone: { insuranceValue: 250, basePremium: 25, component: true },
};

export const BLOCK_SIZE = 3;
export const BLOCK_PREMIUM = 60;
export const PROCESSING_FEE = 5;
export const DEDUCTIBLE = 100;
export const CAP_FACTOR = 2;

export class UnknownItemTypeError extends Error {
  constructor(type: string) {
    super(`Unknown item type: ${type}`);
    this.name = 'UnknownItemTypeError';
  }
}

export function specFor(type: string): ItemSpec {
  const spec = CATALOG[type as ItemType];
  if (!spec) throw new UnknownItemTypeError(type);
  return spec;
}

export function isComponent(type: string): boolean {
  return specFor(type).component;
}
