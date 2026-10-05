export type Damage = { itemType: string; amount: number };
export function validDamageAmount(damage: Damage): number {
  if (damage.amount < 0) throw new Error('Damage amount must not be negative');
  return damage.amount;
}
