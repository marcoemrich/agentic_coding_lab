// The shared MHPCO vocabulary: the customer and the items a policy can cover,
// mirroring the binding input schema. Both operations read this vocabulary --
// quote reads cursed and enchantment for its risk surcharges, claim reads
// material and enchantment for its reimbursement clauses -- so it belongs to
// neither operation's policy module.
export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}
