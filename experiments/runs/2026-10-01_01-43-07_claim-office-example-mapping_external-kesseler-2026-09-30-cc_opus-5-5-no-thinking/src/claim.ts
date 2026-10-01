import { Item } from './premium';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

function reimbursement(item: Item, damage: Damage): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT : damage.amount;
}

function damagePayout(damagedItem: Item, damage: Damage): number {
  return Math.max(0, reimbursement(damagedItem, damage) - DEDUCTIBLE);
}

function damagedItems(insuredItems: Item[], damages: Damage[]): Item[] {
  const undamaged = [...insuredItems];
  return damages.map((damage) => {
    const index = undamaged.findIndex((item) => item.type === damage.itemType);
    if (index < 0) {
      throw new Error(`Policy does not cover a damaged ${damage.itemType}`);
    }
    return undamaged.splice(index, 1)[0];
  });
}

function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);
}

function assertNonNegative(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

export class Policy {
  private remainingCap: number;

  constructor(private readonly insuredItems: Item[]) {
    this.remainingCap = CAP_FACTOR * insuranceSum(insuredItems);
  }

  claim(damages: Damage[]): ClaimResult {
    damages.forEach(assertNonNegative);
    const items = damagedItems(this.insuredItems, damages);
    const requested = damages.reduce((total, damage, index) => total + damagePayout(items[index], damage), 0);
    const payout = Math.floor(Math.min(requested, this.remainingCap));
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}
