import type { Item } from "./item.js";
import { multiply, rational, type Rational } from "./rational.js";

/** Reimbursement clauses decide how much of a damage amount MHPCO covers. */
const REDUCED_REIMBURSEMENT_PERCENT = 50;
const PERCENT = 100;
const REDUCED_REIMBURSEMENT_LEVEL = 8;

function isDeeplyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL;
}

export function reimbursableAmount(item: Item, damageAmountInG: number): Rational {
  const damage = rational(damageAmountInG);
  if (isDeeplyEnchanted(item)) {
    return multiply(damage, rational(REDUCED_REIMBURSEMENT_PERCENT, PERCENT));
  }
  return damage;
}
