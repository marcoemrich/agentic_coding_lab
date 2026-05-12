const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

function computeBasePremium(items: any[]): number {
  const mainItemPremium = items
    .filter((item: any) => !COMPONENT_TYPES.has(item.type))
    .reduce((sum: number, item: any) => sum + (BASE_PREMIUM[item.type] ?? 0), 0);

  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    }
  }

  const componentPremium = Object.entries(componentCounts).reduce(
    (sum, [type, count]) =>
      sum + (count === BLOCK_SIZE ? BLOCK_PREMIUM : count * (BASE_PREMIUM[type] ?? 0)),
    0
  );

  return mainItemPremium + componentPremium;
}

function computeQuotePremium(items: any[], customer: any, isFollowUp: boolean): number {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) throw new Error(`Unknown item type: "${item.type}"`);
  }
  const basePremium = computeBasePremium(items);
  const itemSurcharges = items.reduce((sum: number, item: any) => {
    const itemBase = BASE_PREMIUM[item.type] ?? 0;
    const cursedSurcharge = item.cursed ? itemBase * CURSED_SURCHARGE_RATE : 0;
    const enchantmentSurcharge = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
    return sum + cursedSurcharge + enchantmentSurcharge;
  }, 0);
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_RATE;
  return Math.ceil(basePremium + itemSurcharges - loyaltyDiscount - followUpDiscount + firstInsuranceSurcharge + PROCESSING_FEE);
}

function computeDamageReimbursement(damage: any, item: any): number {
  const reimbursableAmount = item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE
    : damage.amount;
  return Math.max(0, reimbursableAmount - DEDUCTIBLE);
}

function processClaim(policy: { items: any[], insuranceSum: number, remainingCap: number }, incident: any): { payout: number, remainingCap: number } {
  const damageCounts: Record<string, number> = {};
  for (const damage of incident.damages) {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  const policyCounts: Record<string, number> = {};
  for (const item of policy.items) {
    policyCounts[item.type] = (policyCounts[item.type] ?? 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0)) {
      throw new Error(`More damage entries for "${type}" than policy covers`);
    }
  }
  const uncappedPayout = incident.damages.reduce((sum: number, damage: any) => {
    const item = policy.items.find((i: any) => i.type === damage.itemType);
    if (!item) throw new Error(`Item type "${damage.itemType}" is not covered by this policy`);
    return sum + computeDamageReimbursement(damage, item);
  }, 0);
  const payout = Math.floor(Math.min(uncappedPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: any): any {
  let quoteCount = 0;
  const policies: Record<number, { items: any[], insuranceSum: number, remainingCap: number }> = {};
  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "quote") {
      const premium = computeQuotePremium(step.items, scenario.customer, quoteCount > 0);
      const insuranceSum = step.items.reduce((sum: number, item: any) => sum + (INSURANCE_VALUE[item.type] ?? 0), 0);
      policies[index] = { items: step.items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
      quoteCount++;
      return { premium };
    }
    if (step.op === "claim") {
      return processClaim(policies[step.policy], step.incident);
    }
  });
  return { results };
}
