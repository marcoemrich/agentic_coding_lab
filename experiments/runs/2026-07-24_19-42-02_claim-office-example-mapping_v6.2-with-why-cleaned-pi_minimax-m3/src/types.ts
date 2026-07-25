// Shared types for the MHPCO claim office.

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  capRemaining: number;
}
