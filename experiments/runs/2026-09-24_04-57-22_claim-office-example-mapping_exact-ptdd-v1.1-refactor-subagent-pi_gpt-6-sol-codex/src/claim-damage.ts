const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

type Item = { enchantment?: number };
type Damage = { amount: number };

export function assertNonnegativeDamage(damage: Damage): void {
  if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
}

function isHighlyEnchantedForClaims(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function reimbursableDamageAmount(item: Item, damage: Damage): number {
  return isHighlyEnchantedForClaims(item)
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT : damage.amount;
}

export function damagePayout(item: Item, damage: Damage): number {
  return Math.max(0, reimbursableDamageAmount(item, damage) - DEDUCTIBLE);
}
