import { ClaimOfficeError, Item, catalogEntry, insuranceSum } from './catalog';

export interface Damage {
  itemType: string;
  amount: number;
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

/** Share of the damage that is reimbursed. The 50 % high-enchantment rule wins over dragon material's full reimbursement. */
function reimbursementRate(item: Item): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) return HIGH_ENCHANTMENT_REIMBURSEMENT;
  return 1;
}

export class Policy {
  remainingCap: number;

  constructor(private readonly items: Item[]) {
    this.remainingCap = CAP_FACTOR * insuranceSum(items);
  }

  claim(damages: Damage[]): number {
    const used = new Set<Item>();
    let desired = 0;
    for (const damage of damages) {
      if (!Number.isFinite(damage.amount) || damage.amount < 0) {
        throw new ClaimOfficeError(`Invalid damage amount: ${damage.amount}`);
      }
      catalogEntry(damage.itemType);
      const item = this.items.find((candidate) => candidate.type === damage.itemType && !used.has(candidate));
      if (!item) throw new ClaimOfficeError(`Damaged item not covered by policy: ${damage.itemType}`);
      used.add(item);
      desired += Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
    }
    const payout = Math.floor(Math.min(desired, this.remainingCap));
    this.remainingCap -= payout;
    return payout;
  }
}
