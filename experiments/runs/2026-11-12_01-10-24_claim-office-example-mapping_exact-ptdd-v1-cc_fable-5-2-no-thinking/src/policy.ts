import type { Item } from "./item.js";
import { insuranceSum } from "./price-list.js";
import { damagePayout } from "./reimbursement.js";
import { roundPayoutInFavorOfMHPCO } from "./rounding.js";

const CAP_PER_INSURANCE_SUM = 2;

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimSettlement {
  payout: number;
  remainingCap: number;
}

interface CoveredDamage {
  item: Item;
  amount: number;
}

export class Policy {
  private remainingCap: number;

  constructor(private readonly insuredItems: Item[]) {
    this.remainingCap = CAP_PER_INSURANCE_SUM * insuranceSum(insuredItems);
  }

  settleClaim(damages: Damage[]): ClaimSettlement {
    const damagePayouts = coveredDamages(this.insuredItems, damages)
      .map(({ item, amount }) => damagePayout(item, amount))
      .reduce((sum, payout) => sum + payout, 0);
    const payout = Math.min(roundPayoutInFavorOfMHPCO(damagePayouts), this.remainingCap);
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}

// Every damage entry needs its own insured item; a claim reporting more than the policy
// covers is rejected as a whole.
function coveredDamages(insuredItems: Item[], damages: Damage[]): CoveredDamage[] {
  const undamagedItems = [...insuredItems];
  return damages.map(({ itemType, amount }) => {
    if (amount < 0) throw new Error(`Damage amount must not be negative: ${amount}`);
    return { item: takeItemOfType(undamagedItems, itemType), amount };
  });
}

function takeItemOfType(undamagedItems: Item[], itemType: string): Item {
  const index = undamagedItems.findIndex((item) => item.type === itemType);
  if (index === -1) throw new Error(`Damaged item is not covered by the policy: ${itemType}`);
  return undamagedItems.splice(index, 1)[0];
}
