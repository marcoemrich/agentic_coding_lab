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

/** Raised for any scenario the MHPCO refuses to process. */
export class ClaimOfficeError extends Error {}
