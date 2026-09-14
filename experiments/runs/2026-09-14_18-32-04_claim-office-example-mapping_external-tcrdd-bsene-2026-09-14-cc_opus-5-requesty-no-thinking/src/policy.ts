import type { Item } from './quote.js';

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
const CLAUSE_ENCHANTMENT_LEVEL = 8;
const CLAUSE_REIMBURSEMENT = 0.5;

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

/** The insured value of the policy — unaffected by any premium modifier. */
export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => {
    const value = INSURANCE_VALUE[item.type];
    if (value === undefined) {
      throw new Error(`unknown item type: ${item.type}`);
    }
    return sum + value;
  }, 0);
}

export class Policy {
  private remainingCap: number;

  constructor(private readonly items: Item[]) {
    this.remainingCap = insuranceSum(items) * CAP_MULTIPLIER;
  }

  claim(incident: Incident): ClaimResult {
    const desired = this.desiredPayout(incident);
    const payout = Math.floor(Math.min(desired, this.remainingCap));
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }

  /**
   * Each damage entry is matched to a distinct insured item, so two entries of
   * the same type need two insured items of that type. Reimbursement is per
   * entry, with its own deductible.
   */
  private desiredPayout(incident: Incident): number {
    const available = [...this.items];
    let desired = 0;
    for (const damage of incident.damages) {
      if (damage.amount < 0) {
        throw new Error(`negative damage amount: ${damage.amount}`);
      }
      const index = available.findIndex((candidate) => candidate.type === damage.itemType);
      if (index === -1) {
        throw new Error(`item not covered by the policy: ${damage.itemType}`);
      }
      const [item] = available.splice(index, 1);
      desired += reimburse(item, damage.amount) - DEDUCTIBLE;
    }
    return desired;
  }
}

/**
 * Highly enchanted items are reimbursed at half the damage; everything else,
 * dragon material included, is reimbursed in full.
 */
function reimburse(item: Item, amount: number): number {
  if (item.enchantment !== undefined && item.enchantment >= CLAUSE_ENCHANTMENT_LEVEL) {
    return amount * CLAUSE_REIMBURSEMENT;
  }
  return amount;
}
