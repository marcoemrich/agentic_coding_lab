import type { ClaimResult, Damage, Item } from "./claimOffice";
import { percentOf } from "./percentage";

const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const FULL_REIMBURSEMENT_PERCENT = 100;

function reimbursementPercent(damagedItem: Item): number {
  const isHighlyEnchanted = (damagedItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL;
  return isHighlyEnchanted ? HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT : FULL_REIMBURSEMENT_PERCENT;
}

interface CoveredDamage {
  damage: Damage;
  coveringItem: Item;
}

function assertValidDamageAmounts(damages: Damage[]): void {
  const negativeDamage = damages.find((damage) => damage.amount < 0);
  if (negativeDamage) {
    throw new Error(`Damage amount must not be negative: ${negativeDamage.amount}`);
  }
}

function coverDamages(insuredItems: Item[], damages: Damage[]): CoveredDamage[] {
  const uncoveredItems = [...insuredItems];
  return damages.map((damage) => {
    const index = uncoveredItems.findIndex((item) => item.type === damage.itemType);
    if (index < 0) {
      throw new Error(`Damaged item is not insured by the policy: ${damage.itemType}`);
    }
    return { damage, coveringItem: uncoveredItems.splice(index, 1)[0] };
  });
}

function damagePayout({ damage, coveringItem }: CoveredDamage): number {
  return percentOf(damage.amount, reimbursementPercent(coveringItem)) - DEDUCTIBLE_PER_DAMAGE;
}

function claimPayout(insuredItems: Item[], damages: Damage[], remainingCap: number): number {
  assertValidDamageAmounts(damages);
  const desiredPayout = coverDamages(insuredItems, damages).reduce((sum, covered) => sum + damagePayout(covered), 0);
  return Math.floor(Math.min(desiredPayout, remainingCap));
}

export function settleClaim(insuredItems: Item[], damages: Damage[], remainingCap: number): ClaimResult {
  const payout = claimPayout(insuredItems, damages, remainingCap);
  return { payout, remainingCap: remainingCap - payout };
}
