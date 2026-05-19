const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function calculateReimbursement(policyItem: any, damageAmount: number): number {
  const rate = policyItem.enchantment >= CLAIM_ENCHANTMENT_THRESHOLD
    ? CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
  return damageAmount * rate;
}

function calculateItemPremium(item: any): { itemPremium: number; basePremium: number } {
  const basePremium = BASE_PREMIUM[item.type] ?? 0;
  const cursedSurcharge = item.cursed ? basePremium * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return { itemPremium: basePremium + cursedSurcharge + enchantmentSurcharge, basePremium };
}

function computePremiumBreakdown(items: any[]): { itemPremiums: number; policyBase: number } {
  const componentCounts: Record<string, number> = {};
  let itemPremiums = 0;
  let policyBase = 0;

  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      if (!(item.type in BASE_PREMIUM)) {
        throw new Error(`Unknown item type: ${item.type}`);
      }
      const { itemPremium, basePremium } = calculateItemPremium(item);
      policyBase += basePremium;
      itemPremiums += itemPremium;
    }
  }

  for (const [type, count] of Object.entries(componentCounts)) {
    const unitPrice = BASE_PREMIUM[type] ?? 0;
    const componentPremium = count === BLOCK_SIZE ? BLOCK_PREMIUM : count * unitPrice;
    itemPremiums += componentPremium;
    policyBase += count * unitPrice;
  }

  return { itemPremiums, policyBase };
}

function processClaim(
  step: any,
  policies: Record<number, any[]>,
  capRemaining: Record<number, number>,
): { payout: number; remainingCap: number } {
  const policyItems = policies[step.policy];
  const insuranceSum = policyItems.reduce(
    (sum: number, item: any) => sum + (INSURANCE_VALUE[item.type] ?? 0),
    0,
  );
  if (!(step.policy in capRemaining)) {
    capRemaining[step.policy] = insuranceSum * 2;
  }
  const damageCounts: Record<string, number> = {};
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCounts)) {
    const policyCount = policyItems.filter((item: any) => item.type === type).length;
    if (count > policyCount) {
      throw new Error(`More damages of type ${type} than policy covers`);
    }
  }

  let totalPayout = 0;
  for (const damage of step.incident.damages) {
    const policyItem = policyItems.find((item: any) => item.type === damage.itemType);
    if (!policyItem) {
      throw new Error(`Item type ${damage.itemType} not in policy`);
    }
    const reimbursement = calculateReimbursement(policyItem, damage.amount);
    const payout = reimbursement - DEDUCTIBLE;
    totalPayout += Math.max(0, payout);
  }
  totalPayout = Math.min(totalPayout, capRemaining[step.policy]);
  totalPayout = Math.floor(totalPayout);
  capRemaining[step.policy] -= totalPayout;
  return { payout: totalPayout, remainingCap: capRemaining[step.policy] };
}

function processQuote(
  step: any,
  index: number,
  yearsWithMHPCO: number,
): { premium: number } {
  const { itemPremiums, policyBase } = computePremiumBreakdown(step.items);
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? policyBase * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount =
    index > 0 ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  const premium =
    Math.ceil(
      itemPremiums +
        firstInsuranceSurcharge -
        loyaltyDiscount -
        followUpDiscount,
    ) + PROCESSING_FEE;
  return { premium };
}

export function processScenario(scenario: any): unknown {
  const policies: Record<number, any[]> = {};
  const capRemaining: Record<number, number> = {};

  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "claim") {
      return processClaim(step, policies, capRemaining);
    }
    policies[index] = step.items;
    return processQuote(step, index, scenario.customer.yearsWithMHPCO);
  });
  return { results };
}
