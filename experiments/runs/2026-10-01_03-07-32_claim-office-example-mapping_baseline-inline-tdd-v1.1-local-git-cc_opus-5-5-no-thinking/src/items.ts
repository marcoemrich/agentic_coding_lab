export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export class ClaimOfficeError extends Error {}

interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
}

const COMPONENT: ItemSpec = { insuranceValue: 250, basePremium: 25, component: true };

const PRICE_LIST: Record<string, ItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100, component: false },
  amulet: { insuranceValue: 600, basePremium: 60, component: false },
  staff: { insuranceValue: 800, basePremium: 80, component: false },
  potion: { insuranceValue: 400, basePremium: 40, component: false },
  rune: COMPONENT,
  moonstone: COMPONENT,
};

export const COMPONENT_BLOCK_SIZE = 3;
export const COMPONENT_BLOCK_PREMIUM = 60;

export function specFor(type: string): ItemSpec {
  if (!Object.hasOwn(PRICE_LIST, type)) {
    throw new ClaimOfficeError(`Unknown item type: ${type}`);
  }
  return PRICE_LIST[type];
}
