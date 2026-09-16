export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;

/** The MHPCO price list: base premium per item, in G. */
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

/** The MHPCO price list: insurance value per item, in G. */
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

/** The MHPCO does not insure what its price list does not name. */
export class UninsurableItemError extends Error {
  constructor(type: string) {
    super(`The MHPCO does not insure items of type "${type}"`);
    this.name = "UninsurableItemError";
  }
}

export function basePremiumOf(type: string): number {
  const premium = BASE_PREMIUMS[type];
  if (premium === undefined) {
    throw new UninsurableItemError(type);
  }
  return premium;
}

export function insuranceValueOf(type: string): number {
  const value = INSURANCE_VALUES[type];
  if (value === undefined) {
    throw new UninsurableItemError(type);
  }
  return value;
}
