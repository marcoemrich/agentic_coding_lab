const PROCESSING_FEE = 5;
const BLOCK_OF_THREE_PRICE = 60;
const DEDUCTIBLE = 100;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

function calculateItemPremium(item: any): number {
  const base = BASE_PREMIUMS[item.type];
  let premium = base;
  if (item.cursed) {
    premium += base * 0.5;
  }
  if (item.enchantment >= 5) {
    premium += base * 0.3;
  }
  return premium;
}

export function claimOffice(input: any): unknown {
  const results: unknown[] = [];
  let quoteIndex = 0;
  const policies: Array<{ insuranceSum: number; remainingCap: number; items: any[] }> = [];

  for (let stepIndex = 0; stepIndex < input.steps.length; stepIndex++) {
    const step = input.steps[stepIndex];
    if (step.op === "claim") {
      const policy = policies[step.policy];
      const damageTypeCounts: Record<string, number> = {};
      for (const damage of step.incident.damages) {
        damageTypeCounts[damage.itemType] = (damageTypeCounts[damage.itemType] || 0) + 1;
      }
      const policyTypeCounts: Record<string, number> = {};
      for (const item of policy.items) {
        policyTypeCounts[item.type] = (policyTypeCounts[item.type] || 0) + 1;
      }
      for (const type in damageTypeCounts) {
        if (damageTypeCounts[type] > (policyTypeCounts[type] || 0)) {
          throw new Error(`More damages of type ${type} than policy covers`);
        }
      }

      let totalPayout = 0;
      for (const damage of step.incident.damages) {
        if (damage.amount < 0) {
          throw new Error("Negative damage amount");
        }
        let damageAmount = damage.amount;
        const matchedItem = policy.items.find((i: any) => i.type === damage.itemType);
        if (!matchedItem) {
          throw new Error(`Item type not in policy: ${damage.itemType}`);
        }
        if (matchedItem.enchantment >= 8) {
          damageAmount = damageAmount * 0.5;
        }
        const reimbursement = damageAmount - DEDUCTIBLE;
        if (reimbursement > 0) {
          totalPayout += reimbursement;
        }
      }
      if (totalPayout > policy.remainingCap) {
        totalPayout = policy.remainingCap;
      }
      totalPayout = Math.floor(totalPayout);
      policy.remainingCap -= totalPayout;
      results.push({ payout: totalPayout, remainingCap: policy.remainingCap });
      continue;
    }
    const items = step.items;
    let itemsTotal = 0;
    let policyBase = 0;

    const typeCounts: Record<string, number> = {};
    for (const item of items) {
      if (!(item.type in BASE_PREMIUMS)) {
        throw new Error(`Unknown item type: ${item.type}`);
      }
      itemsTotal += calculateItemPremium(item);
      policyBase += BASE_PREMIUMS[item.type];
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    }

    for (const type in typeCounts) {
      if (typeCounts[type] === 3) {
        itemsTotal = itemsTotal - (3 * BASE_PREMIUMS[type]) + BLOCK_OF_THREE_PRICE;
      }
    }

    let policyModifier = 0;
    if (input.customer.yearsWithMHPCO >= 2) {
      policyModifier -= policyBase * 0.2;
    }
    policyModifier += policyBase * 0.1;
    if (quoteIndex > 0) {
      policyModifier -= policyBase * 0.15;
    }

    const premium = Math.ceil(itemsTotal + policyModifier + PROCESSING_FEE);
    results.push({ premium });

    let insuranceSum = 0;
    for (const item of items) {
      insuranceSum += INSURANCE_VALUES[item.type];
    }
    policies[stepIndex] = { insuranceSum, remainingCap: insuranceSum * 2, items };

    quoteIndex++;
  }

  return { results };
}
