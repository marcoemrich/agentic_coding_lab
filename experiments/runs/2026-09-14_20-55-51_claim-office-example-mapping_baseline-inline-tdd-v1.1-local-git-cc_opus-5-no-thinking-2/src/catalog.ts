export type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone';

export interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
}

/**
 * The MHPCO price list. Components (runes, moonstones) share a uniform
 * 250 G / 25 G rate and are eligible for the building-block premium.
 */
const CATALOG: Record<ItemType, ItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100, component: false },
  amulet: { insuranceValue: 600, basePremium: 60, component: false },
  staff: { insuranceValue: 800, basePremium: 80, component: false },
  potion: { insuranceValue: 400, basePremium: 40, component: false },
  rune: { insuranceValue: 250, basePremium: 25, component: true },
  moonstone: { insuranceValue: 250, basePremium: 25, component: true },
};

export class UnknownItemTypeError extends Error {
  constructor(type: string) {
    super(`unknown item type: ${type}`);
    this.name = 'UnknownItemTypeError';
  }
}

export function lookup(type: string): ItemSpec {
  const spec = CATALOG[type as ItemType];
  if (!spec) throw new UnknownItemTypeError(type);
  return spec;
}

export function isKnownType(type: string): boolean {
  return Object.prototype.hasOwnProperty.call(CATALOG, type);
}
