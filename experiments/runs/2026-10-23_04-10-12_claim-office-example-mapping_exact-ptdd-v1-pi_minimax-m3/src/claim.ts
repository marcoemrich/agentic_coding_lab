export type Damage = {
  itemType: string;
  amount: number;
};

export type PolicyItem = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Policy = {
  items: PolicyItem[];
  remainingCap: number;
};

export function claim(_policy: Policy, _damages: Damage[]): { payout: number; remainingCap: number } {
  return { payout: 0, remainingCap: 0 };
}
