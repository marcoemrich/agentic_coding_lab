export type MainItemType = 'sword' | 'amulet' | 'staff' | 'potion';
export type ComponentItemType = 'rune' | 'moonstone';
export type ItemType = MainItemType | ComponentItemType;

export interface Item {
  type: ItemType;
  material: string;
  enchantment: number;
  cursed: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
  contractCount: number; // number of prior contracts (0 = first contract)
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface DamageEntry {
  itemType: ItemType;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: DamageEntry[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}
