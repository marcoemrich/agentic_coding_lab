import { ClaimResult, Damage, Item } from './types';
import { catalogEntry } from './catalog';

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT = 0.5;

export class Policy {
  private remainingCap: number;

  constructor(private readonly items: Item[]) {
    this.remainingCap = CAP_MULTIPLIER * items.reduce((sum, item) => sum + (catalogEntry(item.type)?.insuranceValue ?? 0), 0);
  }

  claim(damages: Damage[]): ClaimResult {
    const undamagedItems = [...this.items];
    const desired = damages.reduce((sum, damage) => sum + payoutFor(damage, undamagedItems), 0);
    const payout = Math.floor(Math.min(desired, this.remainingCap));
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}

function payoutFor(damage: Damage, undamagedItems: Item[]): number {
  if (damage.amount < 0) throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  const index = undamagedItems.findIndex((insured) => insured.type === damage.itemType);
  if (index === -1) throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
  const [item] = undamagedItems.splice(index, 1);
  return Math.max(0, reimbursement(item, damage.amount) - DEDUCTIBLE);
}

function reimbursement(item: Item, amount: number): number {
  return (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL ? amount * HALF_REIMBURSEMENT : amount;
}
