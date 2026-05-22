export type ItemType =
  | 'sword'
  | 'amulet'
  | 'staff'
  | 'potion'
  | 'rune'
  | 'moonstone';

export interface Item {
  type: ItemType | string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
  contractCount: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}
