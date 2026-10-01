import { insuranceValue, type Item } from "./catalogue.js";
import { percentOf } from "./percent.js";

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

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

function insuranceSum(insuredItems: Item[]): number {
  return insuredItems.reduce((sum, item) => sum + insuranceValue(item), 0);
}

function fallsUnderHighEnchantmentClause(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL;
}

function reimbursableAmount(amount: number, item: Item): number {
  return fallsUnderHighEnchantmentClause(item) ? percentOf(amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT) : amount;
}

function damagePayout(damage: Damage, item: Item): number {
  return reimbursableAmount(damage.amount, item) - DEDUCTIBLE;
}

function takeInsuredItemFor(damage: Damage, unclaimedItems: Item[]): Item {
  const index = unclaimedItems.findIndex((insured) => insured.type === damage.itemType);
  if (index < 0) {
    throw new Error(`Damaged item is not insured by the policy: ${damage.itemType}`);
  }
  return unclaimedItems.splice(index, 1)[0];
}

function rejectNegativeAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function incidentPayout(incident: Incident, insuredItems: Item[]): number {
  const unclaimedItems = [...insuredItems];
  return incident.damages.reduce((sum, damage) => {
    rejectNegativeAmount(damage);
    return sum + damagePayout(damage, takeInsuredItemFor(damage, unclaimedItems));
  }, 0);
}

export class Policy {
  private remainingCap: number;

  constructor(private readonly insuredItems: Item[]) {
    this.remainingCap = CAP_MULTIPLIER * insuranceSum(insuredItems);
  }

  settleClaim(incident: Incident): ClaimResult {
    const payout = Math.floor(Math.min(incidentPayout(incident, this.insuredItems), this.remainingCap));
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}
