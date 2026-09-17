interface Damage {
  amount: number;
}

interface InsuredItem {
  enchantment?: number;
}

const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

function damageReimbursementRate(item: InsuredItem): number {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL
    ? REDUCED_REIMBURSEMENT_RATE : 1;
}

export function reimbursableDamage(damage: Damage, item: InsuredItem): number {
  return damage.amount * damageReimbursementRate(item);
}
