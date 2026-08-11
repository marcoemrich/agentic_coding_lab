import { ClaimOfficeError } from './types.js';

interface CatalogEntry {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
}

/** The MHPCO price list: insurance value and base premium, in G. */
const MAIN_ITEMS: Record<string, [insuranceValue: number, basePremium: number]> = {
  /* eslint-disable no-magic-numbers -- the price list is the specification */
  sword: [1_000, 100],
  amulet: [600, 60],
  staff: [800, 80],
  potion: [400, 40],
  /* eslint-enable no-magic-numbers */
};

const COMPONENTS = ['rune', 'moonstone'];
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;

/** Base premium for a building block of exactly 3 alike components. */
export const BLOCK_SIZE = 3;
export const BLOCK_PREMIUM = 60;

const CATALOG: Record<string, CatalogEntry> = {
  ...Object.fromEntries(
    Object.entries(MAIN_ITEMS).map(([type, [insuranceValue, basePremium]]) => [
      type,
      { insuranceValue, basePremium, component: false },
    ]),
  ),
  ...Object.fromEntries(
    COMPONENTS.map((type) => [
      type,
      {
        insuranceValue: COMPONENT_INSURANCE_VALUE,
        basePremium: COMPONENT_BASE_PREMIUM,
        component: true,
      },
    ]),
  ),
};

export function lookup(type: string): CatalogEntry {
  const entry = CATALOG[type];
  if (!entry) {
    throw new ClaimOfficeError(`unknown item type: ${type}`);
  }
  return entry;
}

export const isComponent = (type: string): boolean => lookup(type).component;
