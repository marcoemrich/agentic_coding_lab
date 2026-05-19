const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const BLOCK_PREMIUM = 60;
const BLOCK_SIZE = 3;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function countComponentsByType(items: any[]): Record<string, number> {
  return items
    .filter((item) => COMPONENT_TYPES.has(item.type))
    .reduce(
      (counts: Record<string, number>, item) => ({
        ...counts,
        [item.type]: (counts[item.type] ?? 0) + 1,
      }),
      {},
    );
}

function componentGroupPremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
}

function calculateComponentPremium(items: any[]): number {
  return Object.values(countComponentsByType(items)).reduce(
    (sum, count) => sum + componentGroupPremium(count),
    0,
  );
}

function calculateItemPremium(item: any): { base: number; total: number } {
  if (COMPONENT_TYPES.has(item.type)) {
    return { base: 0, total: 0 };
  }
  if (!(item.type in BASE_PREMIUMS)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  const base = BASE_PREMIUMS[item.type];
  const cursedSurcharge = item.cursed ? base * 0.5 : 0;
  const enchantmentSurcharge = item.enchantment >= 5 ? base * 0.3 : 0;
  return { base, total: base + cursedSurcharge + enchantmentSurcharge };
}

function calculateQuotePremium(items: any[], customer: any, contractIndex: number): number {
  const itemPremiums = items.map((item) => calculateItemPremium(item));
  const itemTotal = itemPremiums.reduce((sum, p) => sum + p.total, 0);
  const nonComponentBase = itemPremiums.reduce((sum, p) => sum + p.base, 0);
  const componentTotal = calculateComponentPremium(items);
  const policyBasePremium = nonComponentBase + componentTotal;
  const firstInsurance = policyBasePremium * 0.1;
  const loyalty = customer.yearsWithMHPCO >= 2 ? policyBasePremium * 0.2 : 0;
  const followUp = contractIndex > 0 ? policyBasePremium * 0.15 : 0;
  return Math.ceil(PROCESSING_FEE + itemTotal + componentTotal + firstInsurance - loyalty - followUp);
}

function calculateInsuranceSum(items: any[]): number {
  return items.reduce((sum: number, item: any) => {
    if (COMPONENT_TYPES.has(item.type)) {
      return sum + COMPONENT_INSURANCE_VALUE;
    }
    return sum + (INSURANCE_VALUES[item.type] ?? 0);
  }, 0);
}

function validateDamages(damages: any[], policyItems: any[]): void {
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  for (const [itemType, count] of Object.entries(damageCounts)) {
    const policyCount = policyItems.filter((i: any) => i.type === itemType).length;
    if (policyCount === 0) {
      throw new Error(`Item type ${itemType} not in policy`);
    }
    if (count > policyCount) {
      throw new Error(`More damages of type ${itemType} than policy covers`);
    }
  }
}

function calculateDamagePayout(damage: any, policyItems: any[]): number {
  const item = policyItems.find((i: any) => i.type === damage.itemType);
  let reimbursement = damage.amount;
  if (item.enchantment >= 8) {
    reimbursement = damage.amount * 0.5;
  }
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function processClaim(
  damages: any[],
  policy: { items: any[]; remainingCap: number },
): { payout: number; remainingCap: number } {
  validateDamages(damages, policy.items);
  const uncappedPayout = damages.reduce(
    (sum, damage) => sum + calculateDamagePayout(damage, policy.items),
    0,
  );
  const payout = Math.min(uncappedPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout: Math.floor(payout), remainingCap: policy.remainingCap };
}

export function processScenario(scenario: any): any {
  let quoteIndex = 0;
  const policies: Record<number, { items: any[]; remainingCap: number }> = {};
  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "quote") {
      const insuranceSum = calculateInsuranceSum(step.items);
      policies[index] = { items: step.items, remainingCap: insuranceSum * 2 };
      return { premium: calculateQuotePremium(step.items, scenario.customer, quoteIndex++) };
    }
    if (step.op === "claim") {
      return processClaim(step.incident.damages, policies[step.policy]);
    }
  });
  return { results };
}
