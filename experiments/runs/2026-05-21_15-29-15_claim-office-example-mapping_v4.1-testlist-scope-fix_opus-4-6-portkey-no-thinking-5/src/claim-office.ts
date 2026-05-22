const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_MULTIPLIER = 10;

const DEDUCTIBLE = 100;

const COMPONENT_BLOCK_PREMIUM: Record<string, number> = {
  rune: 60,
  moonstone: 60,
};

function calculateBasePremium(items: any[]): number {
  const countsByType: Record<string, number> = {};
  for (const item of items) {
    countsByType[item.type] = (countsByType[item.type] ?? 0) + 1;
  }

  let total = 0;
  for (const type of Object.keys(countsByType)) {
    if (BASE_PREMIUMS[type] === undefined) {
      throw new Error(`Unknown item type: ${type}`);
    }
    const count = countsByType[type];
    if (count === 3 && COMPONENT_BLOCK_PREMIUM[type] !== undefined) {
      total += COMPONENT_BLOCK_PREMIUM[type];
    } else {
      total += count * BASE_PREMIUMS[type];
    }
  }
  return total;
}

function calculateItemSurcharges(items: any[]): number {
  let surcharges = 0;
  for (const item of items) {
    const itemBase = BASE_PREMIUMS[item.type];
    if (item.cursed) {
      surcharges += itemBase * CURSE_SURCHARGE_RATE;
    }
    if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
  }
  return surcharges;
}

function calculatePremium(items: any[], customer: any, isFollowUp: boolean): number {
  const basePremium = calculateBasePremium(items);
  const itemSurcharges = calculateItemSurcharges(items);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(basePremium + itemSurcharges + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

function reimbursementRateFor(item: any): number {
  if (item && item.enchantment >= CLAIM_ENCHANTMENT_THRESHOLD) {
    return CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return 1;
}

function calculateDamagePayout(damage: any, policyItems: any[]): number {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
  const matchedItem = policyItems.find((item: any) => item.type === damage.itemType);
  if (matchedItem === undefined) {
    throw new Error(`Item type not in policy: ${damage.itemType}`);
  }
  return damage.amount * reimbursementRateFor(matchedItem) - DEDUCTIBLE;
}

function processClaim(
  policy: { items: any[]; insuranceSum: number; remainingCap: number },
  incident: any,
): { payout: number; remainingCap: number } {
  const damageCountsByType: Record<string, number> = {};
  for (const damage of incident.damages) {
    damageCountsByType[damage.itemType] = (damageCountsByType[damage.itemType] ?? 0) + 1;
  }
  const insuredCountsByType: Record<string, number> = {};
  for (const item of policy.items) {
    insuredCountsByType[item.type] = (insuredCountsByType[item.type] ?? 0) + 1;
  }
  for (const type of Object.keys(damageCountsByType)) {
    if (damageCountsByType[type] > (insuredCountsByType[type] ?? 0)) {
      throw new Error(`More damage entries for type ${type} than insured items`);
    }
  }
  const totalPayout = Math.floor(
    incident.damages.reduce(
      (sum: number, damage: any) => sum + calculateDamagePayout(damage, policy.items),
      0,
    )
  );
  const clampedPayout = Math.min(totalPayout, policy.remainingCap);
  policy.remainingCap -= clampedPayout;
  return { payout: clampedPayout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: any): unknown {
  const { customer } = scenario;
  const results: any[] = [];
  const policies: { items: any[]; insuranceSum: number; remainingCap: number }[] = [];
  let quotesSeen = 0;
  for (const step of scenario.steps) {
    if (step.op === "claim") {
      results.push(processClaim(policies[step.policy], step.incident));
    } else {
      const isFollowUp = quotesSeen > 0;
      const premium = calculatePremium(step.items, customer, isFollowUp);
      results.push({ premium });
      const insuranceSum = step.items.reduce(
        (sum: number, item: any) => sum + BASE_PREMIUMS[item.type] * INSURANCE_VALUE_MULTIPLIER,
        0
      );
      policies.push({ items: step.items, insuranceSum, remainingCap: 2 * insuranceSum });
      quotesSeen++;
    }
  }
  return { results };
}
