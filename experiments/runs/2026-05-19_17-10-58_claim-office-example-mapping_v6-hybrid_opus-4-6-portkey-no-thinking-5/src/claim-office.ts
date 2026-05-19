const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const BLOCK_PREMIUM = 60;
const BLOCK_SIZE = 3;
const CURSE_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

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
  rune: 250,
  moonstone: 250,
};

const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function calculatePremiumParts(items: any[]): { policyBase: number; itemSurcharges: number } {
  const componentCounts: Record<string, number> = {};
  let policyBase = 0;
  let itemSurcharges = 0;

  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS) && !COMPONENT_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: "${item.type}"`);
    }
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      const basePremium = BASE_PREMIUMS[item.type];
      policyBase += basePremium;
      if (item.cursed) {
        itemSurcharges += basePremium * CURSE_SURCHARGE_RATE;
      }
      if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
        itemSurcharges += basePremium * ENCHANTMENT_SURCHARGE_RATE;
      }
    }
  }

  for (const type in componentCounts) {
    const count = componentCounts[type];
    if (count === BLOCK_SIZE) {
      policyBase += BLOCK_PREMIUM;
    } else {
      policyBase += count * COMPONENT_PREMIUM;
    }
  }

  return { policyBase, itemSurcharges };
}

function processQuote(items: any[], customer: any, quoteCount: number): { premium: number } {
  const { policyBase, itemSurcharges } = calculatePremiumParts(items);
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
    ? policyBase * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = quoteCount > 0
    ? policyBase * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_RATE;
  const premium = Math.ceil(policyBase + itemSurcharges - loyaltyDiscount - followUpDiscount + firstInsuranceSurcharge + PROCESSING_FEE);
  return { premium };
}

interface Policy {
  items: any[];
  insuranceSum: number;
  remainingCap: number;
}

function validateDamages(damages: any[], policyItems: any[]): void {
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error("Negative damage amount");
    }
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] || 0) + 1;
  }
  for (const type in damageCounts) {
    const policyCount = policyItems.filter((i: any) => i.type === type).length;
    if (damageCounts[type] > policyCount) {
      throw new Error(`More damage entries for "${type}" than policy covers`);
    }
  }
}

function processClaim(policy: Policy, damages: any[]): { payout: number; remainingCap: number } {
  validateDamages(damages, policy.items);

  let totalPayout = 0;
  for (const damage of damages) {
    const policyItem = policy.items.find((i: any) => i.type === damage.itemType)!;
    let reimbursement = damage.amount;
    if (policyItem.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
      reimbursement = damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
    }
    const payout = reimbursement - DEDUCTIBLE;
    totalPayout += Math.max(0, payout);
  }
  totalPayout = Math.min(totalPayout, policy.remainingCap);
  totalPayout = Math.floor(totalPayout);
  policy.remainingCap -= totalPayout;
  return { payout: totalPayout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: any): unknown {
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};

  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "quote") {
      const items = step.items || [];
      const result = processQuote(items, scenario.customer, quoteCount);
      const insuranceSum = items.reduce(
        (sum: number, item: any) => sum + INSURANCE_VALUES[item.type],
        0,
      );
      policies[index] = {
        items,
        insuranceSum,
        remainingCap: insuranceSum * CAP_MULTIPLIER,
      };
      quoteCount++;
      return result;
    }
    if (step.op === "claim") {
      return processClaim(policies[step.policy], step.incident.damages);
    }
  });
  return { results };
}
