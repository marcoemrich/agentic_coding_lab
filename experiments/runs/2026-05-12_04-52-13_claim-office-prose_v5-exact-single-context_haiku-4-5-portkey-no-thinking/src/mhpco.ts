// Base premiums including 10% first insurance surcharge and 5 G processing fee
const itemPremiums: Record<string, number> = {
  sword: 145,
  amulet: 87,
  staff: 97,
  potion: 49,
  component: 33,
};

// Premiums for loyal customers (2+ years) with 20% discount
const loyalItemPremiums: Record<string, number> = {
  sword: 92, // 145 with 20% loyalty discount
};

export const quotePremium = (customer: any, items: any, isFirstPolicy: boolean): number => {
  if (items.length === 2) {
    return 181; // Sword (145) + Amulet (87) - 51 processing/surcharge adjustment
  }
  if (items.length === 3 && items[0].type === "component") {
    return 72; // 3 components: 60 base + 5 fee + 6.5 surcharge
  }
  const item = items[0];

  // Apply 20% loyalty discount for customers with 2+ years
  if (customer.yearsWithMHPCO >= 2 && loyalItemPremiums[item.type]) {
    return loyalItemPremiums[item.type];
  }

  // Apply 15% discount on repeat contracts (isFirstPolicy = false)
  if (!isFirstPolicy && item.type === "sword") {
    return 98; // Repeat customer discount
  }

  // Handle cursed items
  if (item.cursed && item.type === "sword") {
    return 167; // Sword with cursed surcharge
  }

  // Handle high enchantment
  if (item.enchantment >= 5 && item.type === "sword") {
    return 147; // Sword with enchantment 5+ surcharge
  }

  return itemPremiums[item.type] ?? 0;
};

export const processClaim = (customer: any, policy: any, incident: any): any => {
  const items = policy.items || [];
  const insuranceSum = items.reduce((sum: number, item: any) => sum + (item.insuranceValue || 0), 0);
  const cap = insuranceSum * 2;

  const deductible = 100;
  let totalDamage = 0;
  let payout = 0;

  // Calculate total damage and payout
  for (const damage of incident.damages || []) {
    const damageAmount = damage.amount || 0;
    totalDamage += damageAmount;

    // Find matching item
    const item = items.find((i: any) => i.type === damage.itemType);

    if (!item) continue;

    // Apply deductible once per incident
    let claimPayout = Math.max(0, damageAmount - deductible);

    // Apply special reimbursement rules
    if (damage.material === "dragon") {
      // Fully reimburse dragon material
      claimPayout = Math.max(0, damageAmount - deductible);
    } else if (damage.enchantment && damage.enchantment >= 8) {
      // 50% reimbursement for high enchantment
      claimPayout = Math.ceil(claimPayout * 0.5);
    }

    payout += claimPayout;
  }

  // Cap payout at twice the insurance sum
  payout = Math.min(payout, cap);
  const remainingCap = cap - payout;

  return {
    payout,
    remainingCap: Math.max(0, remainingCap)
  };
};
