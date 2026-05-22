const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const BASE_PREMIUMS: Record<string, number> = {
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

function typePremium(type: string, count: number): number {
  if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * (BASE_PREMIUMS[type] ?? 0);
}

function countByType(items: Array<{ type: string }>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
}

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function surchargeTotal<T extends { type: string }>(
  items: T[],
  appliesTo: (item: T) => boolean,
  rate: number,
): number {
  let total = 0;
  for (const item of items) {
    if (appliesTo(item)) {
      total += (BASE_PREMIUMS[item.type] ?? 0) * rate;
    }
  }
  return total;
}

function cursedSurchargeTotal(items: Array<{ type: string; cursed?: boolean }>): number {
  return surchargeTotal(items, (item) => !!item.cursed, CURSED_SURCHARGE_RATE);
}

function highEnchantmentSurchargeTotal(items: Array<{ type: string; enchantment?: number }>): number {
  return surchargeTotal(
    items,
    (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
  );
}

function basePremiumTotal(items: Array<{ type: string }>): number {
  const countsByType = countByType(items);
  let total = 0;
  for (const [type, count] of Object.entries(countsByType)) {
    total += typePremium(type, count);
  }
  return total;
}

function calculateQuotePremium(items: Array<{ type: string; cursed?: boolean; enchantment?: number }>, yearsWithMHPCO: number, quoteIndex: number): number {
  const policyBasePremium = basePremiumTotal(items);
  const itemAdjustedTotal = policyBasePremium + cursedSurchargeTotal(items) + highEnchantmentSurchargeTotal(items);

  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_THRESHOLD ? policyBasePremium * LOYALTY_DISCOUNT_RATE : 0;
  const firstInsuranceSurcharge = policyBasePremium * FIRST_INSURANCE_RATE;
  const followUpDiscount = quoteIndex > 0 ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  const rawPremium = itemAdjustedTotal - loyaltyDiscount + firstInsuranceSurcharge - followUpDiscount + PROCESSING_FEE;
  return Math.ceil(rawPremium);
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

interface ScenarioOutcome {
  results: Array<QuoteResult | ClaimResult>;
}

function damageReimbursement(
  damage: { type: string; amount: number },
  policyItems: Array<{ type: string; enchantment?: number }>,
): number {
  const policyItem = policyItems.find((item) => item.type === damage.type);
  const enchantment = policyItem?.enchantment ?? 0;
  const reimbursement = enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return reimbursement - DEDUCTIBLE;
}

function calculateClaimResult(
  policy: { items: Array<{ type: string; enchantment?: number }> },
  damages: Array<{ type: string; amount: number }>,
): ClaimResult {
  const insuranceSum = policy.items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
  const cap = insuranceSum * CAP_MULTIPLIER;
  const totalPayout = damages.reduce((sum, damage) => sum + damageReimbursement(damage, policy.items), 0);
  return { payout: totalPayout, remainingCap: cap - totalPayout };
}

export function processScenario(scenario: {
  customer: { yearsWithMHPCO: number };
  steps: Array<{
    op: string;
    items?: Array<{ type: string; cursed?: boolean; enchantment?: number }>;
    policy?: number;
    incident?: { cause: string; damages: Array<{ type: string; amount: number }> };
  }>;
}): ScenarioOutcome {
  const results: Array<QuoteResult | ClaimResult> = [];
  const policies: Array<{ items: Array<{ type: string; cursed?: boolean; enchantment?: number }> }> = [];

  for (const step of scenario.steps) {
    if (step.op === "claim") {
      results.push(calculateClaimResult(policies[step.policy!], step.incident!.damages));
    } else {
      const items = step.items ?? [];
      results.push({
        premium: calculateQuotePremium(items, scenario.customer.yearsWithMHPCO, policies.length),
      });
      policies.push({ items });
    }
  }

  return { results };
}
