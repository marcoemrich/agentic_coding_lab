import type { Item } from "./premium.js";

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: DamageEntry[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export function processClaim(policyItems: Item[], incident: Incident, previousPayouts: number): ClaimResult {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Invalid damage amount: ${damage.amount}`);
    }
    if (!INSURANCE_VALUE[damage.itemType]) {
      throw new Error(`Unknown item type: ${damage.itemType}`);
    }

    const policyTypeCount = policyItems.filter((item) => item.type === damage.itemType).length;
    if (policyTypeCount === 0) {
      throw new Error(`Item type not in policy: ${damage.itemType}`);
    }

    const damageTypeCount = incident.damages.filter((d) => d.itemType === damage.itemType).length;
    if (damageTypeCount > policyTypeCount) {
      throw new Error(`More damages for ${damage.itemType} than insured`);
    }
  }

  let insuranceSum = 0;
  for (const item of policyItems) {
    insuranceSum += INSURANCE_VALUE[item.type];
  }
  const cap = insuranceSum * 2;
  const remainingCap = cap - previousPayouts;

  let payout = 0;

  for (const damage of incident.damages) {
    const policyItem = policyItems.find((item) => item.type === damage.itemType);
    let reimbursement = damage.amount;

    if (policyItem) {
      const enchantment = policyItem.enchantment ?? 0;
      const isDragonMaterial = policyItem.material === "dragon";

      if (enchantment >= 8) {
        reimbursement = reimbursement * 0.5;
      } else if (isDragonMaterial) {
        reimbursement = reimbursement;
      }
    }

    const afterDeductible = reimbursement - 100;
    if (afterDeductible > 0) {
      payout += afterDeductible;
    }
  }

  payout = Math.min(payout, remainingCap);

  return {
    payout: Math.floor(payout),
    remainingCap: remainingCap - Math.floor(payout),
  };
}