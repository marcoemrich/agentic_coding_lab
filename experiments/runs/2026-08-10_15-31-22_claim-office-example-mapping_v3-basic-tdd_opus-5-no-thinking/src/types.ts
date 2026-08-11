export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

/** Signals a rejected scenario: the CLI turns this into a non-zero exit. */
export class ClaimOfficeError extends Error {}
