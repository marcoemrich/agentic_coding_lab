import type { Item } from './quote';

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => {
    const value = INSURANCE_VALUE[item.type];
    if (value === undefined) {
      throw new Error(`unknown item type: ${item.type}`);
    }
    return sum + value;
  }, 0);
}

/**
 * Damage to a highly enchanted item is reimbursed at half; dragon
 * material is reimbursed in full, which is already the default, so the
 * enchantment clause wins whenever both would apply.
 */
function reimbursableAmount(item: Item, damage: number): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
    ? damage * HIGH_ENCHANTMENT_REIMBURSEMENT
    : damage;
}

export class Policy {
  private cap: number;

  constructor(private readonly items: Item[]) {
    this.cap = CAP_MULTIPLIER * insuranceSum(items);
  }

  /**
   * Settles one damage event. A damage entry that names an item the
   * policy does not cover — or that exceeds the number of copies
   * insured — rejects the whole claim, leaving the cap untouched.
   */
  claim(damages: Damage[]): ClaimResult {
    const uncovered = [...this.items];
    let payout = 0;

    for (const damage of damages) {
      if (damage.amount < 0) {
        throw new Error(`negative damage amount: ${damage.amount}`);
      }
      const index = uncovered.findIndex((item) => item.type === damage.itemType);
      if (index === -1) {
        throw new Error(`item not covered by the policy: ${damage.itemType}`);
      }
      const [item] = uncovered.splice(index, 1);
      // The deductible applies once per damaged item.
      payout += reimbursableAmount(item, damage.amount) - DEDUCTIBLE;
    }

    // Rounded down, in the MHPCO's favour, then limited by the cap.
    payout = Math.min(Math.floor(payout), this.cap);
    this.cap -= payout;
    return { payout, remainingCap: this.cap };
  }
}
